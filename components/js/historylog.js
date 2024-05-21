document.addEventListener('DOMContentLoaded', function() {
    renderLog();
    document.getElementById('searchInput').addEventListener('input', () => renderLog());
});

const logsPerPage = 8;
let currentPage = 1;

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function renderLog(logEntries = getFromStorage('actionLog')) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredLogs = logEntries.filter(log => log.details.toLowerCase().includes(searchTerm)).reverse();

    const start = (currentPage - 1) * logsPerPage;
    const end = start + logsPerPage;
    const paginatedItems = filteredLogs.slice(start, end);

    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    paginatedItems.forEach((log, index) => {
        const li = document.createElement('li');
        li.className = 'log-entry';
        const logText = document.createElement('span');
        logText.textContent = `${log.action} - ${log.details} at ${new Date(log.timestamp).toLocaleString()}`;
        logText.className = 'log-text';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-log-entry';
        deleteButton.onclick = () => confirmDelete(index + start);
        li.appendChild(logText);
        li.appendChild(deleteButton);
        logList.appendChild(li);
    });
    renderPagination(filteredLogs.length);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const pageCount = Math.ceil(totalItems / logsPerPage);
    let maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > pageCount) {
        endPage = pageCount;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(pageCount, maxVisiblePages);
    }

    pagination.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        currentPage--;
        renderLog();
    };
    pagination.appendChild(prevButton);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.onclick = () => {
            currentPage = i;
            renderLog();
        };
        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === pageCount;
    nextButton.onclick = () => {
        currentPage++;
        renderLog();
    };
    pagination.appendChild(nextButton);
}

function confirmDelete(index) {
    const securityCode = prompt("Please enter the security code to delete this log:");
    if (securityCode === "1234") {
        deleteLogEntry(index);
    } else {
        alert("Incorrect security code.");
    }
}

function deleteLogEntry(index) {
    let logEntries = getFromStorage('actionLog');
    logEntries.splice(index, 1);
    saveToStorage('actionLog', logEntries);
    renderLog();
}

function clearHistory() {
    const securityCode = prompt("Please enter the security code to clear the entire history:");
    if (securityCode === "1234") {
        saveToStorage('actionLog', []);
        renderLog();
    } else {
        alert("Incorrect security code.");
    }
}

function goBack() {
    window.history.back();
}
