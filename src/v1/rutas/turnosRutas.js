
import express from 'express';
import passport from 'passport';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Endpoints para administración de turnos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         turno_id:
 *           type: integer
 *         orden:
 *           type: integer
 *         hora_desde:
 *           type: string
 *           example: "09:00:00"
 *         hora_hasta:
 *           type: string
 *           example: "10:00:00"
 *       example:
 *         turno_id: 1
 *         orden: 1
 *         hora_desde: "08:00:00"
 *         hora_hasta: "09:00:00"
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 */

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   patch:
 *     summary: Modificar un turno parcialmente
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno modificado parcialmente
 */

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   put:
 *     summary: Modificar un turno completamente
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *     responses:
 *       200:
 *         description: Turno actualizado
 */

/**
 * @swagger
 * /api/v1/turnos/{turno_id}:
 *   delete:
 *     summary: Eliminar un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 */

/**
 * @swagger
 * /api/v1/turnos/disponibles:
 *   get:
 *     summary: Listar turnos disponibles
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles
 */

const turnosControlador = new TurnosControlador();
const router = express.Router();

router.get('/', 
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1,2,3]),
    turnosControlador.buscarTurnos
);

router.get('/:turno_id', 
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1,2,3]),
    turnosControlador.buscarTurnoPorId
);

router.post('/', 
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('orden').isInt({min:1}).withMessage('Debe ingresar un número entero'),
        check('hora_desde').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Debe ingresar una hora válida HH:MM:SS'),
        check('hora_hasta').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Debe ingresar una hora válida HH:MM:SS'),
        validarCampos
    ],
    turnosControlador.crearTurno
);

router.patch('/:turno_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('orden').optional().isInt({min:1}),
        check('hora_desde').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        check('hora_hasta').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        validarCampos
    ],
    turnosControlador.modificarTurnoParcialmente
);

router.put('/:turno_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('orden').isInt({min:1}),
        check('hora_desde').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        check('hora_hasta').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        validarCampos
    ],
    turnosControlador.modificarTurno
);

router.delete('/:turno_id', 
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    turnosControlador.eliminarTurno
);

router.get('/disponibles',
    passport.authenticate('jwt', { session: false }),
    turnosControlador.listarTurnosDisponibles
);


export { router };
