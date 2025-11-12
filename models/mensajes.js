import db from '../DataBase/DataBase.js';

export const getMensajesByConversacionID = async (id_conversacion) =>{
    try{
        const [rows] = await db.promise().query('SELECT * FROM mensajes WHERE id_conversacion = ? ORDER BY fecha_envio ASC', [id_conversacion]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}

export const postMensaje = async (data) => {
  try {
    const [result] = await db.promise().query(
      'INSERT INTO mensajes (id_conversacion, id_emisor, contenido, tipo) VALUES (?, ?, ?, ?)',
      [data.id_conversacion, data.id_emisor, data.contenido, data.tipo]
    );

    // Traer el mensaje recién insertado con datos del usuario
    const [mensaje] = await db.promise().query(
      `SELECT 
        m.id_mensaje,
        m.id_conversacion,
        m.id_emisor,
        m.contenido,
        m.tipo,
        m.fecha_envio,
        u.nombre as nombre_emisor
      FROM mensajes m
      LEFT JOIN usuarios u ON m.id_emisor = u.id
      WHERE m.id_mensaje = ?`,
      [result.insertId]
    );

    return mensaje[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const putMensaje = async (data) => {
  try {
    // 1) Ejecutar el UPDATE
    const [result] = await db.promise().query(
      `
      UPDATE mensajes
      SET 
        id_conversacion = ?,
        id_emisor = ?,
        contenido = ?,
        tipo = ?
      WHERE id_mensaje = ?
      `,
      [data.id_conversacion, data.id_emisor, data.contenido, data.tipo, data.id_mensaje]
    );

    // Si no se afectó ninguna fila, retornar null (mensaje no encontrado)
    if (!result || result.affectedRows === 0) {
      return null;
    }

    // 2) Traer el mensaje actualizado y retornarlo
    const [rows] = await db.promise().query(
      `SELECT 
        m.id_mensaje,
        m.id_conversacion,
        m.id_emisor,
        m.contenido,
        m.tipo,
        m.fecha_envio,
        u.nombre as nombre_emisor
      FROM mensajes m
      LEFT JOIN usuarios u ON m.id_emisor = u.id
      WHERE m.id_mensaje = ?`,
      [data.id_mensaje]
    );

    return rows[0] ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMensaje = async (id_mensaje) =>{
    try{
        const [rows] = await db.promise().query('DELETE FROM mensajes WHERE id_mensaje = ?', [id_mensaje]);
        return rows;
    }catch(error){
        console.log(error);
        return null;
    }
}