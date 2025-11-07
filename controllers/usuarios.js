import db from '../DataBase/DataBase.js';

export const getUsuarios = async (req, res) =>{
    try{
        const [rows] = await db.promise().query('SELECT * FROM usuarios');
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener los usuarios'});
    }
}

export const postUsuario = async (req, res) =>{
    try{
        const {nombre, correo, contrasena, tipo} = req.body;
        const [rows] = await db.promise().query('INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, ?)', [nombre, correo, contrasena, tipo]);
        res.json({id: rows.insertId, nombre, correo, contrasena, tipo});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar el usuario'});
    }
}

export const putUsuario = async (req, res) =>{
    try{
        const {id, nombre, correo, contrasena, tipo} = req.body;
        const [rows] = await db.promise().query('UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, tipo = ? WHERE id = ?', [nombre, correo, contrasena, tipo, id]);
        res.json({id, nombre, correo, contrasena, tipo});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el usuario'});
    }
}

export const deleteUsuario = async (req, res) =>{
    try{
        const {id} = req.params;
        const [rows] = await db.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar el usuario'});
    }
}

export const getUsuarioByID = async(req, res) =>{
    try{
        const {id} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el usuario'});
    }
}