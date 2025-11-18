

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Reservas - Documentación",
            version: "1.0.0",
            description: "Documentación generada con Swagger para la API de reservas"
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ],

        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ]
    },

    
    apis: ["./src/v1/rutas/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };


