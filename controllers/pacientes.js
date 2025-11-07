import db from '../DataBase/DataBase.js';

export const getPacientes = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM pacientes');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los pacientes' });
    }
}


export const postPaciente = async(req, res) =>{
    try{
        const {id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia} = req.body;
        const [rows] = await db.promise().query('INSERT INTO pacientes (id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia]);
        res.json({id: rows.insertId, id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el paciente'});
    }   
}

export const putPaciente = async(req, res) =>{
    try{
        const {id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia} = req.body;
        const [rows] = await db.promise().query('UPDATE pacientes SET fecha_nacimiento = ?, genero = ?, tipo_tratamiento = ?, peso = ?, nivel_creatinina = ?, sintomas = ?, observaciones = ?, telefono_emergencia = ?, contacto_emergencia = ? WHERE id_paciente = ?', [fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia, id_paciente]);
        res.json({id: rows.insertId, id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el paciente'});
    }   
}

export const deletePaciente = async(req, res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('DELETE FROM pacientes WHERE id_paciente = ?', [id_paciente]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el paciente'});
    }
}

export const getPacienteByID = async (req, res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM pacientes WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el paciente'});
    }
}