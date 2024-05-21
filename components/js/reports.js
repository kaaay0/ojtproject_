let subMenu = document.getElementById("subMenu");

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}

// Ensure all card-related functionalities are correctly managed
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        var url = card.querySelector('a').getAttribute('href');
        window.location.href = url;
    });
});

// Manage sub-dropdowns within the dropdown menus
document.querySelectorAll('.sub-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const subContent = event.target.nextElementSibling;
        subContent.style.display = subContent.style.display === 'block' ? 'none' : 'block';
    });
});

// Modal functionality di na ka alam plano klhzsfkjasfjk
let modal = document.getElementById("adminModal");
let modalClose = document.querySelector(".modal .close");

document.querySelector(".sub-menu .user-info h1").addEventListener("click", function(event) {
    event.preventDefault();
    openModal();
});

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

modalClose.onclick = function() {
    closeModal();
};
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

function saveCredentials() {
    console.log('Saving credentials...');
    closeModal();
}