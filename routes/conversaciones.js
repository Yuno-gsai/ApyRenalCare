import { Router } from "express";
import { getConversasionesByUsuarioID,getParticipantesByConversacionID, editarMensaje, eliminarMensje, enviarMensaje } from "../controllers/conversaciones.js";
import {getMensajesByConversacionID} from '../models/mensajes.js'

const conversacionesRouter = Router();

conversacionesRouter.get('/conversaciones/:id_usuario', getConversasionesByUsuarioID);
conversacionesRouter.get('/mensajes/:id_conversacion', getParticipantesByConversacionID);
conversacionesRouter.post('/enviarMensaje', enviarMensaje);
conversacionesRouter.put('/editarMensaje', editarMensaje);
conversacionesRouter.delete('/:id_mensaje', eliminarMensje);


conversacionesRouter.get("/:id_conversacion/mensajes", async (req, res) => {
  const { id_conversacion } = req.params;
  const mensajes = await getMensajesByConversacionID(id_conversacion);
  if (!mensajes) return res.status(500).json({ error: "Error al obtener mensajes" });
  res.json(mensajes);
});
export default conversacionesRouter;
