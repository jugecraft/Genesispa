/* =====================================================
   GenesiSpa — form.js
   Contact form: real-time validation + WhatsApp link
   ===================================================== */

(function () {
    'use strict';

    const form = document.getElementById('contactForm');
    const submit = document.getElementById('formSubmit');
    const success = document.getElementById('formSuccess');

    if (!form) return;

    const fields = {
        name: { el: document.getElementById('inputName'), err: document.getElementById('nameError'), min: 2 },
        phone: { el: document.getElementById('inputPhone'), err: document.getElementById('phoneError'), regex: /^\+?[\d\s\-().]{7,20}$/ },
        email: { el: document.getElementById('inputEmail'), err: document.getElementById('emailError'), required: false, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        service: { el: document.getElementById('inputService'), err: document.getElementById('serviceError') },
    };

    /* ── Validators ── */
    function validateName(field) {
        const val = field.el.value.trim();
        if (!val) {
            showError(field, 'Por favor ingresa tu nombre.');
            return false;
        }
        if (val.length < field.min) {
            showError(field, 'El nombre debe tener al menos 2 caracteres.');
            return false;
        }
        clearError(field);
        return true;
    }

    function validatePhone(field) {
        const val = field.el.value.trim();
        if (!val) {
            showError(field, 'Por favor ingresa tu número de WhatsApp.');
            return false;
        }
        if (!field.regex.test(val)) {
            showError(field, 'Número inválido. Ej: +58 412 000 0000');
            return false;
        }
        clearError(field);
        return true;
    }

    function validateEmail(field) {
        const val = field.el.value.trim();
        if (!val) { clearError(field); return true; }   // optional field
        if (!field.regex.test(val)) {
            showError(field, 'Correo electrónico inválido.');
            return false;
        }
        clearError(field);
        return true;
    }

    function validateService(field) {
        if (!field.el.value) {
            showError(field, 'Selecciona un servicio.');
            return false;
        }
        clearError(field);
        return true;
    }

    /* ── Helpers ── */
    function showError(field, msg) {
        field.err.textContent = msg;
        field.el.classList.add('error');
    }

    function clearError(field) {
        field.err.textContent = '';
        field.el.classList.remove('error');
    }

    /* ── Real-time feedback ── */
    fields.name.el.addEventListener('input', () => validateName(fields.name));
    fields.phone.el.addEventListener('input', () => validatePhone(fields.phone));
    fields.email.el.addEventListener('blur', () => validateEmail(fields.email));
    fields.service.el.addEventListener('change', () => validateService(fields.service));

    /* Mark good on valid input */
    [fields.name, fields.phone, fields.email, fields.service].forEach(f => {
        (f.el.tagName === 'SELECT' ? 'change' : 'input').split(',').forEach(ev => {
            f.el.addEventListener(ev, () => {
                if (!f.err.textContent) {
                    f.el.style.borderColor = 'rgba(37,211,102,0.5)';
                } else {
                    f.el.style.borderColor = '';
                }
            });
        });
    });

    /* ── WhatsApp Helpers ── */
    const WA_NUMBER = '584120000000';   // Change to real number

    const SERVICE_LABELS = {
        'corte': 'Corte de cabello',
        'peinado': 'Peinado',
        'coloracion': 'Coloración / Mechas',
        'tratamiento': 'Tratamiento capilar',
        'spa-facial': 'Spa Facial',
        'manicure': 'Manicure / Pedicure',
        'maquillaje': 'Maquillaje',
        'depilacion': 'Depilación',
        'paquete-novia': 'Paquete Novia',
        'otro': 'Otro servicio',
    };

    function buildWhatsAppURL(name, phone, service, message) {
        const svcLabel = SERVICE_LABELS[service] || service;
        let text = `Hola Genesis! Me llamo *${name}*.\n`;
        text += `Mi número es: ${phone}\n`;
        text += `Me interesa el servicio de: *${svcLabel}*`;
        if (message && message.trim()) {
            text += `\n\nMensaje adicional: ${message.trim()}`;
        }
        text += '\n\n¡Quiero agendar una cita en GenesiSpa! 💅✨';
        return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    /* ── Submit ── */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameOk = validateName(fields.name);
        const phoneOk = validatePhone(fields.phone);
        const emailOk = validateEmail(fields.email);
        const serviceOk = validateService(fields.service);

        if (!nameOk || !phoneOk || !emailOk || !serviceOk) {
            // Shake animation on first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(4px)' },
                    { transform: 'translateX(0)' },
                ], { duration: 350, easing: 'ease-in-out' });
            }
            return;
        }

        /* Build message + open WhatsApp */
        const waURL = buildWhatsAppURL(
            fields.name.el.value.trim(),
            fields.phone.el.value.trim(),
            fields.service.el.value,
            document.getElementById('inputMessage').value
        );

        window.open(waURL, '_blank', 'noopener,noreferrer');

        /* Success state */
        submit.disabled = true;
        if (success) {
            success.removeAttribute('hidden');
            success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        /* Reset after 5s */
        setTimeout(() => {
            form.reset();
            submit.disabled = false;
            if (success) success.setAttribute('hidden', '');
            // Reset border colors
            [fields.name, fields.phone, fields.email, fields.service].forEach(f => {
                f.el.style.borderColor = '';
            });
        }, 5000);
    });

    /* ── Dynamic WhatsApp button ── */
    const waBtn = document.getElementById('whatsappBtn');
    if (waBtn) {
        waBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(
                `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola Genesis! Quiero agendar una cita en GenesiSpa 💅✨')}`,
                '_blank',
                'noopener,noreferrer'
            );
        });
    }

})();
