import db from '../DataBase/DataBase.js';

export const getDietaByPacienteID = async (req, res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM dietas WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener la dieta del paciente'});
    }
}

export const postDieta = async (req, res) =>{
    try{
        const {id_paciente, descripcion, fecha_inicio, fecha_fin} = req.body;
        const [rows] = await db.promise().query('INSERT INTO dietas (id_paciente, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)', [id_paciente, descripcion, fecha_inicio, fecha_fin]);
        res.json({id: rows.insertId, id_paciente, descripcion, fecha_inicio, fecha_fin});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar la dieta del paciente'});
    }
}

export const putdieta =async (req, res) =>{
    try{
        const {id_dieta,id_paciente, descripcion, fecha_inicio, fecha_fin} = req.body;
        const [rows] = await db.promise().query('UPDATE dietas SET id_paciente = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_dieta = ?', [id_paciente, descripcion, fecha_inicio, fecha_fin, id_dieta]);
        res.json({id: rows.insertId, id_dieta,id_paciente, fecha, descripcion, fecha_inicio, fecha_fin});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar la dieta del paciente'});
    }
}

export const deleteDieta = async (req,res) =>{
    try{
        const {id_dieta} = req.params;
        const [rows] = await db.promise().query('DELETE FROM dietas WHERE id_dieta = ?', [id_dieta]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar la dieta del paciente'});
    }
}