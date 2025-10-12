Instalaci�n del API:
--------------------
1) Descomprimir el archivo "API v1.0.1 Installer.zip" en alg�n directorio temporal.
2) Descargar de https://nodejs.org/en/ la versi�n LTS (long-term support) 22.20.0 de Node.js correspondiente a la plataforma.
3) Crear un nuevo directorio donde quedar� instalada el API una vez finalizado este instructivo.
4) Copiar el contenido del directorio temporal del paso 1 al directorio creado en el paso 3.
5) Utilizando la consola de l�nea de comandos o una terminal, posicionarse en el directorio creado en el paso 3, escribir "npm install" (sin las comillas) y presionar la tecla Enter.
NOTA: Ignorar las advertencias que se pudieran mostrar en relaci�n a m�dulos que puedan estar deprecados.

Iniciar el API:
---------------
Utilizando la consola de l�nea de comandos o una terminal, posicionarse en el directorio de instalaci�n, escribir "npm run api" (sin las comillas) y presionar la tecla Enter.

Detener el API:
---------------
Presionar Ctrl+C la consola de l�nea de comandos o terminal donde se est� ejecutando el API (o cerrar la misma)

Acceder a la documentaci�n del API:
-----------------------------------
Utilizando un navegador Web, acceder a la URL "http://localhost:8080/docs"

Modificar la configuraci�n la direcci�n IP y/o del API:
-------------------------------------------------------
En caso de que estuviera ejecutando, detener el API.
Utilizando un editor de texto abrir el archivo .env que se encuentra en el directorio de instalaci�n del API y luego agregar el par�metro PORT indicando el valor de puerto necesario.
Utilizando un editor de texto abrir el archivo swagger.json que se encuentra en el directorio docs y luego modificar el atributo "url" indicando el valor de puerto necesario.

Modificar la configuraci�n del servidor de correo electr�nico:
--------------------------------------------------------------
En caso de que estuviera ejecutando, detener el API.
Utilizando un editor de texto abrir el archivo .env que se encuentra en el directorio de instalaci�n del API y luego modificar los siguientes par�metros seg�n sea necesario:
 # SMTP_HOST: dominio o direcci�n IP del servidor de correo electr�nico
 # SMTP_PORT: puerto del servidor de correo electr�nico
 # SMTP_SECURE: indicador de uso de conexi�n segura
 # SMTP_USER: nombre de usuario de la cuenta de correo electr�nico
 # SMTP_PASS: contrase�a de la cuenta de correo electr�nico
El API se encuentra preconfigurada para usar el servicio de Ethereal Mail. Este es un servicio de SMTP simulado en el cual los correos enviados a trav�s del mismo no son entregados al destinatario. Para acceder a los mismos es necesario ingresar a la p�gina de Ethereal Mail (https://ethereal.email/), iniciar sesi�n con las credenciales configuradas en el archivo .env y luego acceder a la opci�n "Messages" que se encuentra en la barra superior.
IMPORTANTE: Con el fin de evitar que los correos puedan ser visualizados por otros grupos, recomendamos crear una cuenta nueva en la p�gina de Ethereal Mail y modificar los par�metros correspondientes en el archivo .env.

Modificar el asunto y template enviado en los correos electr�nicos:
-------------------------------------------------------------------
En caso de que estuviera ejecutando, detener el API.
Utilizando un editor de texto abrir el archivo .env que se encuentra en el directorio de instalaci�n del API y luego modificar los siguientes par�metros seg�n sea necesario:
 # REGISTRATION_SUBJECT: asunto del correo electr�nico enviando para verificar la direcci�n de email luego la registraci�n
 # RESET_PASSWORD_SUBJECT asunto del correo enviado para permitir el reseteo de la contrase�a
 # PANTRY_SHARED_SUBJECT asunto del correo enviado cuando se comparte una despensa
 # LIST_SHARED_SUBJECT asunto del correo enviado cuando se comparte una lista de compras
Utilizando un editor de texto abrir los archivos que se encuentran en el directorio templates de instalaci�n del API y luego modificar su contenido seg�n sea necesario:
 # registration.mft: template del correo electr�nico enviando para verificar la direcci�n de email luego la registraci�n
 # reset-password.mft: template del correo enviado para permitir el reseteo de la contrase�a
Estos archivos pueden contener las siguientes variables de reemplazo:
 # <%FIRST_NAME%>: nombre del usuario
 # <%VERIFICATION_CODE%>: c�digo de verificaci�n
 # <%EXPIRATION_DATE%>: fecha de expiraci�n del c�digo de verificaci�n
 # <%RECIPIENT_NAME%>: nombre del usuario al que se le comparte la despensa o lista de compras
 # <%PANTRY_NAME%>: nombre de la despensa compartida
 # <%LIST_NAME%>: nombre de la lista de compras compartida
 # <%OWNER_NAME%>: nombre del usuario due�o de la despensa o lista de compras
