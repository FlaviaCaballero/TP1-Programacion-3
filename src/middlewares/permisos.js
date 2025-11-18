export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const usuario = req.user;  

            if (!usuario) {
                return res.status(401).json({
                    estado: false,
                    mensaje: "No autorizado. Token inválido."
                });
            }

            if (!rolesPermitidos.includes(usuario.tipo_usuario)) {
                return res.status(403).json({
                    estado: false,
                    mensaje: "Acceso denegado. No tiene permisos suficientes."
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                estado: false,
                mensaje: "Error de autorización."
            });
        }
    };
};
