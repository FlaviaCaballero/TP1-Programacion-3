import express from 'express';
import AuthController from '../../controladores/authController.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints relacionados al inicio de sesión
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: Permite iniciar sesión con nombre de usuario (email) y contraseña. Devuelve un token JWT si las credenciales son válidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Email del usuario
 *                 example: admin@gmail.com
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: admin
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve un token JWT.
 *       400:
 *         description: Credenciales incorrectas o error en validación.
 *       500:
 *         description: Error del servidor.
 */

const router = express.Router();
const authController = new AuthController();

router.post('/login', 
    [
        check('nombre_usuario', 'El correo electrónico es requerido!').not().isEmpty(),
        check('nombre_usuario', 'Revisar el formato del correo electrónico!').isEmail(),
        check('contrasenia', 'La contrasenia es requerida!').not().isEmpty(),
        validarCampos
    ], 
    
    authController.login);

export {router};