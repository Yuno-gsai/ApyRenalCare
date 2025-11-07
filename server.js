import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import {Server} from 'socket.io';
import {createServer} from 'http';
import {postMensaje, putMensaje, deleteMensaje} from './models/mensajes.js';

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

app.use('/usuarios', UsuarioRouter);
app.use('/doctores', DoctorRouter);
app.use('/cuidadores', CuidadorRouter);
app.use('/dietas', DietaRouter);
app.use('/medicamentos', MedicamentosRouter);
app.use('/dialisis', DialisisRouter);
app.use('/signosVitales', SignosVitalesRouter);
app.use('/recordatorios', RecordatorioRouter);
app.use('/conversaciones', ConversacionesRouter);


io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("joinRoom", (id_conversacion) => {
        socket.join(id_conversacion);
        console.log(`Usuario ${socket.id} se unió a conversación ${id_conversacion}`);
    });

    socket.on("sendMessage", async (data) => {
        // data: { id_conversacion, id_emisor, contenido, tipo }
        const mensaje = await postMensaje(data);
        io.to(data.id_conversacion).emit("newMessage", mensaje);
    });

    socket.on("editMessage", async (data) => {
        const mensaje = await putMensaje(data);
        io.to(data.id_conversacion).emit("messageEdited", mensaje);
    });

    socket.on("deleteMessage", async (data) => {
        await deleteMensaje(data.id_mensaje);
        io.to(data.id_conversacion).emit("messageDeleted", data.id_mensaje);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
