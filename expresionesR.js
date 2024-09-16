const texto = "HMHA";
const pattern = /[a-z]/;

if (pattern.test(texto)) {
    console.log("El texto contiene al menos una letra minúscula.");
} else {
    console.log("El texto no contiene letras minúsculas.");
}