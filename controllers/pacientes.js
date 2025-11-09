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

export const getAllInfoByID = async (id_paciente) =>{
    try{
        const [rows] = await db.promise().query(`
            SELECT 
                u.id AS id_usuario,
                MAX(u.nombre) AS nombre_paciente,
                MAX(u.correo) AS correo,
                MAX(u.tipo) AS tipo,
                MAX(p.fecha_nacimiento) AS fecha_nacimiento,
                MAX(p.genero) AS genero,
                MAX(p.tipo_tratamiento) AS tipo_tratamiento,
                MAX(p.peso) AS peso,
                MAX(p.nivel_creatinina) AS nivel_creatinina,
                MAX(p.sintomas) AS sintomas,
                MAX(p.observaciones) AS observaciones,
                MAX(p.telefono_emergencia) AS telefono_emergencia,
                MAX(p.contacto_emergencia) AS contacto_emergencia,

                -- Doctor
                JSON_OBJECT(
                    'id_doctor', MAX(d.id_doctor),
                    'nombre', MAX(du.nombre),
                    'especialidad', MAX(d.especialidad),
                    'numero_colegiado', MAX(d.numero_colegiado),
                    'telefono', MAX(d.telefono)
                ) AS doctor,

                -- Cuidador
                JSON_OBJECT(
                    'id_cuidador', MAX(c.id_cuidador),
                    'nombre', MAX(cu.nombre),
                    'relacion', MAX(c.relacion_con_paciente),
                    'telefono', MAX(c.telefono)
                ) AS cuidador,

                -- Dietas (array)
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_dieta', di.id_dieta,
                        'descripcion', di.descripcion,
                        'fecha_inicio', di.fecha_inicio,
                        'fecha_fin', di.fecha_fin
                    )
                ) AS dietas,

                -- Medicamentos
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_medicamento', m.id_medicamento,
                        'nombre', m.nombre,
                        'dosis', m.dosis,
                        'horario', m.horario,
                        'notas', m.notas
                    )
                ) AS medicamentos,

                -- Diálisis
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_dialisis', dia.id_dialisis,
                        'tipo', dia.tipo,
                        'fecha', dia.fecha,
                        'hora', dia.hora,
                        'observaciones', dia.observaciones
                    )
                ) AS dialisis,

                -- Signos
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_signo', sv.id_signo,
                        'presion_sistolica', sv.presion_sistolica,
                        'presion_diastolica', sv.presion_diastolica,
                        'frecuencia_cardiaca', sv.frecuencia_cardiaca,
                        'peso', sv.peso,
                        'fecha', sv.fecha_registro
                    )
                ) AS signos_vitales,

                -- Recordatorios
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_recordatorio', r.id_recordatorio,
                        'titulo', r.titulo,
                        'descripcion', r.descripcion,
                        'fecha_hora', r.fecha_hora,
                        'tipo', r.tipo,
                        'estado', r.estado
                    )
                ) AS recordatorios

            FROM usuarios u
            INNER JOIN pacientes p ON p.id_paciente = u.id
            LEFT JOIN doctor_paciente dp ON dp.id_paciente = p.id_paciente
            LEFT JOIN doctores d ON d.id_doctor = dp.id_doctor
            LEFT JOIN usuarios du ON du.id = d.id_doctor
            LEFT JOIN cuidador_paciente cp ON cp.id_paciente = p.id_paciente
            LEFT JOIN cuidadores c ON c.id_cuidador = cp.id_cuidador
            LEFT JOIN usuarios cu ON cu.id = c.id_cuidador
            LEFT JOIN dietas di ON di.id_paciente = p.id_paciente
            LEFT JOIN medicamentos m ON m.id_paciente = p.id_paciente
            LEFT JOIN dialisis dia ON dia.id_paciente = p.id_paciente
            LEFT JOIN signos_vitales sv ON sv.id_paciente = p.id_paciente
            LEFT JOIN recordatorios r ON r.id_paciente = p.id_paciente
            WHERE u.id = ?
            GROUP BY u.id;

            `,[id_paciente]);
        return rows.length > 0 ? rows[0] : null;
    }catch(error){
        console.log(error);
        return null;
    }
}