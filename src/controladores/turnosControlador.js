import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador{
    constructor(){
        this.turnosServicio = new TurnosServicio();
    }
    buscarTurnos = async (req, res) =>{
        try{
            const turnos = await this.turnosServicio.buscarTurnos();
            res.json({
                estado:true,
                datos: turnos
            });
        }catch(error){
            console.log('Error en GET /turnos', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    buscarTurnoPorId = async (req, res) =>{
        try{
            const turno_id = req.params.turno_id;
            const turno = await this.turnosServicio.buscarTurnoPorId(turno_id);
            if(!turno){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }
            res.json({
                estado: true,
                mensaje: turno
            });
        }catch(error){
            console.log('Error en GET /turnos/:turno_id', error);
            res.status(500).json({
                estado:false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    crearTurno = async (req,res)=>{
        try{
            const nuevo_turno = await this.turnosServicio.crearTurno(req);
            res.status(201).json({
                estado: true,
                mensaje: 'Turno creado.',
                turno_creado: nuevo_turno
            });
        }catch(error){
            console.log('Error en POST /turnos/', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarTurnoParcialmente = async (req, res)=>{
        try{
            const turno_id = req.params.turno_id;
            const turno = await this.turnosServicio.buscarTurnoPorId(turno_id);
            if(!turno){
                return res.status(404).json({
                    estado:false,
                    mensaje:' Turno no encontrado. '
                });
            }
            const turno_modificado= await this.turnosServicio.modificarTurnoParcialmente(req, turno_id);
            if(!turno_modificado){
                throw new Error ('No se pudo modificar el turno.')
            }
            res.json({
                estado:true,
                mensaje: `Turno con ID ${turno_id} modificado.`,
                turno_modificado: turno_modificado
            });
        }catch(error){
            console.log('Error en PATCH /turnos/:turno_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarTurno = async (req, res)=>{
        try{
            const turno_id = req.params.turno_id;
            const turno = await this.turnosServicio.buscarTurnoPorId(turno_id);
            if(!turno){
                return res.status(404).json({
                    estado:false,
                    mensaje:' Turno no encontrado. '
                });
            }
            const turno_modificado= await this.turnosServicio.modificarTurno(req, turno_id);
            res.json({
                estado:true,
                mensaje: `Turno con ID ${turno_id} modificado.`,
                turno_modificado: turno_modificado
            });
        }catch(error){
            console.log('Error en PUT /turnos/:turno_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }

    listarTurnosDisponibles = async (req, res) => {
        try {
            const turnos = await turnosService.obtenerTurnosActivos(); 
            res.json({ estado: true, turnos });
        } catch (error) {
            res.status(500).json({ estado: false, mensaje: 'Error al listar turnos.', error: error.message });
        }
    }
    
    eliminarTurno =async (req,res)=>{
        try{
            const turno_id= req.params.turno_id;
            const turno = await this.turnosServicio.buscarTurnoPorId(turno_id);
            if(!turno){
                return res.status(404).json({
                    estado:false,
                    mensaje:'Turno no encontrado.'
                });
            }
            await this.turnosServicio.eliminarTurno(turno_id);
            res.json({
                estado: true,
                mensaje: 'Turno eliminado.'
            });
        }catch(error){
            console.log('Error en DELETE /turnos/:turno_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}