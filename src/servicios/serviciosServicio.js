import Servicios from "../db/servicios.js";

export default class ServiciosServicio{
    constructor(){
        this.servicios = new Servicios();
    }
    buscarServicios = () =>{
        return this.servicios.buscarServicios();
    }
    buscarServicioPorId = (servicio_id) =>{
        return this.servicios.buscarServicioPorId(servicio_id);
    }
    crearServicio = (req) => {
        return this.servicios.crearServicio(req);
    }
    modificarServicioParcialmente = (req, servicio_id)=>{
        return this.servicios.modificarServicioParcialmente(req, servicio_id);
    }
    modificarServicio = (req, servicio_id) =>{
        return this.servicios.modificarServicio(req, salon_id);
    }
    eliminarServicio = (servicio_id) =>{
        return this.servicios.eliminarServicio(servicio_id);
    }
}