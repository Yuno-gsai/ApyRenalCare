import db from '../DataBase/DataBase.js';
import {getParticipantesConversacion, postParticipante, putParticipante, deleteParticipante,getParticipantesConversacionByUserID} from '../models/participantesConversacion.js';
import {getMensajesByConversacionID, postMensaje, putMensaje, deleteMensaje} from '../models/mensajes.js';

export const getConversasionesByUsuarioID = async (req, res) =>{
    const {id_usuario} = req.params;
    const conversaciones = await getParticipantesConversacionByUserID(id_usuario);
    res.json(conversaciones);
}

export const getParticipantesByConversacionID = async (req, res) =>{
    const {id_conversacion} = req.params;
    const participantes = await getParticipantesConversacion(id_conversacion);
    const mensajes = await getMensajesByConversacionID(id_conversacion);
    res.json({participantes, mensajes});
}  

export const enviarMensaje = async (req, res) =>{
    const {id_conversacion, id_emisor, contenido, tipo} = req.body;
    const mensaje = await postMensaje({id_conversacion, id_emisor, contenido, tipo});
    res.json(mensaje);
}

export const eliminarMensje = async (req, res) =>{
    const {id_mensaje} = req.params;
    const mensaje = await deleteMensaje(id_mensaje);
    res.json(mensaje);
}

export const editarMensaje = async (req, res) =>{
    const {id_mensaje} = req.params;
    const {id_conversacion, id_emisor, contenido, tipo} = req.body;
    const mensaje = await putMensaje({id_conversacion, id_emisor, contenido, tipo, id_mensaje});
    res.json(mensaje);
}
