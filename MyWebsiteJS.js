function Navigation() {
    $("nav").find("a").click(function (e) {
        e.preventDefault();
        var section = $(this).attr("href");
        $("html, body").animate({
            scrollTop: $(section).offset().top
        });
    });
    let collapseStatus = "off";
    const hamburger = document.getElementById("hamburger")
    const navCollapse = document.getElementById("nav_collapse")
    const hamb1 = document.getElementById("hamb_el1")
    const hamb2 = document.getElementById("hamb_el2")
    const hamb3 = document.getElementById("hamb_el3")
    hamburger.addEventListener("click", function () {
        if (collapseStatus == "off") {
            navCollapse.style.display = "flex";
            collapseStatus = "on";
            hamburger.classList.add("hamb_active");
            hamb1.classList.add("hambl1_active");
            hamb2.style.display = "none";
            hamb3.classList.add("hambl3_active");
        } else if (collapseStatus == "on" ){
            navCollapse.style.display = "";
            collapseStatus = "off";
            hamburger.classList.remove("hamb_active");
            hamb1.classList.remove("hambl1_active");
            hamb2.style.display = "block";
            hamb3.classList.remove("hambl3_active");
        }
    })
   
    
}
Navigation();

function Email() {
    const form = document.querySelector('#contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    form.setAttribute('novalidate', true);

    const displayFieldError = function (elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');

        
        if (fieldError === null) {
         
            const errorText = elem.dataset.error;
            const divError = document.createElement('div');
            divError.classList.add('field-error');
            divError.innerText = errorText;
            fieldRow.appendChild(divError);
        }
    };

    const hideFieldError = function (elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError !== null) {
            fieldError.remove();
        }
    };

    [...inputs].forEach(elem => {
        elem.addEventListener('input', function () {
            if (!this.checkValidity()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });

        if (elem.type === "checkbox") {
            elem.addEventListener('click', function () {
                const formRow = this.closest('.form-row');
                if (this.checked) {
                    this.classList.remove('error');
                    hideFieldError(this);
                } else {
                    this.classList.add('error');
                }
            });
        }
    });

    const checkFieldsErrors = function (elements) {
        let fieldsAreValid = true;

        [...elements].forEach(elem => {
            if (elem.checkValidity()) {
                hideFieldError(elem);
                elem.classList.remove('error');
            } else {
                displayFieldError(elem);
                elem.classList.add('error');
                fieldsAreValid = false;
            }
        });

        return fieldsAreValid;
    };

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (checkFieldsErrors(inputs)) {
            const elements = form.querySelectorAll('input:not(:disabled), textarea:not(:disabled), select:not(:disabled)');

            const dataToSend = new FormData();
            [...elements].forEach(el => dataToSend.append(el.name, el.value));

            const submit = form.querySelector('[type="submit"]');
            submit.disabled = true;
            submit.classList.add('element-is-busy');

            const url = form.getAttribute('action');
            const method = form.getAttribute('method');

            fetch(url, {
                    method: method.toUpperCase(),
                    body: dataToSend
                })
                .then(ret => ret.json())
                .then(ret => {
                    submit.disabled = false;
                    submit.classList.remove('element-is-busy');

                    if (ret.errors) {
                        ret.errors.map(function (el) {
                            return '[name="' + el + '"]'
                        });

                        const badFields = form.querySelectorAll(ret.errors.join(','));
                        checkFieldsErrors(badFields);
                    } else {
                        if (ret.status === 'ok') {
                            const div = document.createElement('div');
                            div.classList.add('form-send-success');

                            form.parentElement.insertBefore(div, form);
                            div.innerHTML = '<strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>';
                            form.remove();
                        }

                        if (ret.status === 'error') {
                            if (document.querySelector('.send-error')) {
                                document.querySelector('.send-error').remove();
                            }
                            const div = document.createElement('div');
                            div.classList.add('send-error');
                            div.innerHTML = 'Wysłanie wiadomości się nie powiodło';
                            submit.parentElement.appendChild(div);
                        }
                    }
                }).catch(_ => {
                    submit.disabled = false;
                    submit.classList.remove('element-is-busy');
                });
        }
    });
}
Email();
