import UsuariosServicio from "../servicios/usuariosService.js";

export default class UsuariosControlador {
    constructor(){
        this.usuariosServicio = new UsuariosServicio();
    }
    
    
    buscarUsuarios = async (req, res) => {
        try {
            const { nombre_usuario, contrasenia } = req.query;

            let usuarios;

            if (nombre_usuario && contrasenia) {
                // Login
                usuarios = await this.usuariosServicio.buscarUsuarios(nombre_usuario, contrasenia);

                if (!usuarios) {
                    return res.status(401).json({
                        estado: false,
                        mensaje: "Usuario o contraseña incorrectos"
                    });
                }

                return res.json({
                    estado: true,
                    datos: usuarios
                });
            } else {
                // Listar todos
                usuarios = await this.usuariosServicio.buscarTodos();

                return res.json({
                    estado: true,
                    datos: usuarios
                });
            }
        } catch (error) {
            console.log("Error en GET /usuarios", error);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor"
            });
        }
    }
    

    buscarUsuarioPorId = async (req, res)=>{
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.buscarUsuarioPorId(usuario_id);
            if (!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
            res.json({
                estado: true,
                datos: usuario
            });
        }catch(error){
            console.log('Error en GET /usuarios/:usuario_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    buscarUsuarioPorTipo = async (req, res) =>{
        try{
            const tipo_usuario = req.params.tipo_usuario;
            const usuarios = await this.usuariosServicio.buscarUsuarioPorTipo(tipo_usuario);
            if (usuarios.length === 0){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'No hay resultados para esta búsqueda.'
                });
            }
            res.json({
                estado: true,
                mensaje: usuarios
            });
        }catch(error){
            console.log('Error en GET /usuarios/:tipo_usuario', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    buscarUsuarioPorNombreYApellido= async (req, res)=>{
        try{
            const usuariosEncontrados = await this.usuariosServicio.buscarUsuarioPorNombreYApellido(req);
            if(!usuariosEncontrados || usuariosEncontrados.length === 0){
                return res.status(404).json({
                        estado: false,
                        mensaje: 'No se encontraron usuarios'
                    })
            }
            res.json({
                estado:true,
                datos: usuariosEncontrados
            }); 
        }catch(error){
            console.log('Error en GET /usuarios?nombre=pedro&apellido=picapiedras', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    crearUsuario = async (req,res)=>{
        try{
            const usuario_nuevo = await this.usuariosServicio.crearUsuario(req);
            res.status(201).json({
                estado: true,
                mensaje: 'Usuario creado',
                usuario_creado: usuario_nuevo
            });
        }catch(error){
            console.log('Error en POST /usuarios/', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarUsuarioParcialmente = async (req,res)=>{
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.buscarUsuarioPorId(usuario_id); 
            if(!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            } 
            const usuario_modificado_parcialmente = await this.usuariosServicio.modificarUsuarioParcialmente(req, usuario_id);//modifico lo que manden
            if (!usuario_modificado_parcialmente){
                throw new Error ('No se pudo modificar el usuario')
            }
            res.json({
                estado: true,
                mensaje: `Usuario ${usuario_id} modificado.`,
                usuario_modificado: usuario_modificado_parcialmente
            });
        }catch(error){
            console.log('Error en PATCH /usuarios/:usuario_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    modificarUsuario = async (req,res)=>{
        try{
            const usuario_id = req.params.usuario_id;
            //verifico que el id exista
            const usuario = await this.usuariosServicio.buscarUsuarioPorId(usuario_id);
            if(!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
           
            const usuario_modificado = await this.usuariosServicio.modificarUsuario(req, usuario_id); 
            res.json({
                estado: true,
                mensaje: `Usuario modificado.`,
                usuario_modificado: usuario_modificado
            });
        }catch(error){
            console.log('Error en PUT /usuarios/:usuario_id', error);
            res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
            });
        }
    }
    eliminarUsuario = async (req,res)=>{
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.buscarUsuarioPorId(usuario_id);
            if(!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
            await this.usuariosServicio.eliminarUsuario(usuario_id);
            res.json({
            estado: true,
            mensaje: `Usuario eliminado.`
            });
        }catch(error){
            console.log('Error en DELETE /usuarios/:usuario_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}