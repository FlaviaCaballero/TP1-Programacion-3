import { conexion } from "./conexion.js";

export default class Reservas{

    buscarPropias = async(usuario_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND usuario_id = ?';
        const [reservas] = await conexion.execute(sql, [usuario_id]);
        return reservas;
    }

    buscarReservas = async () =>{
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }
    buscarReservaPorId= async(reserva_id) =>{
        const sql = 'SELECT * FROM reservas WHERE reserva_id = ? AND activo = 1';
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        return reserva[0]||null;
    }
    crearReserva = async(reserva)=>{ 
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total} = reserva;
        const valores = [fecha_reserva, salon_id, usuario_id,turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total];
        const sql = 'INSERT INTO reservas (fecha_reserva, salon_id, usuario_id,turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?,?,?,?,?,?,?,?)';
        const [resultado] = await conexion.execute(sql, valores);
        if (resultado.affectedRows === 0){
            return null;
        }
        const reserva_creada = await this.buscarReservaPorId(resultado.insertId);
        return reserva_creada;
    }
    modificarReservaParcialmente= async(modificaciones, reserva_id) =>{
        const camposEntregados = Object.keys(modificaciones);
        const valoresEntregados = Object.values(modificaciones);
        if (camposEntregados.length === 0){
            console.log('No han enviado datos para modificar')
            return null
        }
        const setValores = camposEntregados.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEntregados, reserva_id];
        const sql = `UPDATE reservas SET ${setValores} WHERE reserva_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if (resultado.affectedRows ===0){
            return null
        }
        const reserva_modificada = await this.buscarReservaPorId(reserva_id);
        return reserva_modificada;
    }
   
    modificarReserva= async (modificaciones, reserva_id)=>{
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon,importe_total} = modificaciones;
        const valores = [fecha_reserva, salon_id, usuario_id,turno_id, foto_cumpleaniero, tematica, importe_salon,importe_total, reserva_id];
        const sql = 'UPDATE reservas SET fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, foto_cumpleaniero = ?, tematica = ?, importe_salon = ?,importe_total=? WHERE reserva_id = ?'
        const [resultado] = await conexion.execute(sql,valores);
        if (resultado.affectedRows ===0){
            return null
        }
        const reserva_modificada = this.buscarReservaPorId(reserva_id);
        return reserva_modificada;
    }
    eliminarReserva= async(reserva_id)=>{
        const sql = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ?';
        const [reserva_eliminada] = await conexion.execute(sql, [reserva_id]);
        return reserva_eliminada;
        
    }

    datosParaNotificacion = async (reserva_id) =>{
        const sql = 'SELECT r.fecha_reserva as fecha, s.titulo as salon, t.orden as turno FROM reservas as r INNER JOIN salones as s on s.salon_id INNER JOIN turnos as t on t.turno_id WHERE r.activo = 1 and r.reserva_id =?';
        const [reserva] = await conexion.execute(sql,[reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        return reserva[0];
    }

    obtenerReservasPorUsuario = async (usuario_id) => {
        const sql = `
            SELECT r.*, s.titulo AS salon, t.hora_desde, t.hora_hasta
            FROM reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            WHERE r.usuario_id = ? AND r.activo = 1
        `;
        const [reservas] = await conexion.execute(sql, [usuario_id]);
        return reservas;
    }

    buscarDatosReporteCsv = async() => {
        const sql = `CALL reporte_csv()`;
        const [result] = await conexion.query(sql);
        return result[0];
    }

    buscarDatosReporteReservas2 = async () => {
        const sql = `CALL reporte_reservas2()`;
        const [result] = await conexion.query(sql);
        return result[0];  
    };
    
}