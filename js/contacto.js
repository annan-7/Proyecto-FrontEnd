document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contacto-form');
    const statusMessage = document.getElementById('status-message');
    const campos = [
        {
            input: document.getElementById('nombre'),
            error: document.getElementById('error-nombre'),
            validar: (valor) => {
                if (valor.trim() === '') {
                    return 'El campo nombre es obligatorio.';
                }
                if (valor.trim().length < 2) {
                    return 'El nombre debe tener al menos 2 caracteres.';
                }
                return '';
            }
        },
        {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            validar: (valor) => {
                if (valor.trim() === '') {
                    return 'Este campo es obligatorio.';
                }
                const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regexEmail.test(valor.trim())) {
                    return 'Por favor, ingresa un correo electrónico válido.';
                }
                return '';
            }
        },
        {
            input: document.getElementById('mensaje'),
            error: document.getElementById('error-mensaje'),
            validar: (valor) => {
                if (valor.trim() === '') {
                    return 'El mensaje no puede estar vacío.';
                }
                if (valor.trim().length < 10) {
                    return 'El mensaje debe contener al menos 10 caracteres.';
                }
                return '';
            }
        }
    ];

    campos.forEach(({ input, error }) => {
        input.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') {
                input.removeAttribute('aria-invalid');
                error.textContent = '';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        let esValido = true;
        let primerCampoConError = null;

        campos.forEach(({ input, error, validar }) => {
            const mensajeError = validar(input.value);

            if (mensajeError) {
                esValido = false;
                input.setAttribute('aria-invalid', 'true');
                error.textContent = mensajeError;

                if (!primerCampoConError) {
                    primerCampoConError = input;
                }
            } else {
                input.removeAttribute('aria-invalid');
                error.textContent = '';
            }
        });

        if (!esValido) {
            if (primerCampoConError) {
                primerCampoConError.focus();
            }
            statusMessage.textContent = 'El formulario contiene errores.';
            statusMessage.classList.add('status-message--error');
        } else {
            const formData = new FormData(form);
            const datosContacto = Object.fromEntries(formData.entries());

            console.log('Datos guardados en la variable:', datosContacto);
            console.log('Nombre enviado:', datosContacto.nombre);
            console.log('Email enviado:', datosContacto.email);

            statusMessage.textContent = '¡Gracias por contactarnos!';
            statusMessage.classList.add('status-message--exito');

            form.reset();
        }
    });
});