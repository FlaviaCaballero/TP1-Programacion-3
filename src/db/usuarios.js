import { conexion } from "./conexion.js";

export default class Usuarios{

    buscarUsuarios = async (nombre_usuario, contrasenia) => {
        const sql = `
            SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario
            FROM usuarios
            WHERE activo = 1
            AND nombre_usuario = ?
            AND contrasenia = SHA2(?, 256)
            LIMIT 1

        `;
        const [usuarios] = await conexion.execute(sql, [nombre_usuario, contrasenia]);
        return usuarios[0];

    }
    
    buscarTodos = async () => {
    const sql = `
        SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario
        FROM usuarios
        WHERE activo = 1
    `;
    const [usuarios] = await conexion.execute(sql);
    return usuarios;
}
    buscarUsuarioPorId = async (usuario_id) =>{
        const sql = 'SELECT usuario_id,nombre,apellido,nombre_usuario as usuario, tipo_usuario FROM  usuarios WHERE usuario_id = ? AND activo = 1';
        const [usuario] = await conexion.execute(sql, [usuario_id]);
        return usuario[0] || null;
    }
    buscarUsuarioPorTipo = async (tipo_usuario) =>{
        const sql = 'SELECT * FROM  usuarios WHERE tipo_usuario = ? AND activo = 1';
        const [usuarios] = await conexion.execute(sql, [tipo_usuario]);
        return usuarios;
    }
    buscarUsuarioPorNombreYApellido = async(req) =>{
        const {nombre, apellido} = req.query;
        if( !nombre && !apellido){
            throw new Error('Debe ingresar un nombre o un apellido para esta consulta')
        }
        let sql = 'SELECT * FROM usuarios WHERE activo = 1';
        const valores = [];
        if (nombre){
            sql+= ' AND nombre LIKE ?';
            valores.push(`%${nombre}%`);
        }
         if (apellido){
            sql+= ' AND apellido LIKE ?';
            valores.push(`%${apellido}%`);
        }
        const [usuarios] = await conexion.execute(sql, valores);
        return usuarios;

    }
    crearUsuario = async (req) =>{
        const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario}= req.body;
        const sql = `
            INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario)
            VALUES (?, ?, ?, SHA2(?, 256), ?)
        `;

        const valores = [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario];
        const [resultado] = await conexion.execute(sql,valores);
      
       return await this.buscarUsuarioPorId(resultado.insertId);
    }

    modificarUsuarioParcialmente = async (req, usuario_id) => {
        const camposEntregados = Object.keys(req.body);
        const valoresEntregados = [];
    
        if (camposEntregados.length === 0) {
            console.log('No han enviado datos para modificar');
            return null;
        }
    
        const setValores = camposEntregados.map(campo => {
            if (campo === "contrasenia") {
                valoresEntregados.push(req.body[campo]);
                return "contrasenia = SHA2(?, 256)";
            } else {
                valoresEntregados.push(req.body[campo]);
                return `${campo} = ?`;
            }
        }).join(', ');
    
        const parametros = [...valoresEntregados, usuario_id];
    
        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`;
    
        const [resultado] = await conexion.execute(sql, parametros);
    
        if (resultado.affectedRows === 0) {
            return null;
        }
    
        return await this.buscarUsuarioPorId(usuario_id);
    }

    modificarUsuario = async (req, usuario_id) =>{
        const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario}= req.body;
        const sql = `
            UPDATE usuarios 
            SET nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = SHA2(?, 256), tipo_usuario = ?
             WHERE usuario_id = ?
        `;

        const valores = [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, usuario_id];
        const [resultado] = await conexion.execute(sql,valores);
        if (resultado.affectedRows ===0){
            return null
        }
        const usuario_modificado = this.buscarUsuarioPorId(usuario_id);
        return usuario_modificado;
    }
    eliminarUsuario = async (usuario_id)=>{
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        const [usuario_eliminado] = await conexion.execute(sql, [usuario_id]);
        return usuario_eliminado;
    }
}