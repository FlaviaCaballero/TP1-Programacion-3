
import Salones from "../db/salones.js";

export default class SalonesServicio {
    constructor(){
        this.salones = new Salones();
    }
    buscarSalones = () =>{
        return this.salones.buscarSalones();
    }
    buscarSalonPorId = (salon_id) =>{
        return this.salones.buscarSalonPorId(salon_id);
    }
    crearSalon = (req) =>{
        return this.salones.crearSalon(req);
    }
    modificarSalonParcialmente= (req, salon_id) =>{
        return this.salones.modificarSalonParcialmente(req, salon_id);
    }
    modificarSalon = (req, salon_id) =>{
        return this.salones.modificarSalon(req, salon_id);
    }
    eliminarSalon = (salon_id) => {
        return this.salones.eliminarSalon(salon_id);
    }
}