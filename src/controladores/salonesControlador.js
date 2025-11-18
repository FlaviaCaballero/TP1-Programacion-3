import SalonesServicio from "../servicios/salonesServicio.js";
import apicache from 'apicache';

export default class SalonesControlador{
    constructor(){
        this.salonesServicio = new SalonesServicio();
    }
    buscarSalones = async (req,res) => {
        try{
            const salones = await this.salonesServicio.buscarSalones();
            res.json({
                estado:true,
                datos: salones
            });
        }catch(error){
            console.log('Error en GET /salones', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarSalonPorId = async (req, res) =>{
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarSalonPorId(salon_id);
            if(!salon){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }
            res.json({
                estado: true,
                mensaje: salon
            });
        }catch(error){
            console.log('Error en GET /salones/:salon_id', error);
            res.status(500).json({
                estado:false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    crearSalon = async (req, res)=>{
        try{
            const salon_nuevo = await this.salonesServicio.crearSalon(req);
            apicache.clear('/api/v1/salones');
            res.status(201).json({
                estado: true,
                mensaje: `Salón creado.`,
                salon_creado: salon_nuevo
            });
        }catch(error){
            console.log('Error en POST /salones/', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarSalonParcialmente = async (req,res)=>{
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarSalonPorId(salon_id); 
            if(!salon){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            } 
            const salon_modificado_parcialmente = await this.salonesServicio.modificarSalonParcialmente(req, salon_id);//modifico lo que manden
            if (!salon_modificado_parcialmente){
                throw new Error ('No se pudo modificar el salón')
            }
            apicache.clear('/api/v1/salones');
            res.json({
                estado: true,
                mensaje: `Salón ${salon_id} modificado.`,
                salon_modificado: salon_modificado_parcialmente
            });
        }catch(error){
            console.log('Error en PATCH /salones/:salon_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarSalon = async (req,res)=>{
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarSalonPorId(salon_id); 
            if(salon.length===0){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }
            const salon_modificado = await this.salonesServicio.modificarSalon(req, salon_id); 
            apicache.clear('/api/v1/salones');
            res.json({
                estado: true,
                mensaje: `Salón modificado.`,
                salon_modificado: salon_modificado
            });
        }catch(error){
            console.log('Error en PUT /salones/:salon_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminarSalon = async (req,res)=>{
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarSalonPorId(salon_id);
            if(!salon){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }
            await this.salonesServicio.eliminarSalon(salon_id);
            apicache.clear('/api/v1/salones');
            res.json({
                estado: true,
                mensaje: `Salón eliminado.`
            });
           
        }catch(error){
            console.log('Error en DELETE /salones/:salon_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}