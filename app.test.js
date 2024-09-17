import supertest from 'supertest';
import app from './app.js';

// Crea una instancia de supertest usando tu aplicación Express
const request = supertest(app);

describe("Prueba metodo POST ruta /login", () => {

    describe("Cuando el usuario o clave no fueron enviados", () => {
        
        test("responder con un estado 400", async () => {
            const envioPosibles = [
                {usuario: "usuario"},
                {clave: "clave"},
                {}
            ]
            for(const envio of envioPosibles){
                const response = await request.post("/login").send({envio});
                expect(response.statusCode).toBe(400);
            }        

        });
    });

    describe("Cuando el usuario y clave fueron enviados", () => {

        test("Tiene que responder En formato json", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "clave"
            });
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json")); // Ejemplo de código de estado para errores
        });

        test("Verifica si el usuario contiene codigo HTML", async () => {
            const response = await request.post("/login").send({
                usuario: "<a>lujan</<>",
                clave: "clave"
            });
            
            expect(response.body.message).toBe('El nombre de usuario contiene caracteres peligrosos');
            expect(response.statusCode).toBe(403);
        });

        test("Verifica si el usuario contiene codigo sql", async () => {
            const response = await request.post("/login").send({
                usuario: "SELECT * FROM user;",
                clave: "clave"
            });
            
            expect(response.body.message).toBe('El nombre de usuario contiene caracteres peligrosos');
            expect(response.statusCode).toBe(403);
        });


        test("Verifica si la clave tiene SQL injection ", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "SELECT * FROM user;"
            });
            
            expect(response.body.message).toBe('La clave contiene caracteres peligrosos');
            expect(response.statusCode).toBe(403);
        });


        test("La clave es de uso comun", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "1234"
            });
            
            expect(response.body.message).toBe('La clave es demasiado común');
            expect(response.statusCode).toBe(400);
        });



        test("Verifica la seguridad de la clave", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario",
                clave: "pedro"
            });
            
            expect(response.body.message).toBe('La clave es insegura');
            expect(response.statusCode).toBe(200);
        });

        
        test("Usuario con ip bloqueada", async () => {
            const response = await request.post("/login").send({
                usuario: "usuario Incorrecto",
                clave: "Abetek12@"
            });
            
            expect(response.body.message).toBe('Acceso denegado desde esta dirección IP');
            expect(response.statusCode).toBe(403);
        });

    })
 
});

describe('Prueba Metodo GET ruta /login', () => {
    
    describe('Cuando el token NO existe', ()=> {    
        test('debería responder con un código de estado 400 y mensaje "Token no proporcionado"', async () => {
            const response = await request.get('/login');
            
            expect(response.body.message).toBe('Token no proporcionado');
            expect(response.statusCode).toBe(400);
        });
        

    });

    describe('Cuando el token Existe', ()=> {

        test('Es un token es valido', async () => {
                const response = await request.get('/login').query({
                    token:"valido"
                });
            expect(response.body.message).toBe('aceptado');
            expect(response.statusCode).toBe(200);
        });
 
        test('El token existe pero es invalido"', async () => {
            const response = await request.get('/login').query({ token: 'desconocido' });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Error del cliente');
        });
    });
});