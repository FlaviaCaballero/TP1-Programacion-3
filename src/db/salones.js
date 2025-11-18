
import {conexion} from "./conexion.js";

export default class Salones{
    
    buscarSalones = async () =>{
        const sql = 'SELECT salon_id, titulo,direccion, capacidad,importe FROM salones WHERE activo = 1';
        const [salones] = await conexion.execute(sql);
        return salones; 
    }
    buscarSalonPorId = async (salon_id) =>{
        const sql = 'SELECT salon_id, titulo,direccion, capacidad,importe FROM salones WHERE salon_id = ? AND activo = 1';
        const [salon] = await conexion.execute(sql, [salon_id]);
        return salon[0]||null;
    }
    crearSalon = async (req) =>{
        const {titulo, direccion, capacidad, importe}= req.body;
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)';
        const valores = [titulo, direccion, capacidad, importe];
        const [resultado] = await conexion.execute(sql, valores);
        const salon_creado = await this.buscarSalonPorId(resultado.insertId);
        return salon_creado;
    }
    modificarSalonParcialmente= async(req, salon_id) =>{
        const camposEntregados = Object.keys(req.body);
        const valoresEntregados = Object.values(req.body);
        if (camposEntregados.length === 0){
            console.log('No han enviado datos para modificar')
            return null
        }
        const setValores = camposEntregados.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEntregados, salon_id];
        const sql = `UPDATE salones SET ${setValores} WHERE salon_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if (resultado.affectedRows ===0){
            return null
        }
        const salon_modificado = await this.buscarSalonPorId(salon_id);
        return salon_modificado;
    }
    modificarSalon = async (req, salon_id) =>{
        const {titulo, direccion, capacidad, importe}= req.body;
        const sql = 'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?';
        const valores = [titulo, direccion, capacidad, importe, salon_id];
        const [resultado] = await conexion.execute(sql,valores);
        if (resultado.affectedRows ===0){
            return null
        }
        const salon_modificado = this.buscarSalonPorId(salon_id);
        return salon_modificado;
    }
    eliminarSalon = async (salon_id)=>{
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        const [salon_eliminado] = await conexion.execute(sql, [salon_id]);
        return salon_eliminado
    }
}