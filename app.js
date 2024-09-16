import express from 'express';

const app = express();
app.use(express.json())

//Funcion para validar clave
const validarFormulario = (usuario, clave, req) => {
    const sqlInjectionPattern = /('|"|;|--|\b(SELECT|INSERT|DELETE|DROP|UPDATE|CREATE|ALTER|EXEC)\b)/i;
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const commonPasswords = ["123456", "password", "qwerty", "admin"];
    const xssPattern = /(<([^>]+)>)/ig;

    // 1. Verificar si usuario o clave son vacíos
    if (!usuario || !clave) {
        return { status: 400, message: "Usuario y clave son necesarios" };
    }

    // 2. Verificar si el usuario contiene SQL injection o XSS
    if (sqlInjectionPattern.test(usuario) || xssPattern.test(usuario)) {
        return { status: 403, message: "El nombre de usuario contiene caracteres peligrosos" };
    }

    // 3. Verificar formato de correo electrónico si es necesario
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(usuario)) {
        return { status: 400, message: "Formato de correo electrónico inválido" };
    }

    // 4. Verificar si la clave es común
    if (commonPasswords.includes(clave)) {
        return { status: 400, message: "La clave es demasiado común" };
    }

    // 5. Verificar si la clave es segura
    if (!strongPasswordPattern.test(clave)) {
        return { status: 400, message: "La clave debe tener letras mayúsculas, minúsculas, números y símbolos" };
    }

    // 6. Verificar si la clave contiene SQL injection o XSS
    if (sqlInjectionPattern.test(clave) || xssPattern.test(clave)) {
        return { status: 403, message: "La clave contiene caracteres peligrosos" };
    }

    // 7. Verificar número de intentos fallidos o IP bloqueada (opcional)
    const blockedIPs = ["192.168.1.100", "10.0.0.1"];
    const ipCliente = req.ip;

    if (blockedIPs.includes(ipCliente)) {
        return { status: 403, message: "Acceso denegado desde esta dirección IP" };
    }

    // 8. Si todo está bien, permitir el acceso
    return { status: 200, message: "Ingreso al sistema" };
};


// Función para verificar el token
const verificarToken = (token) => {
    if (!token) {
        //Logica de programacion
        return { status: 400, message: "Token no proporcionado" };
    }
    if (token === "valido") {
        //Logica de programacion
        return { status: 200, message: "Token válido" };
    }
    if (token === "invalido") {
        //Logica de programacion
        return { status: 401, message: "Token inválido" };
    }
    return { status: 404, message: "Error del cliente" };
};


app.get('/login', (req, res) => {
    // token de acceso
    const { token } = req.query;


    const { status, message } = verificarToken(token);
    res.status(status).send({ message });
});




app.post('/login', (req, res) => {
    const { usuario, clave } = req.body;


    const { status, message } = validarClave(usuario, clave, req);
    res.status(status).send({ message });

});



export default app;