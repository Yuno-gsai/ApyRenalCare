import db from '../DataBase/DataBase.js';

export const getDoctores = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM doctores');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los doctores' });
    }
}

export const postDoctor = async (req, res) => {
    try{
        const {id_doctor, especialidad, numero_colegiado, telefono} = req.body;
        const [rows] = await db.promise().query('INSERT INTO doctores (id_doctor, especialidad, numero_colegiado, telefono) VALUES (?, ?, ?, ?)', [id_doctor, especialidad, numero_colegiado, telefono]);
        res.json({id: rows.insertId, id_doctor, especialidad, numero_colegiado, telefono});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el doctor'});
    }
}

export const putDoctor = async (req, res) => {
    try{
        const {id_doctor, especialidad, numero_colegiado, telefono} = req.body;
        const [rows] = await db.promise().query('UPDATE doctores SET especialidad = ?, numero_colegiado = ?, telefono = ? WHERE id_doctor = ?', [especialidad, numero_colegiado, telefono, id_doctor]);
        res.json({id: rows.insertId, id_doctor, especialidad, numero_colegiado, telefono});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el doctor'});
    }
}

export const deleteDoctor = async (req, res) => {
    try{
        const {id_doctor} = req.params;
        const [rows] = await db.promise().query('DELETE FROM doctores WHERE id_doctor = ?', [id_doctor]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el doctor'});
    }
}

export const getDoctorByID = async (req, res) => {
    try{
        const {id_doctor} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM doctores WHERE id_doctor = ?', [id_doctor]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el doctor'});
    }
}

export const RelacionarPaciente = async (req, res) =>{
    try{
        const {id_doctor, id_paciente} = req.body;
        const [rows] = await db.promise().query('INSERT INTO doctor_paciente (id_doctor, id_paciente) VALUES (?, ?)', [id_doctor, id_paciente]);
        res.json({id: rows.insertId, id_doctor, id_paciente});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el doctor de los pacientes'});
    }
}

export const EliminarRelacion = async (req, res) =>{
    try{
        const {id_doctor, id_paciente} = req.params;
        const [rows] = await db.promise().query('DELETE FROM doctor_paciente WHERE id_doctor = ? AND id_paciente = ?', [id_doctor, id_paciente]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el doctor de los pacientes'});
    }
}

export const CrearPaciente  = async (req,res) =>{
    try{
        const {nombre, correo, contrasena, tipo,
                fecha_nacimiento, genero, tipo_tratamiento, peso,
                nivel_creatinina, sintomas, observaciones, 
                telefono_emergencia, contacto_emergencia,id_doctor } = req.body;
        const [rows] = await db.promise().query('INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, ?)', [nombre, correo, contrasena, tipo]);
        const [rows2] = await db.promise().query('INSERT INTO pacientes (id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [rows.insertId, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia]);
        const [rows3] = await db.promise().query('INSERT INTO doctor_paciente (id_doctor, id_paciente) VALUES (?, ?)', [id_doctor, rows.insertId])
        res.json({id: rows.insertId, nombre,correo, contrasena, tipo,
                fecha_nacimiento, genero, tipo_tratamiento, peso,
                nivel_creatinina, sintomas, observaciones, 
                telefono_emergencia, contacto_emergencia,id_doctor});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el paciente'});
    }
}

export const getPacientesByDocotorID = async (req,res) =>{
    try{
        const {id_doctor} = req.params;
        const [rows] = await db.promise().query(
            `SELECT 
                u.id AS id_usuario,
                u.nombre AS nombre_paciente,
                u.correo,
                p.fecha_nacimiento,
                p.genero,
                p.tipo_tratamiento,
                p.peso,
                p.nivel_creatinina,
                p.sintomas,
                p.observaciones,
                p.telefono_emergencia,
                p.contacto_emergencia
            FROM doctor_paciente dp
            INNER JOIN pacientes p ON dp.id_paciente = p.id_paciente
            INNER JOIN usuarios u ON p.id_paciente = u.id
            WHERE dp.id_doctor = ?`, [id_doctor]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener los pacientes del doctor'});
    }
}