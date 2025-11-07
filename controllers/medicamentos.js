import db from '../DataBase/DataBase.js';

export const getMedicamentosByPacienteID = async (req, res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM medicamentos WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener los medicamentos del paciente'});
    }
}

export const postMedicamento = async (req, res) =>{
    try{
        const {id_paciente, nombre, dosis, horario, notas} = req.body;
        const [rows] = await db.promise().query('INSERT INTO medicamentos (id_paciente, nombre, dosis, horario, notas) VALUES (?, ?, ?, ?, ?)', [id_paciente, nombre, dosis, horario, notas]);
        res.json({id: rows.insertId, id_paciente, nombre, dosis, horario, notas});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el medicamento'});
    }
}

export const putMedicamento = async (req, res) =>{
    try{
        const {id_medicamento, id_paciente, nombre, dosis, horario, notas} = req.body;
        const [rows] = await db.promise().query('UPDATE medicamentos SET id_paciente = ?, nombre = ?, dosis = ?, horario = ?, notas = ? WHERE id_medicamento = ?', [id_paciente, nombre, dosis, horario, notas, id_medicamento]);
        res.json({id: rows.insertId, id_medicamento, id_paciente, nombre, dosis, horario, notas});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el medicamento'});
    }
}

export const deleteMedicamento = async(req, res) =>{
    try{
        const {id_medicamento} = req.params;
        const [rows] = await db.promise().query('DELETE FROM medicamentos WHERE id_medicamento = ?', [id_medicamento]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el medicamento'});
    }
}