
import express from 'express';
import passport from 'passport';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para administración de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *         tipo_usuario:
 *           type: integer
 *       example:
 *         usuario_id: 1
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         nombre_usuario: "juan@gmail.com"
 *         tipo_usuario: 1
 */

/**
 * @swagger
 * /api/v1/usuarios/tipo/{tipo_usuario}:
 *   get:
 *     summary: Buscar usuarios por tipo
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipo_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tipo de usuario (1 = admin, 2 = empleado, 3 = cliente)
 *     responses:
 *       200:
 *         description: Lista de usuarios filtrados por tipo
 */

/**
 * @swagger
 * /api/v1/usuarios/busqueda:
 *   get:
 *     summary: Buscar usuarios por nombre y apellido
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: false
 *       - in: query
 *         name: apellido
 *         required: false
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   get:
 *     summary: Buscar usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   patch:
 *     summary: Modificar un usuario parcialmente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario modificado parcialmente
 */

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   put:
 *     summary: Modificar un usuario completamente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   delete:
 *     summary: Eliminar un usuario (borrado lógico)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */


const usuariosControlador = new UsuariosControlador();
const router = express.Router();

router.get('/tipo/:tipo_usuario',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    usuariosControlador.buscarUsuarioPorTipo
);

router.get('/busqueda',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    usuariosControlador.buscarUsuarioPorNombreYApellido
);

router.get('/:usuario_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    usuariosControlador.buscarUsuarioPorId
);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    usuariosControlador.buscarUsuarios
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('nombre').notEmpty(),
        check('apellido').notEmpty(),
        check('nombre_usuario').notEmpty().isEmail(),
        check('contrasenia').notEmpty().custom((contrasenia, { req }) => {
            const email = req.body.nombre_usuario;
            const claveCorrecta = email.split('@')[0];
            if (contrasenia !== claveCorrecta) throw new Error('Contraseña no válida.');
            return true;
        }),
        check('tipo_usuario').isInt({ min: 1, max: 3 }),
        validarCampos
    ],
    usuariosControlador.crearUsuario
);

router.patch('/:usuario_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('nombre_usuario').optional().isEmail(),
        check('contrasenia').optional().custom((contrasenia, { req }) => {
            const email = req.body.nombre_usuario;
            const claveCorrecta = email.split('@')[0];
            if (contrasenia !== claveCorrecta) throw new Error('Contraseña no válida.');
            return true;
        }),
        check('tipo_usuario').optional().isInt({ min: 1, max: 3 }),
        validarCampos
    ],
    usuariosControlador.modificarUsuarioParcialmente
);

router.put('/:usuario_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    [
        check('nombre').notEmpty(),
        check('apellido').notEmpty(),
        check('nombre_usuario').isEmail(),
        check('contrasenia').notEmpty().custom((contrasenia, { req }) => {
            const email = req.body.nombre_usuario;
            const claveCorrecta = email.split('@')[0];
            if (contrasenia !== claveCorrecta) throw new Error('Contraseña no válida.');
            return true;
        }),
        check('tipo_usuario').isInt({ min: 1, max: 3 }),
        validarCampos
    ],
    usuariosControlador.modificarUsuario
);

router.delete('/:usuario_id',
    passport.authenticate('jwt', { session: false }),
    autorizarUsuarios([1]),
    usuariosControlador.eliminarUsuario
);

export { router };




