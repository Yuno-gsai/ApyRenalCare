import db from '../DataBase/DataBase.js';               

export const getSignosVitalesByPacienteID = async(req,res) =>{
    try{
        const {id_paciente} = req.params;
        const [rows] = await db.promise().query('SELECT * FROM signos_vitales WHERE id_paciente = ?', [id_paciente]);
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener los signos vitales del paciente'});
    }
}

export const postSignosVitales = async(req,res) =>{
    try{
        const {id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso} = req.body;
        const [rows] = await db.promise().query('INSERT INTO signos_vitales (id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso) VALUES (?, ?, ?, ?, ?)', [id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso]);
        res.json({id: rows.insertId, id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al insertar los signos vitales del paciente'});
    }
}

export const putSignosVitales = async (req,res) =>{
    try{
        const {id_signo, id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso} = req.body;
        const [rows] = await db.promise().query('UPDATE signos_vitales SET id_paciente = ?, presion_sistolica = ?, presion_diastolica = ?, frecuencia_cardiaca = ?, peso = ? WHERE id_signo = ?', [id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso, id_signo]);
        res.json({id: rows.insertId, id_signo, id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al actualizar los signos vitales del paciente'});
    }
}

export const deleteSignosVitales = async (req,res) =>{
    try{
        const {id_signo} = req.params;
        const [rows] = await db.promise().query('DELETE FROM signos_vitales WHERE id_signo = ?', [id_signo]);
        res.json({success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al eliminar los signos vitales del paciente'});
    }
}
