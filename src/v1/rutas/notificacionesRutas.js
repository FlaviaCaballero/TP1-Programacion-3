
import express from 'express';
import passport from 'passport';
import NotificacionesControlador from '../../controladores/notificacionesControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';



export const router = express.Router();

const notificacionesControlador = new NotificacionesControlador();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Envío de notificaciones al cliente o administrador
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que recibirá la notificación
 *         mensaje:
 *           type: string
 *           description: Contenido del mensaje a enviar
 *       example:
 *         usuario_id: 5
 *         mensaje: "Su reserva ha sido confirmada."
 */

/**
 * @swagger
 * /api/v1/notificaciones:
 *   post:
 *     summary: Enviar una notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notificacion'
 *     responses:
 *       200:
 *         description: Notificación enviada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

router.post('/',
    passport.authenticate('jwt', { session: false }),   
    autorizarUsuarios([1, 2]),
    notificacionesControlador.enviarNotificacion
);

