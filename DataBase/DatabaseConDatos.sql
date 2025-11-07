-- =======================================
-- CREACIÓN Y CARGA DE DATOS DE PRUEBA
-- =======================================
DROP DATABASE IF EXISTS renalcare;
CREATE DATABASE renalcare;
USE renalcare;

-- =======================================
-- 1️⃣ Tabla de usuarios
-- =======================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena varchar(200) NOT NULL,
    tipo ENUM('doctor', 'paciente', 'cuidador') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES
('Dr. Juan Pérez', 'juan.perez@renalcare.com', '1234', 'doctor'),
('María López', 'maria.lopez@gmail.com', '1234', 'paciente'),
('Carlos Ramírez', 'carlos.ramirez@gmail.com', '1234', 'paciente'),
('Ana Torres', 'ana.torres@gmail.com', '1234', 'cuidador');

-- =======================================
-- 2️⃣ Tabla de doctores
-- =======================================
CREATE TABLE doctores (
    id_doctor INT PRIMARY KEY,
    especialidad VARCHAR(100),
    numero_colegiado VARCHAR(50),
    telefono VARCHAR(20),
    FOREIGN KEY (id_doctor) REFERENCES usuarios(id)
);

INSERT INTO doctores VALUES
(1, 'Nefrología', 'CN-00123', '7777-1111');

-- =======================================
-- 3️⃣ Tabla de pacientes
-- =======================================
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

INSERT INTO pacientes VALUES
(2, '1988-03-15', 'femenino', 'hemodiálisis', 65.5, 4.8, 'Fatiga y mareo', 'Control estable', '7777-2222', 'José López'),
(3, '1975-06-10', 'masculino', 'trasplante', 72.0, 1.2, 'Sin síntomas', 'Post trasplante, en observación', '7777-3333', 'María Ramírez');

-- =======================================
-- 4️⃣ Tabla de cuidadores
-- =======================================
CREATE TABLE cuidadores (
    id_cuidador INT PRIMARY KEY,
    relacion_con_paciente VARCHAR(100),
    telefono VARCHAR(20),
    FOREIGN KEY (id_cuidador) REFERENCES usuarios(id)
);

INSERT INTO cuidadores VALUES
(4, 'Hermana de María López', '7777-4444');

-- =======================================
-- 5️⃣ Relaciones muchos a muchos
-- =======================================
CREATE TABLE doctor_paciente (
    id_doctor INT,
    id_paciente INT,
    PRIMARY KEY (id_doctor, id_paciente),
    FOREIGN KEY (id_doctor) REFERENCES doctores(id_doctor),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

INSERT INTO doctor_paciente VALUES
(1, 2),
(1, 3);

CREATE TABLE cuidador_paciente (
    id_cuidador INT,
    id_paciente INT,
    PRIMARY KEY (id_cuidador, id_paciente),
    FOREIGN KEY (id_cuidador) REFERENCES cuidadores(id_cuidador),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

INSERT INTO cuidador_paciente VALUES
(4, 2);

-- =======================================
-- 6️⃣ Dietas
-- =======================================
CREATE TABLE dietas (
    id_dieta INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

INSERT INTO dietas (id_paciente, descripcion, fecha_inicio, fecha_fin) VALUES
(2, 'Dieta baja en potasio y sodio', '2025-01-01', '2025-03-01'),
(3, 'Dieta post trasplante con control de proteínas', '2025-02-15', '2025-04-15');

-- =======================================
-- 7️⃣ Medicamentos
-- =======================================
CREATE TABLE medicamentos (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    nombre VARCHAR(100),
    dosis VARCHAR(50),
    horario TIME,
    notas TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

INSERT INTO medicamentos (id_paciente, nombre, dosis, horario, notas) VALUES
(2, 'Eritropoyetina', '4000 UI', '08:00:00', 'Aplicar subcutánea cada 3 días'),
(3, 'Prednisona', '5 mg', '09:00:00', 'Después del desayuno');

-- =======================================
-- 8️⃣ Dialisis
-- =======================================
CREATE TABLE dialisis (
    id_dialisis INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT,
    tipo ENUM('peritoneal', 'hemodiálisis'),
    fecha DATE,
    hora TIME,
    observaciones TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);

INSERT INTO dialisis (id_paciente, tipo, fecha, hora, observaciones) VALUES
(2, 'hemodiálisis', '2025-11-03', '10:00:00', 'Sesión completada sin incidentes');

-- =======================================
-- 9️⃣ Signos vitales
-- =======================================
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

INSERT INTO signos_vitales (id_paciente, presion_sistolica, presion_diastolica, frecuencia_cardiaca, peso) VALUES
(2, 120, 80, 70, 65.5),
(3, 110, 75, 68, 72.0);

-- =======================================
-- 🔟 Recordatorios
-- =======================================
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

INSERT INTO recordatorios (id_paciente, titulo, descripcion, fecha_hora, tipo, estado) VALUES
(2, 'Tomar Eritropoyetina', 'Inyección subcutánea', '2025-11-05 08:00:00', 'medicina', 'pendiente'),
(2, 'Sesión de diálisis', 'Centro RenalCare', '2025-11-05 10:00:00', 'diálisis', 'completado');

-- =======================================
-- 🧠 Conversaciones IA
-- =======================================
CREATE TABLE conversaciones_ia (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

INSERT INTO conversaciones_ia (id_usuario, titulo) VALUES
(2, 'Asistente Nutricional'),
(3, 'Control Post-Trasplante');

CREATE TABLE mensajes_ia (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    remitente ENUM('usuario', 'ia') NOT NULL,
    contenido TEXT,
    tipo ENUM('texto', 'imagen', 'audio', 'otro') DEFAULT 'texto',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones_ia(id_conversacion)
);

INSERT INTO mensajes_ia (id_conversacion, remitente, contenido) VALUES
(1, 'usuario', '¿Puedo comer plátano con mi dieta renal?'),
(1, 'ia', 'Evita plátanos por su alto contenido en potasio.');

CREATE TABLE imagenes_chat_ia (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    resultado_analisis TEXT,
    datos_nutricionales JSON,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mensaje) REFERENCES mensajes_ia(id_mensaje)
);

INSERT INTO imagenes_chat_ia (id_mensaje, ruta_imagen, resultado_analisis, datos_nutricionales) VALUES
(2, 'uploads/comida1.jpg', 'Plato detectado: arroz con pollo', '{"sodio":350,"potasio":420,"calorias":520}');

-- =======================================
-- 💬 Conversaciones entre usuarios
-- =======================================
CREATE TABLE conversaciones (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('individual', 'grupo') DEFAULT 'individual',
    nombre_grupo VARCHAR(150) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO conversaciones (tipo, nombre_grupo) VALUES
('individual', NULL),
('grupo', 'Cuidado de María');

CREATE TABLE participantes_conversacion (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

INSERT INTO participantes_conversacion (id_conversacion, id_usuario) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 4);

CREATE TABLE mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    id_emisor INT NOT NULL,
    contenido TEXT,
    tipo ENUM('texto', 'imagen', 'audio', 'archivo', 'otro') DEFAULT 'texto',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion),
    FOREIGN KEY (id_emisor) REFERENCES usuarios(id)
);

INSERT INTO mensajes (id_conversacion, id_emisor, contenido) VALUES
(1, 2, 'Doctor, hoy me siento un poco mareada.'),
(1, 1, 'No te preocupes, mide tu presión y avísame.'),
(2, 4, 'Recordemos la diálisis de mañana.'),
(2, 1, 'Confirmado, estaré atento.');

CREATE TABLE archivos_mensaje (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tipo_archivo ENUM('imagen', 'audio', 'video', 'documento') DEFAULT 'imagen',
    FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje)
);

INSERT INTO archivos_mensaje (id_mensaje, ruta_archivo, tipo_archivo) VALUES
(1, 'uploads/presion_maria.jpg', 'imagen');

CREATE TABLE visto_mensaje (
    id_visto INT AUTO_INCREMENT PRIMARY KEY,
    id_mensaje INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_visto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

INSERT INTO visto_mensaje (id_mensaje, id_usuario) VALUES
(1, 1),
(2, 2);
