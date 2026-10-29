"use strict";
// ============================================
// 1. DEFINICIÓN DE INTERFACES
// ============================================
// ============================================
// 2. FUNCIÓN DE VALIDACIÓN TIPADA
// ============================================
function validarFormulario(datos) {
    const errores = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validación Nombre
    if (!datos.nombre.trim()) {
        errores.nombre = 'El campo nombre es obligatorio.';
    }
    else if (datos.nombre.trim().length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    // Validación Email
    if (!datos.email.trim()) {
        errores.email = 'Este campo es obligatorio.';
    }
    else if (!regexEmail.test(datos.email.trim())) {
        errores.email = 'Ingrese un correo electrónico válido.';
    }
    // Validación Mensaje
    if (!datos.mensaje.trim()) {
        errores.mensaje = 'El mensaje no puede estar vacío.';
    }
    else if (datos.mensaje.trim().length < 10) {
        errores.mensaje = 'El mensaje debe contener al menos 10 caracteres.';
    }
    return errores;
}
// ============================================
// 3. MANEJO ASÍNCRONO (Simulación de Envío)
// ============================================
function enviarFormulario(datos) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (datos.email.includes('error')) {
                reject(new Error('No se pudo enviar el mensaje. Intente de nuevo más tarde.'));
            }
            else {
                resolve();
            }
        }, 1500);
    });
}
// ============================================
// 4. INTEGRACIÓN Y MANEJO DEL DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contacto-form');
    const statusMessage = document.getElementById('status-message');
    const submitButton = form?.querySelector('button[type="submit"]');
    if (!form || !statusMessage || !submitButton) {
        return;
    }
    const camposMap = [
        {
            key: 'nombre',
            input: document.getElementById('nombre'),
            error: document.getElementById('error-nombre')
        },
        {
            key: 'email',
            input: document.getElementById('email'),
            error: document.getElementById('error-email')
        },
        {
            key: 'mensaje',
            input: document.getElementById('mensaje'),
            error: document.getElementById('error-mensaje')
        }
    ];
    // Limpiar alertas al escribir
    camposMap.forEach(({ input, error }) => {
        input?.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') {
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
                if (error)
                    error.textContent = '';
            }
        });
    });
    // Evento Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
        const formData = new FormData(form);
        const datos = {
            nombre: formData.get('nombre') || '',
            email: formData.get('email') || '',
            mensaje: formData.get('mensaje') || ''
        };
        const errores = validarFormulario(datos);
        const tieneErrores = Object.keys(errores).length > 0;
        // Forzamos el tipo explícito en la declaración y en el uso para evitar errores de 'never'
        let primerCampoConError = null;
        camposMap.forEach(({ key, input, error }) => {
            const mensajeError = errores[key];
            if (mensajeError && input && error) {
                input.setAttribute('aria-invalid', 'true');
                const idError = `error-${key}`;
                input.setAttribute('aria-describedby', idError);
                error.textContent = mensajeError;
                if (!primerCampoConError) {
                    primerCampoConError = input;
                }
            }
            else if (input && error) {
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
                error.textContent = '';
            }
        });
        if (tieneErrores) {
            if (primerCampoConError && typeof primerCampoConError.focus === 'function') {
                primerCampoConError.focus();
            }
            statusMessage.textContent = 'Corriga su formulario.';
            statusMessage.classList.add('status-message--error');
            return;
        }
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            statusMessage.textContent = 'Procesando mensaje...';
            statusMessage.className = 'status-message status-message--info';
            await enviarFormulario(datos);
            console.log('Datos guardados en la variable:', datos);
            console.log('Nombre enviado:', datos.nombre);
            console.log('Email enviado:', datos.email);
            statusMessage.textContent = '¡Gracias por confiar en nosotros!';
            statusMessage.className = 'status-message status-message--exito';
            form.reset();
        }
        catch (error) {
            const mensajeError = error instanceof Error ? error.message : 'Error al procesar el envío.';
            statusMessage.textContent = mensajeError;
            statusMessage.className = 'status-message status-message--error';
        }
        finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        }
    });
});
