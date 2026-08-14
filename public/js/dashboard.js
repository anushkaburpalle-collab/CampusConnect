const token = localStorage.getItem("campusToken");

const user =
    JSON.parse(
        localStorage.getItem("campusUser")
    );


if (!token) {
    window.location.href = "index.html";
}


// USER

if (user) {

    document.getElementById("userName")
        .textContent = user.name;

    document.getElementById("avatarLetter")
        .textContent =
        user.name.charAt(0).toUpperCase();

}


// NAVIGATION

function showSection(sectionId) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .getElementById(sectionId)
        .classList.add(
            "active-section"
        );


    const titles = {

        home: "Dashboard",

        cart: "Campus Cart",

        study: "Study Buddy",

        materials: "Study Materials",

        inbox: "Inbox"

    };


    document.getElementById("pageTitle")
        .textContent =
        titles[sectionId];


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    loadSection(sectionId);
}


function loadSection(section) {

    if (section === "cart")
        loadListings();

    if (section === "study")
        loadStudySessions();

    if (section === "materials")
        loadMaterials();

    if (section === "inbox")
        loadInbox();
}


// LOGOUT

function logout() {

    localStorage.removeItem("campusToken");
    localStorage.removeItem("campusUser");

    window.location.href = "index.html";
}


// ===========================
// CAMPUS CART
// ===========================

let allListings = [];


async function loadListings() {

    const response =
        await fetch("/api/listings");

    allListings =
        await response.json();

    renderListings(allListings);
}


function renderListings(listings) {

    const container =
        document.getElementById("listingGrid");


    if (!listings.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div>🛒</div>
                <h3>No listings yet</h3>
                <p>Be the first student to sell something.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        listings.map(item => `

            <div class="product-card">

                <div class="product-image">

                    ${getCategoryEmoji(item.category)}

                </div>

                <div class="product-content">

                    <span class="category">
                        ${item.category}
                    </span>

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        ${item.description || "No description"}
                    </p>

                    <div class="seller">

                        <div class="avatar small-avatar">
                            ${item.seller.name.charAt(0)}
                        </div>

                        <span>
                            ${item.seller.name}
                        </span>

                    </div>

                    <div class="product-bottom">

                        <strong>
                            ₹${item.price}
                        </strong>

                        <button
                            onclick="contactSeller('${item.seller._id}')">

                            Contact

                        </button>

                    </div>

                </div>

            </div>

        `).join("");
}


function getCategoryEmoji(category) {

    const text =
        category.toLowerCase();

    if (text.includes("book"))
        return "📚";

    if (text.includes("lab"))
        return "🥼";

    if (text.includes("station"))
        return "✏️";

    if (text.includes("calculator"))
        return "🧮";

    return "📦";
}


function filterListings() {

    const search =
        document
            .getElementById("listingSearch")
            .value
            .toLowerCase();


    const filtered =
        allListings.filter(item =>

            item.title
                .toLowerCase()
                .includes(search)

            ||

            item.category
                .toLowerCase()
                .includes(search)

        );


    renderListings(filtered);
}


// CREATE LISTING

async function createListing() {

    const body = {

        title:
            document.getElementById("sellTitle").value,

        category:
            document.getElementById("sellCategory").value,

        price:
            document.getElementById("sellPrice").value,

        condition:
            document.getElementById("sellCondition").value,

        description:
            document.getElementById("sellDescription").value

    };


    const response =
        await fetch("/api/listings", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`

            },

            body:
                JSON.stringify(body)

        });


    if (response.ok) {

        closeSellModal();

        loadListings();

        alert("Item listed successfully!");

    }

}


// ===========================
// STUDY BUDDY
// ===========================

async function loadStudySessions() {

    const response =
        await fetch("/api/study/sessions");

    const sessions =
        await response.json();


    const container =
        document.getElementById("studyGrid");


    container.innerHTML =
        sessions.map(session => `

            <div class="study-card">

                <div class="study-top">

                    <span class="subject-tag">
                        ${session.subject}
                    </span>

                    <span class="members">
                        👥
                        ${session.participants.length}
                        /${session.maxMembers}
                    </span>

                </div>


                <h3>
                    ${session.title}
                </h3>


                <p>
                    ${session.description}
                </p>


                <div class="study-info">

                    <span>
                        📅 ${session.date}
                    </span>

                    <span>
                        ⏰ ${session.time}
                    </span>

                    <span>
                        📍 ${session.location}
                    </span>

                </div>


                <div class="study-footer">

                    <span>
                        By ${session.creator.name}
                    </span>

                    <button
                        onclick="joinSession('${session._id}')">

                        Join Session

                    </button>

                </div>

            </div>

        `).join("");
}


async function createStudySession() {

    const body = {

        title:
            document.getElementById("studyTitle").value,

        subject:
            document.getElementById("studySubject").value,

        date:
            document.getElementById("studyDate").value,

        time:
            document.getElementById("studyTime").value,

        location:
            document.getElementById("studyLocation").value,

        maxMembers:
            document.getElementById("studyMax").value,

        description:
            document.getElementById("studyDescription").value

    };


    const response =
        await fetch("/api/study/sessions", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`

            },

            body:
                JSON.stringify(body)

        });


    if (response.ok) {

        closeStudyModal();

        loadStudySessions();

        alert("Study session created!");

    }

}


async function joinSession(id) {

    const response =
        await fetch(
            `/api/study/sessions/${id}/join`,
            {

                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


    const data =
        await response.json();

    alert(data.message);

    loadStudySessions();
}


// ===========================
// MATERIALS
// ===========================

async function loadMaterials() {

    const response =
        await fetch("/api/materials");

    const materials =
        await response.json();


    const container =
        document.getElementById(
            "materialsGrid"
        );


    container.innerHTML =
        materials.map(material => `

            <div class="material-card">

                <div class="material-icon">
                    📄
                </div>

                <div>

                    <span class="category">
                        ${material.subject}
                    </span>

                    <h3>
                        ${material.title}
                    </h3>

                    <p>
                        Shared by
                        ${material.uploader.name}
                    </p>

                    <a
                        href="${material.link}"
                        target="_blank">

                        Open Material →

                    </a>

                </div>

            </div>

        `).join("");
}


// ===========================
// INBOX
// ===========================

async function loadInbox() {

    const response =
        await fetch(
            "/api/messages",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    const messages =
        await response.json();


    const container =
        document.getElementById(
            "inboxList"
        );


    if (!messages.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div>💬</div>
                <h3>Your inbox is empty</h3>
                <p>
                    Messages from campus peers
                    will appear here.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        messages.map(message => `

            <div class="message-card">

                <div class="avatar">
                    ${message.sender.name.charAt(0)}
                </div>

                <div>

                    <strong>
                        ${message.sender.name}
                    </strong>

                    <p>
                        ${message.text}
                    </p>

                </div>

            </div>

        `).join("");
}


// ===========================
// MODALS
// ===========================

function openSellModal() {

    document
        .getElementById("sellModal")
        .classList.add("show");

}


function closeSellModal() {

    document
        .getElementById("sellModal")
        .classList.remove("show");

}


function openStudyModal() {

    document
        .getElementById("studyModal")
        .classList.add("show");

}


function closeStudyModal() {

    document
        .getElementById("studyModal")
        .classList.remove("show");

}


function contactSeller(id) {

    alert(
        "Messaging feature: seller ID " + id
    );

}


function uploadMaterial() {

    alert(
        "Material upload can be connected to Cloudinary/Firebase next."
    );

}