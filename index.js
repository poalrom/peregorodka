/** TOOLTIPS */

const tooltip = document.querySelector('.tooltip');
const tooltipContent = tooltip.querySelector('.tooltip__content');
let tooltipInstance;
const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

function destroy() {
    if (tooltipInstance) {
        tooltipInstance.destroy();
        tooltipInstance = null;
    }
}

function create(el) {
    tooltipContent.innerHTML = el.dataset.tooltip;
    popperInstance = Popper.createPopper(el, tooltip, {
        placement: 'top',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 8],
            },
        }, ],
    });
}

function show(e) {
    tooltip.setAttribute('data-show', '');
    create(e.target);
}

function hide() {
    tooltip.removeAttribute('data-show');
    destroy();
}

function initTooltip(el) {
    const tooltipText = el.dataset.tooltip;
    if (!tooltipText) {
        return;
    }
    destroy();
    showEvents.forEach(event => {
        el.addEventListener(event, show);
    });

    hideEvents.forEach(event => {
        el.addEventListener(event, hide);
    });
}

document.querySelectorAll('[data-tooltip]').forEach(initTooltip);

/** MOBILE MENU */

const mobileMenuPopup = document.querySelector('.menu-popup');
const mobileMenuButtons = document.querySelectorAll('.menu-toggler')
    .forEach((button) => {
        button.addEventListener('click', () => mobileMenuPopup.classList.toggle('menu-popup_hidden'))
    });

/** ORDER POPUP */

const orderPopup = document.querySelector('.order-popup');
const orderButtons = document.querySelectorAll('.order-toggler')
    .forEach((button) => {
        button.addEventListener('click', () => orderPopup.classList.toggle('popup_hidden'))
    });

/** CONSTRUCTOR */
const construct = document.querySelector('.calc');
const constructTitle = construct.querySelector('.calc__title');

function handleInputClick(input) {
    const step = input.closest('.calc__items');
    if (!step) {
        return;
    }
    step.classList.add('calc__items_selected')
    step.querySelectorAll('.calc__item_active').forEach(i => i.classList.remove('calc__item_active'));
    const containter = input.closest('.calc__item');
    if (!containter) {
        return;
    }
    containter.classList.add('calc__item_active');
}

function goToStep(currentStep, nextStepIndex) {
    const nextStepClass = '.calc__step_' + nextStepIndex;
    const nextStep = construct.querySelector(nextStepClass);
    if (!nextStep) {
        console.warn('Next step not found');
        return;
    }
    if (nextStepIndex === '6') {
        constructTitle.textContent = 'Поздравляем!';
    }
    currentStep.classList.remove('calc__step_active');
    nextStep.classList.add('calc__step_active');
}

function handleNextClick(button) {
    const step = button.closest('.calc__step');
    if (!step) {
        console.warn('Current step not found');
        return;
    }
    let nextStepIndex = button.dataset.next;
    if (!nextStepIndex) {
        const selectedItem = step.querySelector('.calc__item_active');
        if (!selectedItem || !selectedItem.dataset.next) {
            console.warn('Item not selected');
            return;
        }
        nextStepIndex = selectedItem.dataset.next;
    }
    goToStep(step, nextStepIndex);
}

function skipStep(button) {
    const step = button.closest('.calc__step');
    if (!step) {
        console.warn('Current step not found');
        return;
    }
    const nextStepIndex = button.dataset.next;
    if (!nextStepIndex) {
        console.warn('Item not selected');
        return;
    }
    const inputs = step.querySelectorAll('input[type=checkbox]');
    inputs.forEach(i => i.checked = false);
    goToStep(step, nextStepIndex);
}

construct.addEventListener('click', (e) => {
    if (e.target.classList.contains('calc__item-input')) {
        return handleInputClick(e.target);
    }

    if (e.target.classList.contains('calc__next-button')) {
        return handleNextClick(e.target);
    }

    if (e.target.classList.contains('skip-button')) {
        return skipStep(e.target);
    }
})