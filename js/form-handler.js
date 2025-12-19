/* ============================================
   GROW GENIX - Form Handler
   Contact form with validation & submission
   ============================================ */

// Configuration
const FORM_CONFIG = {
    web3formsKey: 'e9ba6bf7-287b-486e-b12d-95197eba50dd', // Web3Forms API Key
    emailSubject: 'New Inquiry - Grow Genix',
    successRedirectDelay: 8000  // 8 seconds - enough time to see success animation
};

/* ==================== Modal Functions ==================== */
let phoneInputInstance = null;

function openModal() {
    const modal = document.getElementById('booking-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) return;

    // Clean up closing class if animation was interrupted
    modalContent.classList.remove('closing');

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('active');
    
    // Animate in backdrop
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Initialize phone input if not already done
    initPhoneInput();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('booking-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) return;

    // Animate out with CSS classes
    modal.style.opacity = '0';
    modalContent.classList.add('closing');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
        modalContent.classList.remove('closing'); // Clean up
        
        // Reset form state
        resetFormState();
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }, 300); // Should match the duration of modal-close-shrink animation
}

function resetFormState() {
    const form = document.getElementById('contact-form');
    const formSection = document.getElementById('modal-form');
    const successSection = document.getElementById('modal-success');
    
    if (form) form.reset();
    if (formSection) formSection.style.display = 'block';
    if (successSection) successSection.style.display = 'none';
    
    // Reset phone input
    if (phoneInputInstance) {
        phoneInputInstance.setNumber('');
        phoneInputInstance.setCountry('in');  // Reset to India
    }
    
    // Reset pricing form dropdowns if they exist
    const paymentTypeSelect = document.getElementById('payment-type');
    const serviceSelectionSelect = document.getElementById('service-selection');
    if (paymentTypeSelect && serviceSelectionSelect) {
        paymentTypeSelect.value = '';
        serviceSelectionSelect.innerHTML = '<option value="" disabled selected>First select payment type</option>';
        serviceSelectionSelect.disabled = true;
    }

    // Reset submit button
    resetSubmitButton();
}

/* ==================== Phone Input (Intl-Tel-Input) ==================== */
function initPhoneInput() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput || phoneInputInstance) return;

    // Check if intlTelInput is loaded
    if (typeof intlTelInput === 'undefined') {
        console.warn('intl-tel-input not loaded');
        return;
    }

    phoneInputInstance = intlTelInput(phoneInput, {
        initialCountry: 'in',
        preferredCountries: ['in', 'us', 'gb', 'ae'],
        separateDialCode: true,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
        autoPlaceholder: 'aggressive',
        formatOnDisplay: true
    });

    // Add validation listeners
    phoneInput.addEventListener('input', validatePhoneNumber);
    phoneInput.addEventListener('blur', validatePhoneNumber);
    phoneInput.addEventListener('countrychange', validatePhoneNumber);
}

function validatePhoneNumber() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    
    if (!phoneInput || !phoneInputInstance) return false;

    const phoneValue = phoneInput.value.replace(/\s+/g, '').replace(/-/g, '');
    const hasValue = phoneValue.length > 0;
    
    // Wait a moment for utils to load, then validate
    let isValid = false;
    
    // Check if utils is loaded (isValidNumber works properly only when utils is loaded)
    if (phoneInputInstance.isValidNumber) {
        isValid = phoneInputInstance.isValidNumber();
    }
    
    // If no value entered yet, don't show error
    if (!hasValue) {
        if (phoneError) phoneError.style.display = 'none';
        disableSubmitButton();
        return false;
    }

    if (isValid) {
        // Valid number
        if (phoneError) {
            phoneError.style.display = 'none';
        }
        enableSubmitButton();
        return true;
    } else {
        // Invalid number - show error
        if (phoneError) {
            phoneError.style.display = 'flex';
        }
        disableSubmitButton();
        return false;
    }
}

/* ==================== Submit Button State ==================== */
function enableSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;

    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-disabled');
    submitBtn.classList.add('btn-primary');
}

function disableSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('btn-disabled');
    submitBtn.classList.remove('btn-primary');
}

function resetSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;

    submitBtn.innerHTML = 'Confirm Booking';
    const form = document.getElementById('contact-form');
    if (form && form.parentElement.id === 'modal-form' && form.parentElement.parentElement.parentElement.id === 'booking-modal') {
        const h2 = form.parentElement.querySelector('h2');
        if(h2 && h2.textContent === "Let's Talk Growth") {
            submitBtn.innerHTML = 'Send Request';
        }
    }


    submitBtn.disabled = true;
    submitBtn.classList.add('btn-disabled');
    submitBtn.classList.remove('btn-primary');
}

/* ==================== Form Submission ==================== */
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    
    // Validate phone one more time
    if (phoneInputInstance && !phoneInputInstance.isValidNumber()) {
        const phoneError = document.getElementById('phone-error');
        if (phoneError) {
            phoneError.classList.remove('hidden');
            phoneError.classList.add('flex');
        }
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;

    try {
        // Prepare form data
        const formData = new FormData(form);
        
        // Get full phone number with country code
        if (phoneInputInstance) {
            formData.set('phone', phoneInputInstance.getNumber());
        }

        // Convert to JSON
        const data = Object.fromEntries(formData);
        
        // Send to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success!
            showSuccessState();
            
            // Auto close modal after delay
            setTimeout(closeModal, FORM_CONFIG.successRedirectDelay);
        } else {
            // Error from API
            throw new Error(result.message || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Something went wrong! Please try again.');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showSuccessState() {
    const formSection = document.getElementById('modal-form');
    const successSection = document.getElementById('modal-success');
    
    if (formSection) formSection.style.display = 'none';
    if (successSection) {
        successSection.style.display = 'flex';
    }
}

/* ==================== Close Modal on Outside Click ==================== */
document.addEventListener('click', (event) => {
    const modal = document.getElementById('booking-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) return;
    
    // Check if click is on backdrop (not content)
    if (event.target === modal || event.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

/* ==================== Close Modal on Escape Key ==================== */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

/* ==================== Inline Contact Form (for contact.html) ==================== */
let inlinePhoneInputInstance = null;
let isEmailValid = false;
let isPhoneValid = false;

// Email validation regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function initInlineEmailValidation() {
    const emailInput = document.getElementById('inline-email');
    if (!emailInput) return;

    emailInput.addEventListener('input', validateInlineEmail);
    emailInput.addEventListener('blur', validateInlineEmail);
}

function validateInlineEmail() {
    const emailInput = document.getElementById('inline-email');
    const emailError = document.getElementById('inline-email-error');
    
    if (!emailInput) return false;

    const email = emailInput.value.trim();
    const hasValue = email !== '';
    isEmailValid = emailRegex.test(email);

    if (isEmailValid) {
        if (emailError) {
            emailError.style.display = 'none';
        }
        updateInlineSubmitButton();
        return true;
    } else {
        if (hasValue && emailError) {
            emailError.style.display = 'flex';
        } else if (emailError) {
            emailError.style.display = 'none';
        }
        updateInlineSubmitButton();
        return false;
    }
}

function initInlinePhoneInput() {
    const phoneInput = document.getElementById('inline-phone');
    if (!phoneInput || inlinePhoneInputInstance) return;

    if (typeof intlTelInput === 'undefined') {
        console.warn('intl-tel-input not loaded');
        return;
    }

    inlinePhoneInputInstance = intlTelInput(phoneInput, {
        initialCountry: 'in',
        separateDialCode: true,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
        autoPlaceholder: 'aggressive'
    });

    // Add validation listeners
    phoneInput.addEventListener('input', validateInlinePhoneNumber);
    phoneInput.addEventListener('blur', validateInlinePhoneNumber);
    phoneInput.addEventListener('countrychange', validateInlinePhoneNumber);
}

function validateInlinePhoneNumber() {
    const phoneInput = document.getElementById('inline-phone');
    const phoneError = document.getElementById('inline-phone-error');
    
    if (!phoneInput || !inlinePhoneInputInstance) return false;

    isPhoneValid = inlinePhoneInputInstance.isValidNumber();
    const hasValue = phoneInput.value.trim() !== '';

    if (isPhoneValid) {
        if (phoneError) {
            phoneError.style.display = 'none';
        }
        updateInlineSubmitButton();
        return true;
    } else {
        if (hasValue && phoneError) {
            phoneError.style.display = 'flex';
        } else if (phoneError) {
            phoneError.style.display = 'none';
        }
        updateInlineSubmitButton();
        return false;
    }
}

function updateInlineSubmitButton() {
    const submitBtn = document.getElementById('inline-submit-btn');
    if (!submitBtn) return;

    if (isEmailValid && isPhoneValid) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
        submitBtn.classList.add('btn-primary');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');
        submitBtn.classList.remove('btn-primary');
    }
}

async function handleInlineFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('inline-submit-btn');
    const successMessage = document.getElementById('form-success');
    
    // Validate email before submission
    if (!isEmailValid) {
        const emailError = document.getElementById('inline-email-error');
        if (emailError) {
            emailError.style.display = 'flex';
        }
        return;
    }
    
    // Validate phone before submission
    if (inlinePhoneInputInstance && !inlinePhoneInputInstance.isValidNumber()) {
        const phoneError = document.getElementById('inline-phone-error');
        if (phoneError) {
            phoneError.style.display = 'flex';
        }
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        
        // Get full phone number with country code
        if (inlinePhoneInputInstance) {
            formData.set('phone', inlinePhoneInputInstance.getNumber());
        }
        
        const data = Object.fromEntries(formData);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Hide form, show success message
            form.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'flex';
            }
            
            // Refresh icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Reset after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
                // Reset phone input
                if (inlinePhoneInputInstance) {
                    inlinePhoneInputInstance.setNumber('');
                }
                // Reset validation states
                isEmailValid = false;
                isPhoneValid = false;
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = true;
                submitBtn.classList.add('btn-disabled');
                submitBtn.classList.remove('btn-primary');
            }, 5000);
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Something went wrong! Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/* ==================== Pricing Page Modal Logic ==================== */
function initPricingFormLogic() {
    const paymentTypeSelect = document.getElementById('payment-type');
    const serviceSelectionSelect = document.getElementById('service-selection');

    // Exit if the elements aren't on this page
    if (!paymentTypeSelect || !serviceSelectionSelect) {
        return;
    }

    const serviceOptions = {
        monthly: {
            '': 'Select a monthly plan...',
            'performance-growth': 'Performance Growth ($997/mo)',
            'social-domination-stack': 'Social Domination Stack ($1,497/mo)',
            'organic-visibility': 'Organic Visibility ($750/mo)'
        },
        'one-time': {
            '': 'Select a one-time setup...',
            'ai-receptionist': 'The 24/7 AI Receptionist ($497)',
            'tech-foundation-kit': 'Technical Foundation Kit ($497)',
            'ai-autopilot-ecosystem': 'The AI Autopilot Ecosystem ($1,997)'
        }
    };

    paymentTypeSelect.addEventListener('change', () => {
        const selectedType = paymentTypeSelect.value;
        
        // Clear previous options
        serviceSelectionSelect.innerHTML = ''; 

        if (selectedType && serviceOptions[selectedType]) {
            // Enable and populate the second dropdown
            serviceSelectionSelect.disabled = false;
            
            const options = serviceOptions[selectedType];
            for (const value in options) {
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.textContent = options[value];
                if (value === '') {
                    optionElement.disabled = true;
                    optionElement.selected = true;
                }
                serviceSelectionSelect.appendChild(optionElement);
            }
        } else {
            // Disable and reset if no valid type is selected
            serviceSelectionSelect.disabled = true;
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'First select payment type';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.value = '';
            serviceSelectionSelect.appendChild(defaultOption);
        }
    });
}

/* ==================== Initializers ==================== */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('inline-phone')) {
        initInlinePhoneInput();
    }
    if (document.getElementById('inline-email')) {
        initInlineEmailValidation();
    }
    initPricingFormLogic();
});


/* ==================== CSS for Loading Spinner ==================== */
// This will be added inline via JavaScript
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
    }
    
    .btn-disabled {
        background: #374151 !important;
        color: #9ca3af !important;
        cursor: not-allowed !important;
        opacity: 0.5;
    }
    
    .btn-disabled:hover {
        transform: none !important;
        box-shadow: none !important;
    }
`;
document.head.appendChild(spinnerStyles);