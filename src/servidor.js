import app from './reservas.js'
//procesa el archivo .env
process.loadEnvFile();
const PUERTO = process.env.PUERTO;
app.listen(PUERTO, () =>{
    console.log(`El Servidor se encuentra activo en el puerto ${PUERTO}`);
})