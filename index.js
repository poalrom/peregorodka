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

/** SCROLL */

const scroll = new SmoothScroll('a[href*="#"]');

/** POPUP */
document.querySelectorAll('.popup').forEach(
    (popup) => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.toggle('popup_hidden')
            }
        });
        popup.querySelectorAll('.popup__toggler').forEach(
            b => b.addEventListener('click', () => popup.classList.toggle('popup_hidden'))
        )
    }
)

/** MOBILE MENU */

const mobileMenuPopup = document.querySelector('.menu-popup');
const mobileMenuButtons = document.querySelectorAll('.menu-toggler')
    .forEach((button) => {
        button.addEventListener('click', () => mobileMenuPopup.classList.toggle('menu-popup_hidden'))
    });

/** ORDER POPUP */

const orderPopup = document.querySelector('.order-popup');
const orderSuccessPopup = document.querySelector('.order-success-popup');
const fastOrderForm = orderPopup.querySelector('.fast-order__form');
const fastOrderSubmit = orderPopup.querySelector('.fast-order__popup-submit');
document.querySelectorAll('.order-toggler')
    .forEach((button) => {
        button.addEventListener('click', () => orderPopup.classList.toggle('popup_hidden'))
    });



/** FAST ORDER POPUP */

const fastOrderPopup = document.querySelector('.fast-order-popup');
const fastOrderButtons = document.querySelectorAll('.fast-order-toggler')
    .forEach((button) => {
        button.addEventListener('click', () => fastOrderPopup.classList.toggle('popup_hidden'))
    });


/** ARROW DISABLER */

const ArrowDisabler = function(Glide, Components, Events) {
    return {
        mount() {
            // Only in effect when rewinding is disabled
            if (Glide.settings.rewind) {
                return
            }

            Glide.on(['mount.after', 'run'], () => {
                // Filter out arrows_control
                for (let controlItem of Components.Controls.items) {
                    if (controlItem.className !== 'glide__arrows') {
                        continue
                    }

                    // Set left arrow state
                    const left = controlItem.querySelector('.glide__arrow_prev')
                    if (left) {
                        if (Glide.index === 0) {
                            left.setAttribute('disabled', '') // Disable on first slide
                        } else {
                            left.removeAttribute('disabled') // Enable on other slides
                        }
                    }

                    // Set right arrow state
                    const right = controlItem.querySelector('.glide__arrow_next')
                    if (right) {
                        if (Glide.index === Components.Sizes.length - Glide.settings.perView) {
                            right.setAttribute('disabled', '') // Disable on last slide
                        } else {
                            right.removeAttribute('disabled') // Disable on other slides
                        }
                    }
                }
            })
        }
    }
}

/** CONSTRUCTOR */
const construct = document.querySelector('.calc');
const constructTitle = construct.querySelector('.calc__title');
const submitButtons = construct.querySelectorAll('[type=submit]');
const steps = construct.querySelectorAll('.calc__step');
const endStep = construct.querySelector('.calc__step_end');
const resultInputs = construct.querySelectorAll('[type=radio][name="Дверь"]');
const resultImages = construct.querySelectorAll('.calc__result-image');
const resultName = construct.querySelectorAll('.calc__result');
const additionalOptions = construct.querySelectorAll('.additional-options-input');
const selectedOptions = construct.querySelector('.calc__selected-options-list');

const sliders = {
    '.calc__step[data-index="1"] .glide': null,
    '.calc__step[data-index="2-1"] .glide': null,
    '.calc__step[data-index="2-2"] .glide': null,
    '.calc__step[data-index="2-2-1"] .glide': null,
    '.calc__step[data-index="2-2-2"] .glide': null,
    '.calc__step[data-index="2-3"] .glide': null,
    '.calc__step[data-index="2-4"] .glide': null,
};

function initSliders() {
    if (window.innerWidth <= 940) {
        construct.querySelectorAll('.calc__items').forEach(e => {
            e.classList.remove('calc__items');
        });
        Object.keys(sliders).forEach(e => {
            if (!sliders[e]) {
                sliders[e] = new Glide(e, {
                    type: 'slider',
                    rewind: false
                }).mount({ ArrowDisabler });
                return;
            }
            const isActive = Boolean(construct.querySelector(e.replace(' .glide', '.calc__step_active')));
            if (!isActive) {
                sliders[e] && sliders[e].destroy();
                sliders[e] = new Glide(e, {
                    type: 'slider',
                    rewind: false
                }).mount({ ArrowDisabler });
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
    const checkedItems = construct.querySelectorAll(':checked');
    const selectedOptionsList = [
        'Тип - ' + construct.elements['Тип'].value,
        'Дверь - ' + construct.elements['Дверь'].value,
        'Цвет профиля - ' + construct.elements['Цвет профиля'].value,
        'Количество слоев - ' + construct.elements['Количество слоев'].value,
        'Цвет стекла - ' + construct.elements['Цвет стекла'].value,
        'Рисунок - ' + construct.elements['Рисунок'].value,
    ];
    additionalOptions.forEach(i => {
        if (i.checked) {
            selectedOptionsList.push(i.name);
        }
    });
    selectedOptions.innerHTML = selectedOptionsList.map(el => `<li class="calc__selected-option">${el}</li>`).join(' ')
}

function goToStep(currentStep, nextStepIndex, keepPrev) {
    const nextStepSelector = '.calc__step[data-index="' + nextStepIndex + '"]';
    const nextStep = construct.querySelector(nextStepSelector);
    if (!nextStep) {
        console.warn('Next step not found');
        return;
    }
    if (nextStepIndex === '6') {
        fillLastStep();
    }
    fillCalcResultImage();
    currentStep.classList.remove('calc__step_active');
    if (!keepPrev) {
        nextStep.dataset.prev = currentStep.dataset.index;
    }
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
        const input = selectedItem.querySelector('input');
        if (!input) {
            console.warn('Input not found');
            return;
        }
        input.checked = true;
        nextStepIndex = selectedItem.dataset.next;
    }
    goToStep(step, nextStepIndex);
}

function goBackToStep(stepButton) {
    const step = stepButton.closest('.calc__step');
    if (!step || !step.dataset.prev) {
        console.warn('Current step not found');
        return;
    }
    goToStep(step, step.dataset.prev, true);
}

construct.elements['Телефон'].forEach(el => el.addEventListener('keydown', () => el.classList.remove('input_error')))
construct.elements['Файлы'].forEach(el => el.addEventListener('change', () => {
    let filename = [];
    for (let i = 0; i < el.files.length; i++) {
        filename.push(el.files[i].name);
    }
    el.nextElementSibling.querySelector('.fast-order__field-placeholder-content')
        .innerHTML = `${filename.join(', ') || 'Прикрепите файлы'} <span class="file-button"></span>`;
}))

construct.addEventListener('click', (e) => {
    if (e.target.classList.contains('calc__item-input')) {
        return handleInputClick(e.target);
    }

    if (e.target.classList.contains('calc__next-button')) {
        return handleNextClick(e.target);
    }

    if (e.target.classList.contains('calc__prev-button')) {
        return goBackToStep(e.target);
    }
});

function getInputValue(input) {
    if (['text'].includes(input.type) && input.value) {
        return input.value;
    }
    if (['file'].includes(input.type) && input.value) {
        return input.files;
    }
    if (['radio', 'checkbox'].includes(input.type) && input.checked && input.value) {
        return input.value;
    }

    return '';
}

function getValue(form, key) {
    if (!form.elements[key].forEach) {
        return getInputValue(form.elements[key]);
    }
    let value = '';
    form.elements[key].forEach((e) => {
        const eVal = getInputValue(e);
        if (eVal) {
            value = eVal;
        }
    });

    return value;
}

construct.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneValue = getValue(construct, 'Телефон');
    if (!phoneValue) {
        construct.elements['Телефон'].forEach(el => el.classList.add('input_error'))
        return;
    }

    const formData = new FormData();

    formData.append('Email', getValue(construct, 'Email'));
    formData.append('Вызвать замерщика', getValue(construct, 'Вызвать замерщика') || '-');
    formData.append('Дверь', getValue(construct, 'Дверь'));
    formData.append('Длина', getValue(construct, 'Длина'));
    formData.append('Жалюзи', getValue(construct, 'Жалюзи') || '-');
    formData.append('Имя', getValue(construct, 'Имя'));
    formData.append('Кабель-канал', getValue(construct, 'Кабель-канал') || '-');
    formData.append('Количество слоев', getValue(construct, 'Количество слоев'));
    formData.append('Рисунок', getValue(construct, 'Рисунок'));
    formData.append('СКУД', getValue(construct, 'СКУД') || '-');
    formData.append('Телефон', phoneValue);
    formData.append('Тип', getValue(construct, 'Тип'));
    formData.append('Цвет профиля', getValue(construct, 'Цвет профиля'));
    formData.append('Цвет стекла', getValue(construct, 'Цвет стекла'));
    formData.append('Ширина', getValue(construct, 'Ширина'));

    const files = getValue(construct, 'Файлы');
    for (let i = 0; i < files.length; i++) {
        formData.append('Файлы', files[i]);
    }
    submitButtons.forEach(b => b.disabled = true)
    fetch('https://peregorodka.free.beeceptor.com', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }).then(res => {
            steps.forEach(s => s.classList.remove('calc__step_active'));
            endStep.classList.add('calc__step_active');
            fastOrderPopup.classList.add('popup_hidden');
        }).catch(console.error)
        .then(() => submitButtons.forEach(b => b.disabled = true));
});

fastOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneValue = getValue(fastOrderForm, 'Телефон');
    if (!phoneValue) {
        fastOrderForm.elements['Телефон'].forEach(el => el.classList.add('input_error'))
        return;
    }

    const formData = new FormData();

    formData.append('Имя', getValue(fastOrderForm, 'Имя'));
    formData.append('Email', getValue(fastOrderForm, 'Email'));
    formData.append('Телефон', phoneValue);

    const files = getValue(fastOrderForm, 'Файлы');
    for (let i = 0; i < files.length; i++) {
        formData.append('Файлы', files[i]);
    }

    fastOrderSubmit.disabled = true;

    fetch('https://peregorodka.free.beeceptor.com', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }).then(res => {
            orderPopup.classList.add('popup_hidden');
            orderSuccessPopup.classList.remove('popup_hidden');
        }).catch(console.error)
        .then(() => fastOrderSubmit.disabled = false);
});