
import jwt from 'jsonwebtoken';
import passport from 'passport';

export default class AuthController {

    login = async (req, res) => {

        passport.authenticate('local', { session: false }, (err, usuario, info) => {

            if (err || !usuario) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Solicitud incorrecta."
                });
            }

            
            req.login(usuario, { session: false }, (err) => {
                if (err) {
                    return res.status(500).json({ 
                        estado: false, 
                        mensaje: "Error al iniciar sesión." 
                    });
                }

               
                const token = jwt.sign(
                    {
                        usuario_id: usuario.usuario_id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        nombre_usuario: usuario.nombre_usuario,
                        tipo_usuario: usuario.tipo_usuario
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return res.json({
                    estado: true,
                    token: token
                });
            });

        })(req, res);

    }

}
