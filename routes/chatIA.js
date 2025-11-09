import express from "express";
import fetch from "node-fetch";
import db from "../DataBase/DataBase.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAllInfoByID } from "../controllers/pacientes.js";



const router = express.Router();

router.get("/voice-session/:id_paciente", async (req, res) => {
  const documentacionPaciente = await getAllInfoByID(req.params.id_paciente);
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
        modalities: ["audio", "text"],
        instructions: `
          Eres RenAI, asistente de voz para pacientes renales. 
          Tu tono es cálido y empático. 
          Brinda apoyo emocional, consejos generales de bienestar y recordatorios de tratamiento. 
          No des diagnósticos ni cambies medicación. 
          Si pregunta algo médico, sugiere hablar con su doctor. 
          Datos: ${documentacionPaciente ? JSON.stringify(documentacionPaciente) : "sin datos"}.
        `.trim(),
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error creando sesión Realtime:", err);
    res.status(500).send("Error creando sesión Realtime");
  }
});

// Crear carpeta si no existe
const uploadDir = path.resolve("public/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ===================================================
// 💬 Endpoint único: crear conversación + enviar mensaje (texto o imagen)
// ===================================================
router.post("/mensaje", upload.single("image"), async (req, res) => {
  const expedientepacietne = await getAllInfoByID(req.body.id_usuario);
  try {
  let { id_conversacion, id_usuario, mensaje_usuario } = req.body;
  if (id_conversacion === "null" || id_conversacion === "" || id_conversacion === undefined) {
    id_conversacion = null;
  } else {
    id_conversacion = Number(id_conversacion);
  }
    const tieneImagen = !!req.file;

    let imagePath = null;
    let base64Image = null;

    if (tieneImagen) {
      imagePath = `/images/${req.file.filename}`;
      base64Image = fs.readFileSync(req.file.path, { encoding: "base64" });
    }

    // 1️⃣ Crear conversación si no existe
    if (!id_conversacion) {
      const [newConv] = await db
        .promise()
        .query(
          "INSERT INTO conversaciones_ia (id_usuario, titulo) VALUES (?, ?)",
          [id_usuario, "Conversación en curso"]
        );
      id_conversacion = newConv.insertId;
    }

    // 2️⃣ Guardar mensaje del usuario
    const tipoMensaje = tieneImagen ? "imagen" : "texto";
    const contenidoUsuario = tieneImagen ? (mensaje_usuario || "Imagen enviada") : mensaje_usuario;

    const [userMsg] = await db.promise().query(
      "INSERT INTO mensajes_ia (id_conversacion, remitente, contenido, tipo) VALUES (?, 'usuario', ?, ?)",
      [id_conversacion, contenidoUsuario, tipoMensaje]
    );

    const id_mensaje = userMsg.insertId;

    // 3️⃣ Preparar mensaje para OpenAI
    const systemPrompt = `
    Eres RenAI, asistente empática para pacientes renales. 
    Da apoyo emocional y consejos generales, sin diagnósticos ni nombres de fármacos. 
    Si analizas comida (texto o imagen), responde con una explicación breve y amable, 
    y al final agrega un JSON **sin anunciarlo ni comentarlo** con esta estructura exacta:
    {
      "sodio": <mg>,
      "potasio": <mg>,
      "fosforo": <mg>,
      "calorias": <kcal>,
      "recomendado": true|false
    }
    - Si existe una dieta del paciente, usa esa información para decidir si es recomendado.
    - No incluyas texto antes ni después del JSON.
    - No menciones que generas o incluyes JSON.
    - El mensaje visible para el usuario debe sonar natural, sin rastros del formato.

    Datos: ${expedientepacietne ? JSON.stringify(expedientepacietne) : "sin datos"}.
    `.trim();

    const userMessage = tieneImagen
      ? [
          { type: "text", text: mensaje_usuario || "¿Qué opinas de esta comida?" },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      : mensaje_usuario;

    // 4️⃣ Llamada a OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    let respuestaIA = data.choices?.[0]?.message?.content || "No pude procesar tu mensaje.";

    // 5️⃣ Extraer título y datos nutricionales
    let tituloIA = null;
    let datosNutricionales = null;

    const jsonMatch = respuestaIA.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData.sodio || jsonData.potasio || jsonData.calorias) {
          datosNutricionales = jsonData;
        } else if (jsonData.titulo) {
          tituloIA = jsonData.titulo;
        }
        respuestaIA = respuestaIA.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.error("⚠️ No se pudo parsear JSON:", e);
      }
    }

    if (!tituloIA) {
      const titleRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Crea un título corto (máx 6 palabras) para este mensaje:" },
            { role: "user", content: mensaje_usuario },
          ],
        }),
      });
      const titleData = await titleRes.json();
      tituloIA = titleData.choices?.[0]?.message?.content || "Nueva conversación";
    }

    // 6️⃣ Guardar respuesta de la IA y actualizar título
    await db.promise().query(
      "INSERT INTO mensajes_ia (id_conversacion, remitente, contenido, tipo) VALUES (?, 'ia', ?, 'texto')",
      [id_conversacion, respuestaIA]
    );

    await db.promise().query(
      "UPDATE conversaciones_ia SET titulo = ? WHERE id_conversacion = ?",
      [tituloIA, id_conversacion]
    );

    // 7️⃣ Guardar análisis de imagen
    if (tieneImagen) {
      await db.promise().query(
        "INSERT INTO imagenes_chat_ia (id_mensaje, ruta_imagen, resultado_analisis, datos_nutricionales) VALUES (?, ?, ?, ?)",
        [
          id_mensaje,
          imagePath,
          respuestaIA,
          datosNutricionales ? JSON.stringify(datosNutricionales) : null,
        ]
      );
    }

    // 8️⃣ Respuesta al frontend
    res.json({
      success: true,
      id_conversacion,
      titulo: tituloIA,
      id_mensaje,
      mensaje_ia: respuestaIA,
      datos_nutricionales: datosNutricionales,
      url_imagen: imagePath ? `${imagePath}` : null,
    });

  } catch (err) {
    console.error("❌ Error en /mensaje:", err);
    res.status(500).json({ success: false, message: "Error procesando mensaje IA" });
  }
});

// ===================================================
// 📜 Obtener todas las conversaciones y mensajes
// ===================================================
router.get('/conversaciones/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const [convs] = await db.promise().query(
      'SELECT * FROM conversaciones_ia WHERE id_usuario = ? ORDER BY id_conversacion DESC',
      [id_usuario]
    );

    const [msgs] = await db.promise().query(
      'SELECT * FROM mensajes_ia ORDER BY fecha_envio ASC'
    );

    const [imgs] = await db.promise().query(
      'SELECT * FROM imagenes_chat_ia'
    );


    const mensajesConImgs = msgs.map(m => {
      const img = imgs.find(i => i.id_mensaje === m.id_mensaje);
        let parsedDatos = null;
        if (img?.datos_nutricionales) {
          try {
            parsedDatos = typeof img.datos_nutricionales === "string"
              ? JSON.parse(img.datos_nutricionales)
              : img.datos_nutricionales;
          } catch {
            parsedDatos = null;
          }
        }

        return {
          ...m,
          url_imagen: img ? `${img.ruta_imagen}` : null,
          datos_nutricionales: parsedDatos,
        };
    });

    const data = convs.map(c => ({
      ...c,
      mensajes: mensajesConImgs.filter(m => m.id_conversacion === c.id_conversacion),
    }));

    res.json({ success: true, conversaciones: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error obteniendo conversaciones' });
  }
});

export default router;
