import { conexion } from "./conexion.js";

export default class Turnos{
    buscarTurnos = async () =>{
        const sql = 'SELECT turno_id,orden, hora_desde, hora_hasta FROM turnos WHERE activo = 1';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }
    buscarTurnoPorId = async (turno_id) =>{
        const sql = 'SELECT turno_id,orden, hora_desde, hora_hasta FROM turnos WHERE turno_id = ? AND activo = 1';
        const [turno] = await conexion.execute(sql, [turno_id]);
        return turno[0]||null;
    }
    crearTurno = async (req) =>{
        const {orden, hora_desde,hora_hasta} = req.body;
        const valores = [orden, hora_desde,hora_hasta];
        const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?,?,?)';
        const [resultado] = await conexion.execute(sql, valores);
        const turno_creado = await this.buscarTurnoPorId(resultado.insertId);
        return turno_creado;
    }
    modificarTurnoParcialmente = async (req, turno_id)=>{
        const camposEntregados = Object.keys(req.body);
        const valoresEntregados = Object.values(req.body);
        if (camposEntregados.length === 0){
            console.log('No han enviado datos para modificar')
            return null
        }
        const setValores = camposEntregados.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEntregados, turno_id];
        const sql = `UPDATE turnos SET ${setValores} WHERE turno_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if (resultado.affectedRows ===0){
            return null
        }
        const turno_modificado = await this.buscarTurnoPorId(turno_id);
        return turno_modificado;
    }
    modificarTurno = async(req, turno_id)=>{
        const {orden, hora_desde,hora_hasta} = req.body;
        const sql = 'UPDATE turnos set orden= ? , hora_desde = ?, hora_hasta= ? WHERE turno_id = ?';
        const valores = [orden, hora_desde, hora_hasta, turno_id];
        const [resultado] = await conexion.execute(sql, valores);
        if(resultado.affectedRows=== 0){
            return null
        }
        const turno_modificado = await this.buscarTurnoPorId(turno_id);
        return turno_modificado;
    }
    eliminarTurno = async (turno_id)=>{
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        const [resultado] = await conexion.execute(sql,[turno_id]);
        return resultado
    }
}