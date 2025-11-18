import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicio.js";
import NotificacionesServicios from "./notificacionesServicio.js"
import informeServicio from "./informeServicio.js";

export default class ReservasServicio {
    constructor(){
        this.reservas= new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.notificaciones_servicios = new NotificacionesServicios();
        this.informes = new informeServicio();  
    }

    buscarDatosReporteReservas2 = async () => {
        return await this.reservas.buscarDatosReporteReservas2();
    };
    

    buscarReservas = ()=>{
        return this.reservas.buscarReservas();
    }
    buscarReservaPorId = (reserva_id)=>{
        return this.reservas.buscarReservaPorId(reserva_id);
    }

    obtenerReservasPorUsuario = async (usuario_id) => {
        return this.reservas.obtenerReservasPorUsuario(usuario_id);
        
    }
    
    obtenerTodasReservas = async () => {
        try {
            const reservas = await this.reservas.buscarReservas(); 
            return reservas;
        } catch (error) {
            console.error("Error en obtenerTodasReservas:", error);
            throw error;
        }
    }
    
    
    crearReserva = async (reserva) => {
        const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, servicios } = reserva;
        const nuevaReserva = { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total };
    
        const resultado = await this.reservas.crearReserva(nuevaReserva); 
        if (!resultado) return null;
    
       
        if (Array.isArray(servicios) && servicios.length > 0) {
            await this.reservas_servicios.crearReservaServicio(resultado.reserva_id, servicios);
        }
    
        let datosParaNotificacion = await this.reservas.datosParaNotificacion(resultado.reserva_id);
    
      
        datosParaNotificacion.servicios = Array.isArray(datosParaNotificacion.servicios) 
            ? datosParaNotificacion.servicios 
            : [];
    
        try {
            await this.notificaciones_servicios.enviarCorreo(datosParaNotificacion);
        } catch (error) {
            console.log("ERROR enviando correo:", error);
            
        }
    
        return this.reservas.buscarReservaPorId(resultado.reserva_id);
    }
    

    modificarReservaParcialmente= async (req, reserva_id)=>{
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, servicios}= req.body;
        const modificaciones= {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total};
        const resultado = await this.reservas.modificarReservaParcialmente(modificaciones,reserva_id);
        if(!resultado){
            return null;
        }
      
       return this.reservas.buscarReservaPorId(resultado.reserva_id);
        
    }
    modificarReserva= async(req, reserva_id)=>{
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, servicios}= req.body;
        const modificaciones= {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total};
        const resultado = await this.reservas.modificarReserva(modificaciones,reserva_id);
        if(!resultado){
            return null;
        }
    
       return this.reservas.buscarReservaPorId(resultado.reserva_id);
    }
    eliminarReserva = (reserva_id)=>{
        return this.reservas.eliminarReserva(reserva_id);
    }

    generarInforme = async (formato) => {
        if (formato === 'pdf') {

            const datosReporte = await this.buscarDatosReporteReservas2();


            const pdf = await this.informes.informeReservasPdf(datosReporte);
            
            return {
                buffer: pdf,
                headers:{
                    'Content-Type' : 'application/pdf',
                    'Content-Dispositon' : 'inline; filename = "reporte3010.pdf"'
                }
            }

        }else if (formato === 'csv'){
            
            const datosReporte = await this.buscarDatosReporteReservas2();


            const csv =  await this.informes.informeReservasCsv(datosReporte);
            
            return {
                path: csv,
                headers:{
                    'Content-Type' : 'text/csv',
                    'Content-Dispositon' : 'attachment; filename = "reporte.csv"'
                }
            }

        }
    }
}
