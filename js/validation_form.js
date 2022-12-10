const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirm_password = document.getElementById('confirm password');

let InputForms = {
    'username': username,
    'email': email,
    'password': password,
    'confirm_password': confirm_password
}


if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        validateInputs() && formData()
    });
}

const formData = async () => {
    const dataInputs = {
        username: username.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirm_password.value
    }

    try {
        let data = await fetch("https://goldblv.com/api/hiring/tasks/register", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataInputs)
        })

        let result = await data.json()
        if (result && result.errors && Object.keys(result.errors).length) {
            showErrors(result.errors)
         }else {
            saveEmailToLocalStorage();
            window.location.href = "succeed_page.html";
        }
    } catch (err) {
        console.log(err)
    }

}

const showErrors = (errors) => {
    Object.keys(errors).forEach((inputName) => {
        errors[inputName].forEach((err) => {
            errorDisplay = InputForms[inputName].closest(".input-control").querySelector(".error");
            errorDisplay.innerText = err;
        })
    })
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.remove('error');
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const saveEmailToLocalStorage = () => {
    localStorage.setItem("email", email.value);
};

const getEmailFromLocalStorage = () => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
        document.getElementById("User-Email").innerHTML = storedEmail;
    }
};

const isUserNameValid = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/
    return usernameRegex.test(username);
};

const checkFirstLetterOfUsername = (username) => {
    return username.match(new RegExp(/^\d/)) !== null;
};

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirm_password.value.trim();
    let regExp = /^\d/;

    if (usernameValue === '') {
        setError(username, 'Username is required');
        return false;
    } else if (!isUserNameValid(usernameValue)) {
        setError(username, 'Username must consist of 5 to 15 characters,Only letters and numbers are allowed.');
        return false;
    } else if (checkFirstLetterOfUsername(usernameValue) || regExp.test(usernameValue[usernameValue.length - 1])) {
        setError(username, 'Invalid Username');
        return false;
    } else {
        setSuccess(username);
    }

    if (emailValue === '') {
        setError(email, 'Email is required');
        return false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Invalid Email, Provide a valid email address');
        return false;
    } else {
        setSuccess(email);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        return false;
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 character.')
        return false;
    } else {
        setSuccess(password);
    }

    if (confirmPasswordValue === '') {
        setError(confirm_password, 'Please confirm your password');
        return false;
    } else if (confirmPasswordValue !== passwordValue) {
        setError(confirm_password, "Passwords doesn't match");
        return false;
    } else {
        setSuccess(confirm_password);
    }
    return true;
};