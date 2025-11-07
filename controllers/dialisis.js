import db from '../DataBase/DataBase.js';

export const getDialisisByPacienteID = async(req,res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM dialisis WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el dialisis del paciente'});
    }
}   

export const postDialisis = async(req,res) =>{
    try{
        const {id_paciente, tipo, fecha, hora, observaciones} = req.body;
        const [rows] = await db.promise().query('INSERT INTO dialisis (id_paciente, tipo, fecha, hora, observaciones) VALUES (?, ?, ?, ?, ?)', [id_paciente, tipo, fecha, hora, observaciones]);
        res.json({id: rows.insertId, id_paciente, tipo, fecha, hora, observaciones});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el dialisis del paciente'});
    }
}

export const putDialisis = async (req,res) =>{
    try{
        const {id_dialisis, id_paciente, tipo, fecha, hora, observaciones} = req.body;
        const [rows] = await db.promise().query('UPDATE dialisis SET id_paciente = ?, tipo = ?, fecha = ?, hora = ?, observaciones = ? WHERE id_dialisis = ?', [id_paciente, tipo, fecha, hora, observaciones, id_dialisis]);
        res.json({id: rows.insertId, id_dialisis, id_paciente, tipo, fecha, hora, observaciones});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el dialisis del paciente'});
    }
}

export const deleteDialisis = async (req,res) =>{
    try{
        const {id_dialisis} = req.params;
        const [rows] = await db.promise().query('DELETE FROM dialisis WHERE id_dialisis = ?', [id_dialisis]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el dialisis del paciente'});
    }
}