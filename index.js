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
const resultInputs = construct.querySelectorAll('[type=radio][name="Дверь"]');
const resultImages = construct.querySelectorAll('.calc__result-image');
const resultName = construct.querySelectorAll('.calc__result');
const additionalOptions = construct.querySelectorAll('.additional-options-input');

const sliders = {
    '.calc__step_1 .glide': null,
    '.calc__step_2-1 .glide': null,
    '.calc__step_2-2 .glide': null,
    '.calc__step_2-2-1 .glide': null,
    '.calc__step_2-2-2 .glide': null,
    '.calc__step_2-3 .glide': null,
    '.calc__step_2-4 .glide': null,
};

function initSliders() {
    if (window.innerWidth <= 940) {
        construct.querySelectorAll('.calc__items').forEach(e => {
            e.classList.remove('calc__items');
        });
        Object.keys(sliders).forEach(e => {
            if (!sliders[e]) {
                sliders[e] = new Glide(e, {
                    type: 'carousel'
                }).mount();
                return;
            }
            const isActive = Boolean(construct.querySelector(sliders[e].replace(' .glide', '.calc__step_active')));
            if (!isActive) {
                sliders[e] && sliders[e].destroy();
                sliders[e] = new Glide(e, {
                    type: 'carousel'
                }).mount();
            }
        })
    } else {
        Object.keys(sliders).forEach(e => {
            if (sliders[e]) {
                sliders[e].destroy();
                sliders[e] = null;
            }
        });
        construct.querySelectorAll('.glide__slides').forEach(e => e.classList.add('calc__items'));
    }
}

initSliders();

window.addEventListener("resize", initSliders);

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

function fillCalcResultImage() {
    let selectedResult;
    resultInputs.forEach(i => {
        if (i.checked) {
            selectedResult = i;
        }
    })
    if (!selectedResult) {
        console.warn('Selected result not found');
        return;
    }
    const selectedItem = selectedResult.closest('.glide__slide');
    if (!selectedItem) {
        console.warn('Closest slide not found')
        return;
    }
    const resultImage = selectedItem.querySelector('.calc__item-image');
    if (!resultImage || !resultImage.alt) {
        console.warn('Result image not found')
        return;
    }
    resultImages.forEach(i => i.src = resultImage.src);
    resultName.forEach(n => n.textContent = resultImage.alt);
}

function fillLastStep() {
    constructTitle.textContent = 'Поздравляем!';
    additionalOptions.forEach(i => {
        const optionImage = construct.querySelector(`.calc__additional-option[data-name=${i.name}]`);
        if (!optionImage) {
            return;
        }
        if (i.checked) {
            optionImage.classList.remove('calc__additional-option_hidden');
        } else {
            optionImage.classList.add('calc__additional-option_hidden');
        }
    })
}

function goToStep(currentStep, nextStepIndex) {
    const nextStepClass = '.calc__step_' + nextStepIndex;
    const nextStep = construct.querySelector(nextStepClass);
    if (!nextStep) {
        console.warn('Next step not found');
        return;
    }
    if (nextStepIndex === '6') {
        fillLastStep();
    }
    fillCalcResultImage();
    currentStep.classList.remove('calc__step_active');
    nextStep.classList.add('calc__step_active');
    Object.values(sliders).forEach(slider => slider && slider.update());
}

function handleNextClick(button) {
    const step = button.closest('.calc__step');
    if (!step) {
        console.warn('Current step not found');
        return;
    }
    let nextStepIndex = button.dataset.next;
    if (!nextStepIndex) {
        const selectedItem = step.querySelector('.calc__item_active') || step.querySelector('.glide__slide--active');
        if (!selectedItem || !selectedItem.dataset.next) {
            console.warn('Item not selected');
            return;
        }
        selectedItem.querySelector('input').checked = true;
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
});