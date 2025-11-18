
import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';
import apicache from 'apicache';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import passport from "passport";

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints para administración de salones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         salon_id:
 *           type: integer
 *         titulo:
 *           type: string
 *         direccion:
 *           type: string
 *         capacidad:
 *           type: integer
 *         importe:
 *           type: number
 *       example:
 *         salon_id: 1
 *         titulo: "Salón Azul"
 *         direccion: "Av. Siemprevivas 123"
 *         capacidad: 50
 *         importe: 15000
 */

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     summary: Obtiene todos los salones activos
 *     tags: [Salones]
 *     responses:
 *       200:
 *         description: Lista de salones
 */

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón encontrado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     summary: Crear un salón
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido o ausente
 */

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   patch:
 *     summary: Modificar un salón parcialmente
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Salón modificado parcialmente
 */

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   put:
 *     summary: Modificar un salón completamente
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       200:
 *         description: Salón actualizado
 */

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   delete:
 *     summary: Eliminar un salón (borrado lógico)
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Salón eliminado
 */

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware;


router.get('/', cache('5 minutes'), salonesControlador.buscarSalones);

router.get('/:salon_id', salonesControlador.buscarSalonPorId);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('titulo').notEmpty().withMessage('Debe ingresar un título para el salón.'),
        check('direccion').notEmpty().withMessage('Debe ingresar una dirección.'),
        check('capacidad').isInt({min:5}).withMessage('La capacidad debe ser numérica.'),
        check('importe').isFloat({min:100}).withMessage('El importe debe ser numérico'),
        validarCampos  
    ],
    salonesControlador.crearSalon
);

router.patch('/:salon_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('capacidad', 'La capacidad debe ser numérica.').optional().isInt(),
        check('importe', 'El importe debe ser numérico').optional().isNumeric(),
        validarCampos  
    ],
    salonesControlador.modificarSalonParcialmente
);

router.put('/:salon_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('titulo').notEmpty().withMessage('Debe ingresar un título para el salón.'),
        check('direccion').notEmpty().withMessage('Debe ingresar una dirección.'),
        check('capacidad').isInt({min:5}).withMessage('Debe ingresar una capacidad numérica mayor a 5.'),
        check('importe').isFloat({min:100}).withMessage('Debe ingresar un importe numérico'),
        validarCampos  
    ],
    salonesControlador.modificarSalon
);

router.delete('/:salon_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    salonesControlador.eliminarSalon
);

export {router};



