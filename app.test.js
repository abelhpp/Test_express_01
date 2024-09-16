import supertest from 'supertest';
import app from './app.js';

// Crea una instancia de supertest usando tu aplicación Express
const request = supertest(app);

describe("Prueba de la ruta /login", () => {

    describe("Cuando usuario y clave son enviados correctamente", () => {
        // Aquí puedes agregar pruebas para cuando los datos son incorrectos

        test("responder con un código de estado 200", async () => {
            // Enviamos una solicitud POST a /usuarios
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "clave"
            });

            // Verificamos que el código de estado de la respuesta sea 200
            expect(response.statusCode).toBe(200);

        });
    
        test("El body de la respuesta tiene que ser del tipo Json.", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "clave"
            });

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json")); // Ejemplo de código de estado para errores
        });


        test("Se envia un usuario incorrecto", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario Incorrecto",
                clave: "clave"
            });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Usuario no existe');
        });
    
    });

 

});

describe('Prueba de la ruta /login', () => {
    
    describe('Cuando no se proporciona un token', () => {
        test('debería responder con un código de estado 400 y mensaje "Token no proporcionado"', async () => {
            const response = await request.get('/login');
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Token no proporcionado');
        });
    });

    describe('Cuando el token es "valido"', () => {
        //debería responder con un código de estado 200 y mensaje "Token válido"', async () => {
    });

    describe('Cuando el token es "invalido"', () => {
        //debería responder con un código de estado 401 y mensaje "Token inválido"', async () => {

    });

    describe('Cuando el token tiene un valor pero es falso', () => {
        //debería responder con un código de estado 404 y mensaje "Error del cliente"', async () => {

    });
});