import { conexion } from "./conexion.js";

export default class Servicios{
    buscarServicios = async() =>{
        const sql = 'SELECT servicio_id, descripcion,importe FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }
    buscarServicioPorId = async (servicio_id) => {
        const sql = 'SELECT servicio_id, descripcion,importe FROM servicios WHERE servicio_id = ? AND activo = 1';
        const [servicio] = await conexion.execute(sql, [servicio_id]);
        return servicio[0]||null;
    }
    crearServicio = async (req, res) =>{
        const {descripcion, importe} = req.body;
        const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?,?)'
        const [resultado]= await conexion.execute(sql, [descripcion,importe]);
        const servicio_creado = await this.buscarServicioPorId(resultado.insertId);
        return servicio_creado;
    }
    modificarServicioParcialmente = async (req,servicio_id)=>{
        const camposEntregados = Object.keys(req.body);
        const valoresEntregados = Object.values(req.body);
        if(camposEntregados.length === 0){
            console.log('No se enviaron datos para modificar.');
            return null
        }
        const setValores = camposEntregados.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresEntregados, servicio_id];
        const sql = `UPDATE servicios SET ${setValores} WHERE servicio_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if (resultado.affectedRows===0){
            return null
        }
        const servicio_modificado = await this.buscarServicioPorId(servicio_id);
        return servicio_modificado;
    }
    modificarServicio = async (req, servicio_id) =>{
        const {descripcion, importe} = req.body;
        const sql = 'UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?';
        const [resultado] = await conexion.execute(sql, [descripcion, importe,servicio_id]);
        if (resultado.affectedRows === 0){
            return null;
        }
        const servicio_modificado = this.buscarServicioPorId(servicio_id);
        return servicio_modificado;
    }
    eliminarServicio = async (servicio_id) =>{
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?';
        const [servicio_eliminado]= await conexion.execute(sql, [servicio_id]);
        return servicio_eliminado;
    }
}