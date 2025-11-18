import Usuarios from "../db/usuarios.js";

export default class usuariosService {
    constructor(){
        this.usuarios = new Usuarios();
    }
    buscarUsuarios = (nombre_usuario, contrasenia) =>{
        return this.usuarios.buscarUsuarios(nombre_usuario, contrasenia);
    }

    buscarTodos = () => {
    return this.usuarios.buscarTodos();
}

    buscarUsuarioPorId = (usuario_id) =>{
        return this.usuarios.buscarUsuarioPorId(usuario_id)
    }
    buscarUsuarioPorTipo = (tipo_usuario)=>{
        return this.usuarios.buscarUsuarioPorTipo(tipo_usuario);
    }
    buscarUsuarioPorNombreYApellido= (req) =>{
        return this.usuarios.buscarUsuarioPorNombreYApellido(req);
    }
    crearUsuario = (req) =>{
        return this.usuarios.crearUsuario(req);
    }
    modificarUsuarioParcialmente= (req, usuario_id) =>{
        return this.usuarios.modificarUsuarioParcialmente(req, usuario_id);
    }
    modificarUsuario = (req, usuario_id)=>{
        return this.usuarios.modificarUsuario(req,usuario_id);
    }
    eliminarUsuario = (usuario_id) => {
        return this.usuarios.eliminarUsuario(usuario_id);
    }
}