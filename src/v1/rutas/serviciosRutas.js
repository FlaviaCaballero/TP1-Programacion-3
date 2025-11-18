
import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para administración de servicios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         servicio_id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         importe:
 *           type: number
 *       example:
 *         servicio_id: 1
 *         descripcion: "Decoración Premium"
 *         importe: 5000
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   patch:
 *     summary: Modificar un servicio parcialmente
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio modificado parcialmente
 */

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     summary: Modificar un servicio completamente
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio actualizado
 */

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio eliminado
 */

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

router.get('/', serviciosControlador.buscarServicios);
router.get('/:servicio_id', serviciosControlador.buscarServicioPorId);

router.post('/',
    autorizarUsuarios([1]),
    [
        check('descripcion').notEmpty().withMessage('Debe ingresar una breve descripción del servicio'),
        check('importe').isNumeric().withMessage('Debe ingresar el importe numérico del servicio'),
        validarCampos
    ],
    serviciosControlador.crearServicio
);

router.patch('/:servicio_id',
    autorizarUsuarios([1]),
    [
        check('importe').optional().isNumeric('Debe ingresar el importe numérico del servicio'),
        validarCampos
    ],
    serviciosControlador.modificarServicioParcialmente
);

router.put('/:servicio_id',
    autorizarUsuarios([1]),
    [
        check('descripcion').notEmpty().withMessage('Debe ingresar una breve descripción del servicio'),
        check('importe').isNumeric().withMessage('Debe ingresar el importe numérico del servicio'),
        validarCampos
    ],
    serviciosControlador.modificarServicio
);

router.delete('/:servicio_id',
    autorizarUsuarios([1]),
    serviciosControlador.eliminarServicio
);

export {router};
