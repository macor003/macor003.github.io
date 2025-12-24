/**
 * CONTACT FORM MODULE
 *
 * Handles contact form with validation and security
 * - Client-side validation (name, email, message)
 * - Input sanitization (XSS prevention)
 * - EmailJS integration
 * - Cloudflare Turnstile CAPTCHA
 * - Success/error message handling
 * - Bilingual error messages
 *
 * Dependencies: EmailJS, Cloudflare Turnstile, language module
 */

import { getCurrentLang } from './language.js';
import { sanitizeInput } from './utils.js';

// Configuration - REPLACE WITH YOUR ACTUAL KEYS
const EMAILJS_CONFIG = {
    publicKey: 'N9zT8rvp8AMznos6h',
    serviceId: 'service_az1sedf',
    templateId: 'contact_form_template'
};

const TURNSTILE_SITE_KEY = '0x4AAAAAACIzi7aCUJwZA5xm';

// Turnstile widget ID
let turnstileWidgetId = null;

// Form validation patterns
const validationRules = {
    user_name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        errorMessages: {
            es: {
                required: 'Por favor ingresa tu nombre',
                minLength: 'El nombre debe tener al menos 2 caracteres',
                maxLength: 'El nombre no puede exceder 100 caracteres',
                pattern: 'El nombre solo puede contener letras y espacios'
            },
            en: {
                required: 'Please enter your name',
                minLength: 'Name must be at least 2 characters',
                maxLength: 'Name cannot exceed 100 characters',
                pattern: 'Name can only contain letters and spaces'
            }
        }
    },
    user_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessages: {
            es: {
                required: 'Por favor ingresa tu correo electrónico',
                pattern: 'Por favor ingresa un correo electrónico válido'
            },
            en: {
                required: 'Please enter your email address',
                pattern: 'Please enter a valid email address'
            }
        }
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        errorMessages: {
            es: {
                required: 'Por favor escribe un mensaje',
                minLength: 'El mensaje debe tener al menos 10 caracteres',
                maxLength: 'El mensaje no puede exceder 1000 caracteres'
            },
            en: {
                required: 'Please write a message',
                minLength: 'Message must be at least 10 characters',
                maxLength: 'Message cannot exceed 1000 characters'
            }
        }
    }
};

/**
 * Validates a single field
 * @param {string} fieldName - The name of the field to validate
 * @param {string} value - The value to validate
 * @returns {Object} - Validation result {valid: boolean, message: string}
 */
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const lang = getCurrentLang();

    if (!rules) return { valid: true };

    // Required check
    if (rules.required && !value.trim()) {
        return {
            valid: false,
            message: rules.errorMessages[lang].required
        };
    }

    // Min length check
    if (rules.minLength && value.trim().length < rules.minLength) {
        return {
            valid: false,
            message: rules.errorMessages[lang].minLength
        };
    }

    // Max length check
    if (rules.maxLength && value.trim().length > rules.maxLength) {
        return {
            valid: false,
            message: rules.errorMessages[lang].maxLength
        };
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value.trim())) {
        return {
            valid: false,
            message: rules.errorMessages[lang].pattern
        };
    }

    return { valid: true };
}

/**
 * Updates field UI based on validation
 * @param {HTMLElement} field - The field element
 * @param {Object} validation - The validation result
 */
function updateFieldUI(field, validation) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');

    if (validation.valid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    } else {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        if (errorMessage) {
            errorMessage.textContent = validation.message;
        }
    }
}

/**
 * Shows a status message
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;

    formStatus.className = `form-status show ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    formStatus.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

    // Auto-hide after 5 seconds for success, 7 for error
    const timeout = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, timeout);
}

/**
 * Resets the form to its initial state
 */
function resetForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }

    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
    });

    // Reset Turnstile widget
    if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
    }
}

/**
 * Sets the loading state of the submit button
 * @param {boolean} loading - Whether the form is loading
 */
function setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle('loading', loading);
    }
}

/**
 * Initializes EmailJS
 */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey,
        });
        console.log('EmailJS initialized');
    } else {
        console.error('EmailJS not loaded');
    }
}

/**
 * Initializes Cloudflare Turnstile
 */
function initTurnstile() {
    window.addEventListener('load', function() {
        if (typeof turnstile !== 'undefined') {
            const widget = document.getElementById('turnstile-widget');
            if (widget) {
                turnstileWidgetId = turnstile.render('#turnstile-widget', {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: 'light',
                });
                console.log('Turnstile initialized');
            }
        } else {
            console.warn('Turnstile not loaded');
        }
    });
}

/**
 * Initializes form validation
 */
function initFormValidation() {
    // Real-time validation on blur
    ['user_name', 'user_email', 'message'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                const validation = validateField(fieldName, this.value);
                updateFieldUI(this, validation);
            });

            // Clear error on focus
            field.addEventListener('focus', function() {
                const formGroup = this.closest('.form-group');
                formGroup.classList.remove('error');
            });
        }
    });
}

/**
 * Initializes form submission
 */
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        const formData = new FormData(this);
        let isValid = true;
        const validatedData = {};

        for (let [fieldName, value] of formData.entries()) {
            const validation = validateField(fieldName, value);
            const field = document.getElementById(fieldName);

            if (field) {
                updateFieldUI(field, validation);
                if (!validation.valid) {
                    isValid = false;
                } else {
                    validatedData[fieldName] = sanitizeInput(value);
                }
            }
        }

        if (!isValid) {
            showStatus('error',
                getCurrentLang() === 'es'
                    ? 'Por favor corrige los errores en el formulario'
                    : 'Please correct the errors in the form'
            );
            return;
        }

        // Set loading state
        setLoadingState(true);

        try {
            // Get Turnstile token
            let turnstileToken = '';
            if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
                turnstileToken = turnstile.getResponse(turnstileWidgetId);

                if (!turnstileToken) {
                    throw new Error('Please complete the security check');
                }
            }

            // Prepare template parameters
            const templateParams = {
                from_name: validatedData.user_name,
                from_email: validatedData.user_email,
                message: validatedData.message,
                turnstile_token: turnstileToken,
                to_email: 'mcor63@gmail.com'
            };

            // Send email via EmailJS
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.templateId,
                    templateParams
                );

                console.log('Email sent successfully:', response);

                // Show success message
                showStatus('success',
                    getCurrentLang() === 'es'
                        ? '¡Mensaje enviado con éxito! Te responderé pronto.'
                        : 'Message sent successfully! I will reply soon.'
                );

                // Reset form
                resetForm();
            } else {
                throw new Error('EmailJS not loaded');
            }

        } catch (error) {
            console.error('Error sending email:', error);

            // Show error message
            showStatus('error',
                getCurrentLang() === 'es'
                    ? 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente o contáctame directamente por email.'
                    : 'There was an error sending the message. Please try again or contact me directly by email.'
            );
        } finally {
            // Remove loading state
            setLoadingState(false);
        }
    });
}

/**
 * Initializes the contact form module
 */
export function init() {
    console.log('Contact form module initialized');
    initEmailJS();
    initTurnstile();
    initFormValidation();
    initFormSubmission();
}
