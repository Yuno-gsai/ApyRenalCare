import db from '../DataBase/DataBase.js';

export const getParticipantesConversacion = async (id_conversacion) =>{
    try{
        const [rows] = await db.promise().query(`
                SELECT 
                    u.id AS id_usuario,
                    u.nombre,
                    u.tipo,
                    u.correo,
                    u.fecha_registro,
                    pc.*               
                FROM participantes_conversacion pc
                INNER JOIN usuarios u ON u.id = pc.id_usuario
                WHERE pc.id_conversacion = ?;
            `,[id_conversacion]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const postParticipante = async (data)=>{
    try{
        const [rows] = await db.promise().query(`
            INSERT INTO participantes_conversacion (id_conversacion, id_usuario)
            VALUES (?, ?);
        `,[data.id_conversacion, data.id_usuario]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const putParticipante = async (data)=>{
    try{
        const [rows] = await db.promise().query(`
            UPDATE participantes_conversacion
            SET 
                id_conversacion = ?,
                id_usuario = ?,
            WHERE id_participante = ? AND id_conversacion = ?;
        `,[data.id_conversacion, data.id_usuario, data.id_participante, data.id_conversacion]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const deleteParticipante = async (data)=>{
    try{
        const [rows] = await db.promise().query(`
            DELETE FROM participantes_conversacion
            WHERE id_participante = ? AND id_conversacion = ?;
        `,[data.id_participante, data.id_conversacion]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const getParticipantesConversacionByUserID = async (id_usuario) =>{
    try{
        const [rows] = await db.promise().query(`
                SELECT 
                    c.id_conversacion,
                    c.tipo AS tipo_conversacion,
                    c.nombre_grupo,
                    c.fecha_creacion,
                    GROUP_CONCAT(u.nombre SEPARATOR ', ') AS participantes
                FROM participantes_conversacion pc
                INNER JOIN conversaciones c 
                    ON c.id_conversacion = pc.id_conversacion
                INNER JOIN participantes_conversacion pc2 
                    ON pc2.id_conversacion = c.id_conversacion
                INNER JOIN usuarios u 
                    ON u.id = pc2.id_usuario
                WHERE pc.id_usuario = ? 
                GROUP BY c.id_conversacion;
            `,[id_usuario]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}