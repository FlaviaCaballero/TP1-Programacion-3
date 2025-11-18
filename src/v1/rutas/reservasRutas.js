
import express from 'express'; 
import passport from 'passport';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gestionar reservas
 */

 /**
 * @swagger
 * /api/reservas/informe:
 *   get:
 *     summary: Obtener informe de reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: Genera un informe detallado de las reservas (solo admins).
 *     responses:
 *       200:
 *         description: Informe generado correctamente
 */

 /**
 * @swagger
 * /api/reservas/informe2:
 *   get:
 *     summary: Obtener informe número 2
 *     tags: [Reservas]
 *     description: Genera un segundo tipo de informe (sin autenticación).
 *     responses:
 *       200:
 *         description: Informe generado correctamente
 */

 /**
 * @swagger
 * /api/reservas/{reserva_id}:
 *   get:
 *     summary: Buscar una reserva por ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva no encontrada
 */

 /**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar todas las reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida correctamente
 */

 /**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - usuario_id
 *               - turno_id
 *               - servicios
 *               - importe_total
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 example: "2025-02-10"
 *               salon_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id:
 *                       type: integer
 *                     importe:
 *                       type: number
 *                 example:
 *                   - servicio_id: 1
 *                     importe: 2000
 *               foto_cumpleaniero:
 *                 type: string
 *               tematica:
 *                 type: string
 *               importe_salon:
 *                 type: number
 *               importe_total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Error en validación de datos
 */

 /**
 * @swagger
 * /api/reservas/{reserva_id}:
 *   patch:
 *     summary: Modificar parcialmente una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Reserva actualizada parcialmente
 *       404:
 *         description: Reserva no encontrada
 */

 /**
 * @swagger
 * /api/reservas/{reserva_id}:
 *   put:
 *     summary: Modificar totalmente una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - usuario_id
 *               - turno_id
 *               - importe_total
 *     responses:
 *       200:
 *         description: Reserva modificada correctamente
 *       404:
 *         description: Reserva no encontrada
 */

 /**
 * @swagger
 * /api/reservas/{reserva_id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 */

const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/informe', autorizarUsuarios([1]), reservasControlador.informe);  

router.get('/informe2', reservasControlador.informeReservas2);


router.get('/:reserva_id',  
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1,2,3]), 
    reservasControlador.buscarReservaPorId
);

router.get('/',  
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1,2,3]),
    reservasControlador.listarReservas
);

router.post('/', 
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1,3]),
    [
        check('fecha_reserva','Debe ingresar la fecha de reserva.').notEmpty(),
        check('salon_id','Debe ingresar el id de salón.').notEmpty(),
        check('usuario_id','Debe ingresar el id de usuario.').notEmpty(),
        check('turno_id','Debe ingresar el id del turno.').notEmpty(),
        check('servicios','Debe ingresar los servicios requeridos.')
            .notEmpty()
            .isArray({min:1})
            .withMessage('Debe incluir un array con al menos un servicio'),
        check('servicios.*.importe','Debe ser un importe numérico.')
            .isFloat(),
        check('foto_cumpleaniero').optional(),
        check('tematica').optional(),
        check('importe_salon').optional(),
        check('importe_total').notEmpty(),
        validarCampos
    ],
    reservasControlador.crearReserva
);

router.patch('/:reserva_id',
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1]),
    [
        check('fecha_reserva').optional(),
        check('salon_id').optional(),
        check('usuario_id').optional(),
        check('turno_id').optional(),
        check('foto_cumpleaniero').optional(),
        check('tematica').optional(),
        check('importe_salon').optional(),
        check('importe_total').optional(),
        validarCampos
    ],
    reservasControlador.modificarReservaParcialmente
);

router.put('/:reserva_id',
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1]),
    [
        check('fecha_reserva').notEmpty().withMessage('Debe ingresar la fecha de reserva'),
        check('salon_id').notEmpty().withMessage('Debe ingresar el id de salón'),
        check('usuario_id').notEmpty().withMessage('Debe ingresar el id de usuario'),
        check('turno_id').notEmpty().withMessage('Debe ingresar el id del turno'),
        check('foto_cumpleaniero').optional(),
        check('tematica').optional(),
        check('importe_salon').optional(),
        check('importe_total').notEmpty(),
        validarCampos
    ],
    reservasControlador.modificarReserva
);

router.delete('/:reserva_id', 
    passport.authenticate('jwt', { session: false }), 
    autorizarUsuarios([1]), 
    reservasControlador.eliminarReserva
);

export {router};
