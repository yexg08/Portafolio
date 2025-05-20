# Guía para configurar EmailJS en el portafolio

Esta guía te ayudará a configurar EmailJS para poder recibir los mensajes del formulario de contacto directamente en tu correo personal.

## Paso 1: Crear una cuenta en EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/) y regístrate para obtener una cuenta gratuita
2. El plan gratuito te permite enviar hasta 200 correos por mes, lo cual es suficiente para la mayoría de portafolios personales

## Paso 2: Configurar un servicio de correo electrónico

1. Inicia sesión en tu cuenta de EmailJS
2. Ve a "Email Services" y haz clic en "Add New Service"
3. Puedes elegir entre varios proveedores como Gmail, Outlook, etc.
4. Sigue las instrucciones para conectar tu cuenta de correo (por ejemplo, si usas Gmail, necesitarás autenticarte)
5. Una vez configurado, anota el Service ID (lo necesitarás más adelante)

## Paso 3: Crear una plantilla de correo electrónico

1. En el panel de EmailJS, ve a "Email Templates" y haz clic en "Create New Template"
2. Configura la plantilla con campos que coincidan con los del formulario de contacto:
   - En el campo "To email" usa la variable {{to_email}}
   - En el campo "From name" usa la variable {{from_name}}
   - En el asunto usa "Mensaje de Portafolio: {{subject}}"
   - En el cuerpo del mensaje, incluye:
     ```
     Nombre: {{user_name}}
     Email: {{user_email}}
     Asunto: {{subject}}
     
     Mensaje:
     {{message}}
     ```
3. Guarda la plantilla y anota el Template ID

## Paso 4: Obtener tu Public Key

1. En el panel de EmailJS, ve a "Account" > "API Keys"
2. Copia tu Public Key

## Paso 5: Actualizar el código del portafolio

1. Abre el archivo `js/main.js` y busca las siguientes líneas:
   ```javascript
   // Inicializar EmailJS
   (function() {
       // Reemplaza 'YOUR_PUBLIC_KEY' con tu clave pública de EmailJS
       emailjs.init('YOUR_PUBLIC_KEY');
   })();
   ```

2. Reemplaza 'YOUR_PUBLIC_KEY' con la clave que copiaste en el paso anterior

3. Busca estas líneas más abajo en el código:
   ```javascript
   // Enviar correo usando EmailJS
   // Reemplaza 'YOUR_SERVICE_ID' y 'YOUR_TEMPLATE_ID' con los IDs correspondientes de tu cuenta EmailJS
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
   ```

4. Reemplaza:
   - 'YOUR_SERVICE_ID' con el ID del servicio que configuraste
   - 'YOUR_TEMPLATE_ID' con el ID de la plantilla que creaste

## Paso 6: Probar el formulario

1. Abre la página en un navegador
2. Completa el formulario de contacto y envíalo
3. Deberías recibir un correo electrónico en la dirección que configuraste

## Solución de problemas

- Si no recibes correos, verifica la pestaña "Spam" o "Correo no deseado"
- Puedes revisar la consola del navegador (F12) para ver si hay errores
- Verifica que los IDs de servicio y plantilla sean correctos
- Asegúrate de que la cuenta de EmailJS esté activa

## Notas adicionales

- EmailJS ofrece un panel donde puedes ver el historial de los correos enviados
- Puedes personalizar más la plantilla con HTML para que los correos se vean mejor
- Si superas el límite de correos gratuitos, considera actualizar a un plan de pago

## Recursos

- [Documentación oficial de EmailJS](https://www.emailjs.com/docs/)
- [Ejemplos de integración](https://www.emailjs.com/docs/examples/) 