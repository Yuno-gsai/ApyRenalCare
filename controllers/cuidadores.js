import db from '../DataBase/DataBase.js';

export const getCuidadores = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM cuidadores');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los cuidadores' });
    }
}

export const postCuidador = async (req, res) =>{
    try{
        const {id_cuidador, relacion_con_paciente, telefono,} = req.body;
        const [rows] = await db.promise().query('INSERT INTO cuidadores (id_cuidador, relacion_con_paciente, telefono) VALUES (?, ?, ?)', [id_cuidador, relacion_con_paciente, telefono]);
        res.json({id: rows.insertId, id_cuidador, relacion_con_paciente, telefono});
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al insertar el cuidador' });
    }  
}

export const putCuidador = async (req, res) =>{
    try{
        const {id_cuidador, relacion_con_paciente, telefono} = req.body;
        const [rows] = await db.promise().query('UPDATE cuidadores SET relacion_con_paciente = ?, telefono = ? WHERE id_cuidador = ?', [relacion_con_paciente, telefono, id_cuidador]);
        res.json({id: rows.insertId, id_cuidador, relacion_con_paciente, telefono});
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el cuidador' });
    }  
}

export const deleteCuidador = async (req, res) =>{
    try{
        const {id_cuidador} = req.params;
        const [rows] = await db.promise().query('DELETE FROM cuidadores WHERE id_cuidador = ?', [id_cuidador]);
        res.json({success:true});
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el cuidador' });
    }  
}

export const getCuidadorByID = async (req, res) =>{
    try{
        const {id_cuidador} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM cuidadores WHERE id_cuidador = ?', [id_cuidador]);
        res.json(rows);
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el cuidador' });
    }  
}

export const RelacionarPaciente = async (req, res) =>{
    try{
        const {id_cuidador, id_paciente} = req.body;
        const [rows] = await db.promise().query('INSERT INTO cuidador_paciente (id_cuidador, id_paciente) VALUES (?, ?)', [id_cuidador, id_paciente]);
        res.json({id: rows.insertId, id_cuidador, id_paciente});
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al insertar el cuidador de los pacientes' });
    }  
}

export const EliminarRelacion = async (req, res) =>{
    try{
        const {id_cuidador, id_paciente} = req.params;
        const [rows] = await db.promise().query('DELETE FROM cuidador_paciente WHERE id_cuidador = ? AND id_paciente = ?', [id_cuidador, id_paciente]);
        res.json({success:true});
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el cuidador de los pacientes' });
    }  
}


export const CrearPaciente  = async (req,res) =>{
    try{
        const {nombre, correo, contrasena, tipo,
                fecha_nacimiento, genero, tipo_tratamiento, peso,
                nivel_creatinina, sintomas, observaciones, 
                telefono_emergencia, contacto_emergencia,id_cuidador } = req.body;
        const [rows] = await db.promise().query('INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, ?)', [nombre, correo, contrasena, tipo]);
        const [rows2] = await db.promise().query('INSERT INTO pacientes (id_paciente, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [rows.insertId, fecha_nacimiento, genero, tipo_tratamiento, peso, nivel_creatinina, sintomas, observaciones, telefono_emergencia, contacto_emergencia]);
        const [rows3] = await db.promise().query('INSERT INTO cuidador_paciente (id_cuidador, id_paciente) VALUES (?, ?)', [id_cuidador, rows.insertId])
        res.json({id: rows.insertId, nombre,correo, contrasena, tipo,
                fecha_nacimiento, genero, tipo_tratamiento, peso,
                nivel_creatinina, sintomas, observaciones, 
                telefono_emergencia, contacto_emergencia,id_cuidador});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el paciente'});
    }
}