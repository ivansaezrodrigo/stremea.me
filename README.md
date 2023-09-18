
# StremeaMe 
![Banner Stremea.me](https://i.ibb.co/f8xZ2Yb/poster.png)

A continuación, se describen los pasos para ejecutar el proyecto de **Iván Sáez Rodrigo** hecho en _Node.js_ en el equipo. Se incluyen las instrucciones de migraciones de bases de datos utilizando _Sequelize_.

## Paso 1: Preparación del entorno

1.  Crea una nueva carpeta en tu escritorio o en cualquier ubicación deseada.
2.  Copia el contenido de la carpeta "**Node**" desde el USB a la carpeta recién creada.

## Paso 2: Instalación de Node.js

1.  Abre el navegador web y ve al sitio oficial de Node.js: [https://nodejs.org](https://nodejs.org).
2.  Descarga la versión recomendada para tu sistema operativo _(el desarrollo y testeo se realizó con la versión v16.15.1)_.
3.  Sigue las instrucciones de instalación proporcionadas por el instalador de Node.js y completa el proceso de instalación.

## Paso 3: Configuración de la Base de Datos con Sequelize

1.  Abre el terminal de tu sistema operativo.
2.  Navega hasta la carpeta donde copiaste los archivos de la aplicación.
3.  Ejecuta el siguiente comando para instalar las dependencias de la aplicación:
`> npm install`

4.  Ejecuta el siguiente comando para migrar la base de datos utilizando Sequelize:
`> npx sequelize-cli db:migrate`
Esto configurará la base de datos de acuerdo con las migraciones definidas en la aplicación.

## Paso 4: Ejecución del servidor Node.js

1.  En la ventana de línea de comandos o terminal, asegúrate de estar en la carpeta de la aplicación.
2.  Ejecuta el siguiente comando para iniciar el servidor:
`> node app.js`
_***Esto pondrá en marcha el servidor Node.js y comenzará a escuchar en el puerto 3000.**_

3.  Navega hasta localhost.
> http://localhost:3000

## Paso 5: Disfruta!
¡Bienvenido al proyecto! Navega, retransmite y disfruta :)
