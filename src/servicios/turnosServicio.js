import Turnos from "../db/turnos.js";

export default class TurnosServicio{
    constructor(){
        this.turnos = new Turnos();
    }
    buscarTurnos = () =>{
        return this.turnos.buscarTurnos();
    }
    buscarTurnoPorId = (turno_id)=>{
        return this.turnos.buscarTurnoPorId(turno_id);
    }
    crearTurno = (req)=>{
        return this.turnos.crearTurno(req);
    }
    modificarTurnoParcialmente = (req, turno_id)=>{
        return this.turnos.modificarTurnoParcialmente(req, turno_id);
    }
    modificarTurno= (req, turno_id)=>{
        return this.turnos.modificarTurno(req, turno_id);
    }
    eliminarTurno = (turno_id)=>{
        return this.turnos.eliminarTurno(turno_id);
    }

    obtenerTurnosActivos = async () => {
        const sql = `
            SELECT *
            FROM turnos
            WHERE activo = 1
            ORDER BY orden
        `;
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }
    
}