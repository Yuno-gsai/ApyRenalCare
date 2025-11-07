-- Creación de la base de datos
CREATE DATABASE renalcare;
USE renalcare;

-- Tabla de usuarios generales (login)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena varchar(200) NOT NULL,
    tipo ENUM('doctor', 'paciente', 'cuidador') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de doctores
CREATE TABLE doctores (
    id_doctor INT PRIMARY KEY,
    especialidad VARCHAR(100),
    numero_colegiado VARCHAR(50),
    telefono VARCHAR(20),
    FOREIGN KEY (id_doctor) REFERENCES usuarios(id) 
);

-- Tabla de pacientes
CREATE TABLE pacientes (
    id_paciente INT PRIMARY KEY,
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino'),
    tipo_tratamiento ENUM('diálisis', 'hemodiálisis', 'trasplante', 'otro'),
    peso DECIMAL(5,2),
    nivel_creatinina DECIMAL(5,2),
    sintomas TEXT,
    observaciones TEXT,
    telefono_emergencia VARCHAR(20),
    contacto_emergencia VARCHAR(100),
    FOREIGN KEY (id_paciente) REFERENCES usuarios(id) 
);

-- Tabla de cuidadores
CREATE TABLE cuidadores (
    id_cuidador INT PRIMARY KEY,
    relacion_con_paciente VARCHAR(100),
    telefono VARCHAR(20),
    FOREIGN KEY (id_cuidador) REFERENCES usuarios(id) 
);

-- Relaciones muchos a muchos
CREATE TABLE doctor_paciente (
    id_doctor INT,
    id_paciente INT,
    PRIMARY KEY (id_doctor, id_paciente),
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);

CREATE TABLE cuidador_paciente (
    id_cuidador INT,
    id_paciente INT,
    PRIMARY KEY (id_cuidador, id_paciente),
    FOREIGN KEY (id_cuidador) REFERENCES cuidadores(id_cuidador), 
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);

-- Tabla de dietas
CREATE TABLE dietas (
    id_dieta INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);

-- Tabla de medicamentos
CREATE TABLE medicamentos (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    nombre VARCHAR(100),
    dosis VARCHAR(50),
    horario TIME,
    notas TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);

-- Tabla de horarios de diálisis
CREATE TABLE dialisis (
    id_dialisis INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    tipo ENUM('peritoneal', 'hemodiálisis'),
    fecha DATE,
    hora TIME,
    observaciones TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);


-- Tabla de datos adicionales importantes
CREATE TABLE signos_vitales (
    id_signo INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    presion_sistolica INT,
    presion_diastolica INT,
    frecuencia_cardiaca INT,
    peso DECIMAL(5,2),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);

-- Tabla de recordatorios generales
CREATE TABLE recordatorios (
    id_recordatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    titulo VARCHAR(100),
    descripcion TEXT,
    fecha_hora DATETIME,
    tipo ENUM('medicina', 'diálisis', 'cita', 'otro'),
    estado ENUM('pendiente', 'completado', 'omitido', 'reprogramado','inactivo') DEFAULT 'pendiente',
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) 
);


-- Tabla de conversaciones (como los chats en ChatGPT)
CREATE TABLE conversaciones_ia (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) 
);

-- Tabla de mensajes (cada entrada del chat)
CREATE TABLE mensajes_ia (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    remitente ENUM('usuario', 'ia') NOT NULL,
    contenido TEXT,
    tipo ENUM('texto', 'imagen', 'audio', 'otro') DEFAULT 'texto',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones_ia(id_conversacion) 
);

-- Tabla de imágenes asociadas a los mensajes (fotos de comidas)
CREATE TABLE imagenes_chat_ia (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    resultado_analisis TEXT, -- respuesta de la IA o datos nutricionales
    datos_nutricionales JSON, -- JSON con sodio, potasio, fósforo, calorías, etc.
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mensaje) REFERENCES mensajes_ia(id_mensaje) 
);


-- 2️⃣ Conversaciones (uno a uno o grupales)
CREATE TABLE conversaciones (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('individual', 'grupo') DEFAULT 'individual',
    nombre_grupo VARCHAR(150) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Participantes de la conversación
CREATE TABLE participantes_conversacion (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion) ,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) 
);

-- 4️⃣ Mensajes del chat
CREATE TABLE mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    id_emisor INT NOT NULL,
    contenido TEXT,
    tipo ENUM('texto', 'imagen', 'audio', 'archivo', 'otro') DEFAULT 'texto',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion) ,
    FOREIGN KEY (id_emisor) REFERENCES usuarios(id) 
);

-- 5️⃣ Archivos adjuntos del mensaje (fotos, audios, etc.)
CREATE TABLE archivos_mensaje (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tipo_archivo ENUM('imagen', 'audio', 'video', 'documento') DEFAULT 'imagen',
    FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje) 
);

-- 6️⃣ (Opcional) Registro de lectura de mensajes
CREATE TABLE visto_mensaje (
    id_visto INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_visto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje) ,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) 
);















-- CREATE TABLE Usuario (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nombre TEXT NOT NULL,
--     edad INTEGER,
--     url_avatar TEXT,
    

--     etapa_erc TEXT, -- ERC = Enfermedad Renal Crónica
--     tipo_tratamiento TEXT,
    

--     limite_sodio_mg INTEGER,
--     limite_potasio_mg INTEGER,
--     limite_fosforo_mg INTEGER,
--     peso_seco_kg REAL,
    

--     contacto_emergencia_nombre TEXT,
--     contacto_emergencia_parentesco TEXT,
--     contacto_emergencia_telefono TEXT
-- );

-- [Esta tabla hace que nos ahorremos una, que seria la de la persona de emergencia de una la ponemos como datos que trae ya el paciente]


-- CREATE TABLE Medicamento (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     id_usuario INTEGER NOT NULL,
--     nombre TEXT NOT NULL,
--     dosis TEXT,
--     hora_programada TEXT,
--     recordatorio_activo INTEGER DEFAULT 0, -- 0 = falso, 1 = verdadero
--     tomado_hoy INTEGER DEFAULT 0, -- 0 = falso, 1 = verdadero
--     FOREIGN KEY(id_usuario) REFERENCES Usuario(id)
-- );



-- CREATE TABLE Usuario (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nombre TEXT NOT NULL,
--     edad INTEGER,
--     url_avatar TEXT,
    

--     etapa_erc TEXT, -- ERC = Enfermedad Renal Crónica
--     tipo_tratamiento TEXT,
    

--     limite_sodio_mg INTEGER,
--     limite_potasio_mg INTEGER,
--     limite_fosforo_mg INTEGER,
--     peso_seco_kg REAL,
    

--     contacto_emergencia_nombre TEXT,
--     contacto_emergencia_parentesco TEXT,
--     contacto_emergencia_telefono TEXT
-- );

-- [Esta tabla hace que nos ahorremos una, que seria la de la persona de emergencia de una la ponemos como datos que trae ya el paciente]


-- CREATE TABLE Medicamento (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     id_usuario INTEGER NOT NULL,
--     nombre TEXT NOT NULL,
--     dosis TEXT,
--     hora_programada TEXT,
--     recordatorio_activo INTEGER DEFAULT 0, -- 0 = falso, 1 = verdadero
--     tomado_hoy INTEGER DEFAULT 0, -- 0 = falso, 1 = verdadero
--     FOREIGN KEY(id_usuario) REFERENCES Usuario(id)
-- );

-- --

-- CREATE TABLE ConsumoDiario (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     id_usuario INTEGER NOT NULL,
--     fecha TEXT NOT NULL, -- "AAAA-MM-DD"
--     sodio_consumido_mg INTEGER DEFAULT 0,
--     potasio_consumido_mg INTEGER DEFAULT 0,
--     fosforo_consumido_mg INTEGER DEFAULT 0,
--     peso_actual_kg REAL,
--     UNIQUE(id_usuario, fecha), -- Solo una fila por usuario por día
--     FOREIGN KEY(id_usuario) REFERENCES Usuario(id)
-- );
-- [para ir guardando lo que ya comio en el dia, esto podria hacerse o llenarse con las fotos escaneadas.]


-- CREATE TABLE ResultadoLaboratorio (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     id_usuario INTEGER NOT NULL,
--     fecha TEXT NOT NULL, 
--     potasio REAL,
--     fosforo REAL,
--     creatinina REAL,
--     FOREIGN KEY(id_usuario) REFERENCES Usuario(id)
-- );

-- [puede ser opcional, pero podria ser la tabla para los labs esten actualizados]

-- CREATE TABLE Alimento (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nombre TEXT NOT NULL,
--     url_imagen TEXT,
--     potasio_mg INTEGER,
--     sodio_mg INTEGER,
--     fosforo_mg INTEGER,
--     etiqueta_recomendacion TEXT -- );


-- [asi te decia que podria ser la de alimento y la etiqueta que salga "Apto para dieta renal", "Consumir con moderación"]