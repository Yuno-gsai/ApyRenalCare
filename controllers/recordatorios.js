import db from '../DataBase/DataBase.js';


export const getRecordatoriosByID = async (req, res) => {
    try {
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM recordatorios WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los recordatorios' });
    }
}


export const postRecordatorio = async (req, res) => {
    try {
        const {id_paciente, titulo, descripcion, fecha_hora, tipo, estado} = req.body;
        const [rows] = await db.promise().query('INSERT INTO recordatorios (id_paciente, titulo, descripcion, fecha_hora, tipo, estado) VALUES (?, ?, ?, ?, ?, ?)', [id_paciente, titulo, descripcion, fecha_hora, tipo, estado]);
        res.json({id: rows.insertId, id_paciente, titulo, descripcion, fecha_hora, tipo, estado});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al insertar el recordatorio' });
    }
}

export const putRecordatorio = async (req,res) =>{
    try{
        const {id_recordatorio, id_paciente, titulo, descripcion, fecha_hora, tipo, estado} = req.body;
        const [rows] = await db.promise().query('UPDATE recordatorios SET id_paciente = ?, titulo = ?, descripcion = ?, fecha_hora = ?, tipo = ?, estado = ? WHERE id_recordatorio = ?', [id_paciente, titulo, descripcion, fecha_hora, tipo, estado, id_recordatorio]);
        res.json({id: rows.insertId, id_recordatorio, id_paciente, titulo, descripcion, fecha_hora, tipo, estado});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el recordatorio' });
    }
}

export const deleteRecordatorio = async (req,res) =>{
    try{
        const {id_recordatorio} = req.params;
        const [rows] = await db.promise().query('DELETE FROM recordatorios WHERE id_recordatorio = ?', [id_recordatorio]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el recordatorio' });
    }
}