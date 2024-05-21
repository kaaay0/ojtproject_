document.addEventListener('DOMContentLoaded', function() {
    renderTable();
});

const rowsPerPage = 15;
let currentPage = 1;

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function renderTable() {
    console.log('Rendering table...');
    const data = getFromStorage('tableData') || [];
    if (!data.length) {
        console.log('No data found in storage.');
    }
    const tableBody = document.querySelector('#dataTable tbody');
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = data.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    paginatedItems.forEach((row, index) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = startIndex + index + 1;
        tr.appendChild(th);

        row.forEach((cell, colIndex) => {
            console.log(`Processing cell in column: ${cell.column}`);
            const td = document.createElement('td');
            let input;
            switch (cell.column) {
                case '% Bene':
                    input = document.createElement('select');
                    ['0.5', '0.25', '0.50', '0.75', '1.00'].forEach(value => {
                        const option = document.createElement('option');
                        option.value = option.textContent = value;
                        input.appendChild(option);
                    });
                    break;
                case 'CDD, Direct Pension, 36MLS (ToPAfter/NoResume)':
                    input = document.createElement('select');
                    ['Yes', 'No'].forEach(value => {
                        const option = document.createElement('option');
                        option.value = option.textContent = value;
                        input.appendChild(option);
                    });
                    break;
                case 'Paid Prin 08-12':
                    input = document.createElement('input');
                    input.type = 'number';
                    break;
                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    break;
            }
            input.value = cell.value || '';
            input.size = cell.size || 10;
            input.onchange = () => updateCell(startIndex + index, cell.column, input.value);
            td.appendChild(input);
            tr.appendChild(td);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteRow(startIndex + index);
        tr.appendChild(deleteButton);
        tableBody.appendChild(tr);
    });
    updatePagination(data.length);
}

function updatePagination(totalRows) {
    const pageCount = Math.ceil(totalRows / rowsPerPage);
    const paginationContainer = document.getElementById('pagination');
    const maxVisibleButtons = 5;
    let startPage, endPage;

    if (pageCount <= maxVisibleButtons) {
        startPage = 1;
        endPage = pageCount;
    } else {
        startPage = Math.max(currentPage - 2, 1);
        endPage = startPage + maxVisibleButtons - 1;

        if (endPage > pageCount) {
            endPage = pageCount;
            startPage = endPage - maxVisibleButtons + 1;
        }
    }

    paginationContainer.innerHTML = '<button onclick="previousPage()" class="btn pagination-btn prev-page">Previous</button>';

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'btn page-btn' + (i === currentPage ? ' active' : '');
        button.onclick = function() { setCurrentPage(i); };
        paginationContainer.appendChild(button);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'btn pagination-btn next-page';
    nextButton.onclick = nextPage;
    paginationContainer.appendChild(nextButton);
}

function setCurrentPage(num) {
    currentPage = num;
    renderTable();
    updatePagination(getFromStorage('tableData').length);
}

function nextPage() {
    if (currentPage < Math.ceil(getFromStorage('tableData').length / rowsPerPage)) {
        currentPage++;
        renderTable();
        updatePagination(getFromStorage('tableData').length);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination(getFromStorage('tableData').length);
    }
}

function logAction(action, details) {
    const log = getFromStorage('actionLog') || [];
    log.push({ action, details, timestamp: new Date().toISOString() });
    saveToStorage('actionLog', log);
}

function goBack() {
    window.history.back();
}

function addRow() {
    const newRow = Array(51).fill().map((_, index) => ({ column: index, value: '', size: 10 }));
    const data = getFromStorage('tableData') || [];
    data.push(newRow);
    saveToStorage('tableData', data);
    renderTable();
    logAction('Add', 'Added a new row.');
}

function updateCell(rowIndex, column, value) {
    const data = getFromStorage('tableData');
    if (data && data[rowIndex]) {
        const cellIndex = data[rowIndex].findIndex(c => c.column === column);
        if (cellIndex !== -1) {
            data[rowIndex][cellIndex].value = value;
        } else {
            data[rowIndex].push({ column, value, size: 10 });
        }
        saveToStorage('tableData', data);
        logAction('Update', `Updated cell at row ${rowIndex}, column ${column} with value '${value}'.`);
    }
}
function deleteRow(index) {
    let data = getFromStorage('tableData');
    data.splice(index, 1);
    saveToStorage('tableData', data);
    renderTable();
    logAction('Delete', `Deleted row at index ${index}.`);
}

function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    table = document.getElementById('dataTable');
    const tr = table.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        let visible = false;
        const td = tr[i].getElementsByTagName('td');
        for (let j = 0; j < td.length; j++) {
            if (td[j] && td[j].textContent.toLowerCase().includes(filter)) {
                visible = true;
                break;
            }
        }
        tr[i].style.display = visible ? "" : "none";
    }
}
