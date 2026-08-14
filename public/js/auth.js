const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");


function showLogin() {

    loginForm.style.display = "block";
    registerForm.style.display = "none";

}


function showRegister() {

    loginForm.style.display = "none";
    registerForm.style.display = "block";

}


// LOGIN

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    const response = await fetch("/api/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });


    const data = await response.json();


    if (!response.ok) {

        document.getElementById("loginMessage")
            .textContent = data.message;

        return;

    }


    localStorage.setItem(
        "campusToken",
        data.token
    );

    localStorage.setItem(
        "campusUser",
        JSON.stringify(data.user)
    );


    window.location.href = "dashboard.html";

});


// REGISTER

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;

    const password =
        document.getElementById("registerPassword").value;

    const branch =
        document.getElementById("registerBranch").value;

    const year =
        document.getElementById("registerYear").value;


    const response = await fetch(
        "/api/auth/register",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                branch,
                year
            })

        }
    );


    const data = await response.json();


    if (!response.ok) {

        document.getElementById("registerMessage")
            .textContent = data.message;

        return;

    }


    localStorage.setItem(
        "campusToken",
        data.token
    );

    localStorage.setItem(
        "campusUser",
        JSON.stringify(data.user)
    );


    window.location.href = "dashboard.html";

});