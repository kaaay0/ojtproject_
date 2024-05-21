document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
});

const rowsPerPage = 22;
let currentPage = 1;

function initializeTable() {
    renderPaginationControls();
    renderReadOnlyTable();
}

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function renderReadOnlyTable() {
    const data = getFromStorage('tableData');
    const table = document.getElementById('readOnlyTable');
    const tableBody = table.querySelector('tbody');

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const pageData = data.slice(startRow, endRow);

    tableBody.innerHTML = '';

    pageData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = startRow + rowIndex + 1;
        tr.appendChild(th);

        const columnsToShow = [31, 32, 33, 34, 35];
        const filteredRow = row.filter((_, index) => columnsToShow.includes(index));
        filteredRow.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell.value;
            tr.appendChild(td);
        });

        tr.style.opacity = "0";
        setTimeout(() => {
            tr.style.opacity = "1";
            tr.style.transition = "opacity 2s";
        }, 100 * rowIndex);

        tableBody.appendChild(tr);
    });

    tableBody.style.display = pageData.length > 0 ? "" : "none";
}
function renderPaginationControls() {
    const data = getFromStorage('tableData');
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        currentPage--;
        renderReadOnlyTable();
        renderPaginationControls();
    };
    paginationContainer.appendChild(prevButton);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = currentPage === i ? 'active' : '';
        button.onclick = () => {
            currentPage = i;
            renderReadOnlyTable();
            renderPaginationControls();
        };
        paginationContainer.appendChild(button);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        currentPage++;
        renderReadOnlyTable();
        renderPaginationControls();
    };
    paginationContainer.appendChild(nextButton);
}

function goBack() {
    window.history.back();
}