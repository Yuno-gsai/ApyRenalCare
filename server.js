import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import {Server} from 'socket.io';
import {createServer} from 'http';
import {postMensaje, putMensaje, deleteMensaje, getMensajesByConversacionID} from './models/mensajes.js';
import {getParticipantesConversacion} from './models/participantes.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST','PUT','DELETE','PATCH']
    }
});

import UsuarioRouter from './routes/usuarios.js';
import DoctorRouter from './routes/doctores.js';
import CuidadorRouter from './routes/cuidadores.js';
import DietaRouter from './routes/dietas.js';
import MedicamentosRouter from './routes/medicamentos.js';
import DialisisRouter from './routes/dialisis.js';
import SignosVitalesRouter from './routes/signosVitales.js';
import RecordatorioRouter from './routes/recordatorio.js';
import ConversacionesRouter from './routes/conversaciones.js';
import ChatIARouter from './routes/chatIA.js';
import PacienteRouter from './routes/pacientes.js';

app.use('/usuarios', UsuarioRouter);
app.use('/doctores', DoctorRouter);
app.use('/cuidadores', CuidadorRouter);
app.use('/dietas', DietaRouter);
app.use('/medicamentos', MedicamentosRouter);
app.use('/dialisis', DialisisRouter);
app.use('/signosVitales', SignosVitalesRouter);
app.use('/recordatorios', RecordatorioRouter);
app.use('/conversaciones', ConversacionesRouter);
app.use('/chatIA', ChatIARouter);   
app.use('/pacientes', PacienteRouter);

// 🔧 Mejorado: Mapeo de conexiones de usuarios
const usuariosConectados = {}; // { idUsuario: socketId }

io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    // Evento: Usuario se registra en el servidor
    socket.on("registerUser", (data) => {
        const { id_usuario } = data;
        usuariosConectados[id_usuario] = socket.id;
        console.log(`📱 Usuario ${id_usuario} registrado con socket ${socket.id}`);
        console.log("Usuarios conectados:", usuariosConectados);
    });

    // Evento: Unirse a una conversación
    socket.on("joinRoom", (data) => {
        const { id_conversacion, id_usuario } = data;
        socket.join(id_conversacion);
        console.log(`✅ Usuario ${id_usuario} se unió a conversación ${id_conversacion}`);
        
        // Notificar a otros que alguien se unió
        io.to(id_conversacion).emit("userJoined", { 
            id_usuario, 
            timestamp: new Date().toISOString() 
        });
    });

    // Evento: Enviar mensaje
    socket.on("sendMessage", async (data) => {
        try {
            const mensaje = await postMensaje(data);
            if (mensaje) {
                io.to(data.id_conversacion).emit("newMessage", mensaje);
            }
        } catch (error) {
            console.error("Error en sendMessage:", error);
        }
    });

    // Evento: Editar mensaje
    socket.on("editMessage", async (data) => {
        try {
            const mensaje = await putMensaje(data);
            if (mensaje) {
                io.to(data.id_conversacion).emit("messageEdited", mensaje);
            }
        } catch (error) {
            console.error("Error en editMessage:", error);
        }
    });

    // Evento: Eliminar mensaje
    socket.on("deleteMessage", async (data) => {
        try {
            await deleteMensaje(data.id_mensaje);
            io.to(data.id_conversacion).emit("messageDeleted", data.id_mensaje);
        } catch (error) {
            console.error("Error en deleteMessage:", error);
        }
    });

    // Evento: Indicador de escritura
    socket.on("typing", (data) => {
        const { id_conversacion, id_usuario, nombre_usuario } = data;
        socket.to(id_conversacion).emit("userTyping", { 
            id_usuario, 
            nombre_usuario 
        });
    });

    // Evento: Dejar de escribir
    socket.on("stopTyping", (data) => {
        const { id_conversacion, id_usuario } = data;
        socket.to(id_conversacion).emit("userStoppedTyping", { id_usuario });
    });

    // Evento: Marcar mensaje como leído
    socket.on("markAsRead", (data) => {
        const { id_conversacion, id_usuario, id_mensaje } = data;
        io.to(id_conversacion).emit("messageRead", { 
            id_mensaje, 
            id_usuario,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        // Eliminar usuario del registro
        const usuarioId = Object.keys(usuariosConectados).find(
            key => usuariosConectados[key] === socket.id
        );
        if (usuarioId) {
            delete usuariosConectados[usuarioId];
        }
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});