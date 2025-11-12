import express from 'express';
import db from '../DataBase/DataBase.js';

const ConversacionesRouter = express.Router();

// ========== GET todas las conversaciones de un usuario ==========
ConversacionesRouter.get('/usuario/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const query = `
            SELECT 
                c.id_conversacion,
                c.tipo AS tipo_conversacion,
                c.nombre_grupo,
                c.fecha_creacion,
                GROUP_CONCAT(DISTINCT u.nombre SEPARATOR ', ') AS participantes,
                MAX(m.fecha_envio) AS ultima_fecha,
                (SELECT contenido FROM mensajes 
                 WHERE id_conversacion = c.id_conversacion 
                 ORDER BY fecha_envio DESC LIMIT 1) AS ultimo_mensaje
            FROM participantes_conversacion pc
            INNER JOIN conversaciones c 
                ON c.id_conversacion = pc.id_conversacion
            INNER JOIN participantes_conversacion pc2 
                ON pc2.id_conversacion = c.id_conversacion
            INNER JOIN usuarios u 
                ON u.id = pc2.id_usuario
            LEFT JOIN mensajes m 
                ON m.id_conversacion = c.id_conversacion
            WHERE pc.id_usuario = ?
            GROUP BY c.id_conversacion
            ORDER BY ultima_fecha DESC;
        `;

        const [conversaciones] = await db.promise().query(query, [id_usuario]);

        res.json({
            success: true,
            conversaciones: conversaciones || []
        });

    } catch (error) {
        console.error('Error en GET /usuario/:id_usuario', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener conversaciones',
            error: error.message
        });
    }
});

// ========== GET mensajes de una conversación ==========
ConversacionesRouter.get('/:id_conversacion/mensajes', async (req, res) => {
    try {
        const { id_conversacion } = req.params;

        const query = `
            SELECT 
                m.id_mensaje,
                m.id_conversacion,
                m.id_emisor,
                m.contenido,
                m.tipo,
                m.fecha_envio,
                u.nombre as nombre_emisor
            FROM mensajes m
            LEFT JOIN usuarios u ON m.id_emisor = u.id
            WHERE m.id_conversacion = ?
            ORDER BY m.fecha_envio ASC
        `;

        const [mensajes] = await db.promise().query(query, [id_conversacion]);

        res.json({
            success: true,
            mensajes: mensajes || []
        });

    } catch (error) {
        console.error('Error en GET /:id_conversacion/mensajes', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener mensajes',
            error: error.message
        });
    }
});

// ========== GET una conversación específica ==========
ConversacionesRouter.get('/:id_conversacion', async (req, res) => {
    try {
        const { id_conversacion } = req.params;

        const [conversacion] = await db.promise().query(
            'SELECT * FROM conversaciones WHERE id_conversacion = ?',
            [id_conversacion]
        );

        if (conversacion.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Conversación no encontrada'
            });
        }

        res.json({
            success: true,
            conversacion: conversacion[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener conversación',
            error: error.message
        });
    }
});

// ========== POST crear conversación ==========
ConversacionesRouter.post('/', async (req, res) => {
    try {
        const { tipo, nombre_grupo, participantes } = req.body;

        // Crear conversación
        const [result] = await db.promise().query(
            'INSERT INTO conversaciones (tipo, nombre_grupo) VALUES (?, ?)',
            [tipo, nombre_grupo || null]
        );

        const id_conversacion = result.insertId;

        // Agregar participantes
        if (participantes && participantes.length > 0) {
            for (const id_usuario of participantes) {
                await db.promise().query(
                    'INSERT INTO participantes_conversacion (id_conversacion, id_usuario) VALUES (?, ?)',
                    [id_conversacion, id_usuario]
                );
            }
        }

        res.json({
            success: true,
            id_conversacion,
            message: 'Conversación creada exitosamente'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear conversación',
            error: error.message
        });
    }
});

// ========== PUT actualizar conversación ==========
ConversacionesRouter.put('/:id_conversacion', async (req, res) => {
    try {
        const { id_conversacion } = req.params;
        const { tipo, nombre_grupo } = req.body;

        await db.promise().query(
            'UPDATE conversaciones SET tipo = ?, nombre_grupo = ? WHERE id_conversacion = ?',
            [tipo, nombre_grupo, id_conversacion]
        );

        res.json({
            success: true,
            message: 'Conversación actualizada'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar conversación',
            error: error.message
        });
    }
});

// ========== DELETE conversación ==========
ConversacionesRouter.delete('/:id_conversacion', async (req, res) => {
    try {
        const { id_conversacion } = req.params;

        // Eliminar participantes
        await db.promise().query(
            'DELETE FROM participantes_conversacion WHERE id_conversacion = ?',
            [id_conversacion]
        );

        // Eliminar mensajes
        await db.promise().query(
            'DELETE FROM mensajes WHERE id_conversacion = ?',
            [id_conversacion]
        );

        // Eliminar conversación
        await db.promise().query(
            'DELETE FROM conversaciones WHERE id_conversacion = ?',
            [id_conversacion]
        );

        res.json({
            success: true,
            message: 'Conversación eliminada'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar conversación',
            error: error.message
        });
    }
});

export default ConversacionesRouter;
