import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador{
    constructor(){
        this.serviciosServicio = new ServiciosServicio();
    }
    buscarServicios = async (req, res) =>{
        try{
            const servicios = await this.serviciosServicio.buscarServicios();
            res.json({
                estado: true,
                datos: servicios
            });
        }catch(error){
            console.log('Error en GET /servicios', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    buscarServicioPorId = async (req, res) =>{
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.buscarServicioPorId(servicio_id);
            if(!servicio){
                return res.status(404).json({
                    estado:false,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            res.json({
                estado:true,
                mensaje: servicio
            });
        }catch(error){
            console.log('Error en GET /servicios/:servicio_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    crearServicio = async(req, res)=>{
        try{
            const servicio_nuevo = await this.serviciosServicio.crearServicio(req);
            res.status(201).json({
                estado:true,
                mensaje: 'Servicio Creado.',
                servicio_creado: servicio_nuevo
            });
        }catch(error){
            console.log('Error en POST /servicios/', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarServicioParcialmente = async (req,res)=>{
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.buscarServicioPorId(servicio_id);
            if(!servicio){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            const servicio_modificado_parcialmente = await this.serviciosServicio.modificarServicioParcialmente(req, servicio_id);
            if(!servicio_modificado_parcialmente){
                throw new Error ('No se pudo modificar el servicio.');
            }
            res.json({
                estado: true,
                mensaje: `Servicio con ID ${servicio_id} modificado.`,
                servicio_modificado: servicio_modificado_parcialmente
            });
        }catch(error){
            console.log('Error en PATCH /servicios/:servicio_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarServicio = async (req, res) =>{
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.buscarServicioPorId(servicio_id);
            if(servicio.length === 0){
                return res.status(404).json({
                    estado:false,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            const servicio_modificado = await this. serviciosServicio.modificarServicio(req, servicio_id);
            res.json({
                estado: true,
                mensaje: `Servicio con ID ${servicio_id} modificado.`,
                servicio_modificado: servicio_modificado
            });
        }catch(error){
            console.log('Error en PUT /servicios/:servicio_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    eliminarServicio = async (req, res) =>{
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.serviciosServicio.buscarServicioPorId(servicio_id);
            if(!(servicio)){
                return res.status(404).json({
                    estado:true,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            await this.serviciosServicio.eliminarServicio(servicio_id);
            res.json({
                estado: true,
                mensaje: 'Servicio eliminado.'
            });
        }catch(error){
            console.log('Error en DELETE /servicios/:servicio_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}