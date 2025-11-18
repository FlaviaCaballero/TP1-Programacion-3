import NotificacionesServicio from '../servicios/notificacionesServicio.js';

export default class NotificacionesControlador {
    constructor() {
        this.servicio = new NotificacionesServicio();
    }

    enviarNotificacion = async (req, res) => {
        try {
            const respuesta = await this.servicio.enviarCorreo(req.body);
            res.json({ estado: true, mensaje: respuesta });
        } catch (error) {
            res.status(500).json({ estado: false, mensaje: error.message });
        }
    }
}
