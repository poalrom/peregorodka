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