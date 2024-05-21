let subMenu = document.getElementById("subMenu");
let card = document.getElementById('adminCard');

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}


card.addEventListener('click', function() {
    var url = card.querySelector('a').getAttribute('href');
    window.location.href = url;
});

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

