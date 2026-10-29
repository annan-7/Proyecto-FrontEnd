// ============================================
// 1. DEFINICIÓN DE INTERFACES
// ============================================

interface IFormData {
    nombre: string;
    email: string;
    mensaje: string;
}

interface IFormErrors {
    nombre?: string;
    email?: string;
    mensaje?: string;
}

// ============================================
// 2. FUNCIÓN DE VALIDACIÓN TIPADA
// ============================================

function validarFormulario(datos: IFormData): IFormErrors {
    const errores: IFormErrors = {};
    const regexEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validación Nombre
    if (!datos.nombre.trim()) {
        errores.nombre = 'El campo nombre es obligatorio.';
    } else if (datos.nombre.trim().length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Validación Email
    if (!datos.email.trim()) {
        errores.email = 'Este campo es obligatorio.';
    } else if (!regexEmail.test(datos.email.trim())) {
        errores.email = 'Ingrese un correo electrónico válido.';
    }

    // Validación Mensaje
    if (!datos.mensaje.trim()) {
        errores.mensaje = 'El mensaje no puede estar vacío.';
    } else if (datos.mensaje.trim().length < 10) {
        errores.mensaje = 'El mensaje debe contener al menos 10 caracteres.';
    }

    return errores;
}

// ============================================
// 3. MANEJO ASÍNCRONO (Simulación de Envío)
// ============================================

function enviarFormulario(datos: IFormData): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (datos.email.includes('error')) {
                reject(new Error('No se pudo enviar el mensaje. Intente de nuevo más tarde.'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

// ============================================
// 4. INTEGRACIÓN Y MANEJO DEL DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contacto-form') as HTMLFormElement | null;
    const statusMessage = document.getElementById('status-message') as HTMLDivElement | null;
    const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (!form || !statusMessage || !submitButton) {
        return;
    }

    const camposMap = [
        {
            key: 'nombre' as keyof IFormData,
            input: document.getElementById('nombre') as HTMLInputElement | null,
            error: document.getElementById('error-nombre') as HTMLSpanElement | null
        },
        {
            key: 'email' as keyof IFormData,
            input: document.getElementById('email') as HTMLInputElement | null,
            error: document.getElementById('error-email') as HTMLSpanElement | null
        },
        {
            key: 'mensaje' as keyof IFormData,
            input: document.getElementById('mensaje') as HTMLTextAreaElement | null,
            error: document.getElementById('error-mensaje') as HTMLSpanElement | null
        }
    ];

    // Limpiar alertas al escribir
    camposMap.forEach(({ input, error }) => {
        input?.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') {
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
                if (error) error.textContent = '';
            }
        });
    });

    // Evento Submit
    form.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        const formData = new FormData(form);
        const datos: IFormData = {
            nombre: (formData.get('nombre') as string) || '',
            email: (formData.get('email') as string) || '',
            mensaje: (formData.get('mensaje') as string) || ''
        };

        const errores: IFormErrors = validarFormulario(datos);
        const tieneErrores = Object.keys(errores).length > 0;

        // Forzamos el tipo explícito en la declaración y en el uso para evitar errores de 'never'
        let primerCampoConError: any = null;

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
            } else if (input && error) {
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

        } catch (error) {
            const mensajeError = error instanceof Error ? error.message : 'Error al procesar el envío.';
            statusMessage.textContent = mensajeError;
            statusMessage.className = 'status-message status-message--error';

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
        }
    });
});