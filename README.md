# Delilah-Resto
Proyecto "Delilah Restó" del curso Desarrollo Web Fullstack de Acámica

## Documentacion
Importar en el archivo 'api-doc.yaml' en [Swagger](https://editor.swagger.io)
Asi podras ver los endpoins y metodos disponibles

## Instalacion

### Clonar proyecto

-Clonar el reporsitorio desde [este link](https://github.com/Federico-Barrientos/Delilah-Resto)

### Intalar depencias

```
npm install
```

### Crear Base de datos

- Abrir XAMPP e inicializar los servidores Apache y MySQL (asegurarse que el puerto de MySQL sea el 3306)
- Ingrear al panel de control de MySQl (http://localhost/phpmyadmin)
- En la solapa SQL ejecutar el contenido del archivo (database/queries.sql)
- El usuario es 'root' y no hay contraseña, de ser necesario se puede editar en (database/db_connection.js)

### Iniciar el servidor

Abrir el archivo (server/server.js) desde node

`node server`

### Todo listo para usar la API

Para probar los endpoints se puede utilizar el siguiente archivo (Delilah-Resto.postman_collection) en Postman
