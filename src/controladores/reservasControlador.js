import ReservasServicio from "../servicios/reservasServicio.js";
import pkg from "pdfkit";
const PDFDocument = pkg;


const formatosPermitidos = ['pdf', 'csv']

export default class ReservasControlador{
    constructor(){
        this.reservasServicio= new ReservasServicio();
    }
    buscarReservas = async (req, res )=>{
        try{
            const reservas = await this.reservasServicio.buscarReservas();
            res.json({
                estado:true,
                datos: reservas
            });
        }catch(error){
            console.log('Error en GET /reservas', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    buscarReservaPorId = async (req,res)=>{
        try{
            const reserva_id= req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarReservaPorId(reserva_id);
            if(!reserva){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            res.json({
                estado: true,
                mensaje: reserva
            });
        }catch(error){
            console.log('Error en GET /reservas/:reserva_id', error);
            res.status(500).json({
                estado:false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    crearReserva = async (req, res) =>{
        console.log("Body recibido en crearReserva:", req.body);
        try{
            const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon,importe_total, servicios} = req.body;
            const reserva= { fecha_reserva, salon_id, usuario_id, turno_id,foto_cumpleaniero, tematica, importe_salon,importe_total, servicios}
            const reserva_nueva = await this.reservasServicio.crearReserva(reserva);
            if (!reserva_nueva){
                return res.status(404).json({
                    estado:false,
                    mensaje: 'No se pudo crear la reserva'
                });
            }
            res.status(201).json({
                estado: true,
                mensaje: 'Reserva creada',
                reserva_creada: reserva_nueva
            });
        }catch(error){
            console.log('Error en POST /reservas/', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarReservaParcialmente= async (req, res)=>{
        try{
            const reserva_id = req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarReservaPorId(reserva_id);
            if(!reserva){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            const reserva_modificada= await this.reservasServicio.modificarReservaParcialmente(req, reserva_id);
            if(!reserva_modificada){
                throw new Error ('No se pudo modificar la reserva.');
            }
            res.json({
                estado: true,
                mensaje: `Reserva con id ${reserva_id} modificada.`,
                reserva_modificada: reserva_modificada
            })
        }catch(error){
            console.log('Error en PATCH /reservas/:reservas_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarReserva = async (req,res)=>{
        try{
            const reserva_id= req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarReservaPorId(reserva_id);
            if(reserva.length ===0){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            const reserva_modificada = await this.reservasServicio.modificarReserva(req, reserva_id);
            res.json({
                estado:true,
                mensaje: 'Reserva modificada.',
                reserva_modificada: reserva_modificada
            });
        }catch(error){
            console.log('Error en PUT /reservas/:reserva_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }

    listarReservas = async (req, res) => {
        console.log("Usuario logueado:", req.user); 
        try {
            const usuario = req.user; 
    
            let reservas;
    
            if (usuario.tipo_usuario === 3) { 
               
                reservas = await this.reservasServicio.obtenerReservasPorUsuario(usuario.usuario_id);

            } else {
                
                reservas = await this.reservasServicio.obtenerTodasReservas();
            }
    
            res.json({ estado: true, reservas });
        } catch (error) {
            res.status(500).json({ estado: false, mensaje: 'Error al listar reservas.', error: error.message });
        }
    }
    

    eliminarReserva = async (req,res)=>{
        try{
            const reserva_id= req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarReservaPorId(reserva_id);
            if(reserva.length ===0){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            await this.reservasServicio.eliminarReserva(reserva_id);
            res.json({
                estado:true,
                mensaje: 'Reserva eliminada.'
            });
        }catch(error){
            console.log('Error en DELETE /reservas/:reserva_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }


    informe = async (req, res) => {

        try{
            const formato = req.query.formato;
    
            if(!formato || !formatosPermitidos.includes(formato)){
                return res.status(400).send({
                    estado:"Falla",
                    mensaje: "Formato inválido para el informe."    
                })
            }
            
            const {buffer, path, headers} = await this.reservasServicio.generarInforme(formato);
            
            
            res.set(headers)
    
            if (formato === 'pdf') {
                res.status(200).end(buffer);
    
            } else if (formato === 'csv') {
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado:"Falla",
                            mensaje: " No se pudo generar el informe."    
                        })
                    }
                })
            }
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }

    informeReservas2 = async (req,res) => {
        try {
            const data = await this.reservasServicio.buscarDatosReporteReservas2();
    
            
            const pdfDoc = new PDFDocument();
            const chunks = [];
            pdfDoc.on("data", (chunk) => chunks.push(chunk));
            pdfDoc.on("end", () => {
                const pdfBuffer = Buffer.concat(chunks);
                res.contentType("application/pdf");
                res.send(pdfBuffer);
            });
    
            pdfDoc.fontSize(18).text("Reporte reservas (SP reporte_reservas2)", { underline: true });
            pdfDoc.moveDown();
    
            data.forEach((fila) => {
                pdfDoc.fontSize(12).text(
                    `Reserva ${fila.reserva_id} | Fecha: ${fila.fecha_reserva} | Salón: ${fila.salon_id} | Turno: ${fila.turno_id} | Tema: ${fila.tematica} | Total: ${fila.importe_total}`
                );
                pdfDoc.moveDown(0.5);
            });
    
            pdfDoc.end();
    
        } catch (error) {
            res.status(500).json({
                estado: false,
                mensaje: "Error al generar el informe SP reporte_reservas2",
                error: error.message
            });
        }
    };
    
    
}

