let files = [];
let trashBin = [];
let currentId = 0;

document.getElementById('fileInput').addEventListener('change', function(event) {
    let filesSelected = event.target.files;
    if (filesSelected.length > 5) {
        showNotification("You can only upload up to 5 files at a time.", 'error');
        return;
    }

    Array.from(filesSelected).forEach(file => {
        if (file.type !== "application/pdf") {
            showNotification("Only PDF files are allowed.", 'error');
            return;
        }
        if (files.some(f => f.name === file.name)) {
            showNotification(`A file named ${file.name} already exists.`, 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const newFile = {
                id: currentId++,
                name: file.name,
                date: new Date(),
                content: e.target.result
            };
            files.push(newFile);
            displayFiles();
            showNotification(`File ${file.name} uploaded successfully.`, 'success');
        };
        reader.readAsDataURL(file);
    });
});

document.getElementById('searchBar').addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase();
    displayFiles(searchText);
});

function sortFiles(criteria) {
    if (criteria === 'name') {
        files.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'date') {
        files.sort((a, b) => a.date - b.date);
    }
    displayFiles();
}

function displayFiles(searchText = '') {
    const fileArea = document.getElementById('fileArea');
    fileArea.innerHTML = '';
    files.filter(file => file.name.toLowerCase().includes(searchText)).forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file';
        fileDiv.textContent = `${index + 1}. ${file.name} (${file.date.toLocaleString()})`;
        fileDiv.oncontextmenu = (event) => {
            event.preventDefault();
            showContextMenu(event, file.id);
            return false;
        };
        fileArea.appendChild(fileDiv);
    });
}

function showContextMenu(event, fileId) {
    const contextMenu = document.createElement('ul');
    contextMenu.className = 'context-menu';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    document.body.appendChild(contextMenu);

    const actions = [
        { text: 'Print/View', icon: 'fa-print', action: () => handleFileAction('print', fileId) },
        { text: 'Rename', icon: 'fa-pencil-alt', action: () => handleFileAction('rename', fileId) },
        { text: 'Move to Trash Bin', icon: 'fa-trash', action: () => handleFileAction('delete', fileId) }
    ];

    actions.forEach(({ text, icon, action }) => {
        const option = document.createElement('li');
        option.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        option.onclick = action;
        contextMenu.appendChild(option);
    });

    document.addEventListener('click', () => contextMenu.remove(), { once: true });
    event.preventDefault();
}

function handleFileAction(action, fileId) {
    switch(action) {
        case 'print':
            printFile(fileId);
            break;
        case 'rename':
            const newName = prompt("New name:");
            if (newName !== null && newName.trim() !== '') {
                renameFile(fileId, newName);
            } else {
                showNotification('Rename canceled.', 'warning');
            }
            break;
        case 'delete':
            deleteFile(fileId);
            break;
    }
}

function printFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) {
        showNotification('File not found for printing.', 'error');
        return;
    }

    const pdfContent = atob(file.content.split(',')[1]);
    const length = pdfContent.length;
    const arrayBuffer = new Uint8Array(new ArrayBuffer(length));

    for (let i = 0; i < length; i++) {
        arrayBuffer[i] = pdfContent.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const objectURL = URL.createObjectURL(blob);

    const printWindow = window.open(objectURL);
    printWindow.onload = function() {
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(objectURL);
        }, 500);
    };

    // Optionally close the print window after a delay
    // setTimeout(() => {
    //     printWindow.close();
    // }, 500);
}

function renameFile(fileId, newName) {
    const file = files.find(f => f.id === fileId);
    file.name = newName;
    displayFiles();
}

function deleteFile(fileId) {
    const fileIndex = files.findIndex(f => f.id === fileId);
    const [removedFile] = files.splice(fileIndex, 1);
    trashBin.push(removedFile);
    displayFiles();
    displayTrashBin();
    showNotification('File moved to trash.', 'success');
}

function displayTrashBin() {
    const trashArea = document.getElementById('trashBin');
    trashArea.innerHTML = '';
    trashBin.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'deleted-file';
        fileDiv.textContent = `${index + 1}. ${file.name}`;
        fileDiv.oncontextmenu = (event) => {
            event.preventDefault();
            showTrashContextMenu(event, file.id);
            return false;
        };
        trashArea.appendChild(fileDiv);
    });
}

function showTrashContextMenu(event, fileId) {
    const contextMenu = document.createElement('ul');
    contextMenu.className = 'context-menu';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    document.body.appendChild(contextMenu);

    const actions = [
        { text: 'Restore File', icon: 'fa-undo', action: () => restoreFile(fileId) },
        { text: 'Delete File', icon: 'fa-trash-alt', action: () => permanentlyDeleteFile(fileId) }
    ];

    actions.forEach(({ text, icon, action }) => {
        const option = document.createElement('li');
        option.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        option.onclick = () => {
            action();
            contextMenu.remove();
        };
        contextMenu.appendChild(option);
    });

    document.addEventListener('click', () => contextMenu.remove(), { once: true });
    event.preventDefault();
}

function showNotification(message, type = 'success', duration = 5000) {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        const tempContainer = document.createElement('div');
        tempContainer.id = 'notificationContainer';
        document.body.appendChild(tempContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.bottom = `${20 + notificationContainer.childNodes.length * 60}px`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions(notificationContainer);
        }, 600);
    }, duration);
}

function updateNotificationPositions(container) {
    const notifications = Array.from(container.childNodes);
    notifications.forEach((notif, index) => {
        notif.style.bottom = `${20 + index * 60}px`;
    });
}


function restoreFile(fileId) {
    const fileIndex = trashBin.findIndex(f => f.id === fileId);
    const [restoredFile] = trashBin.splice(fileIndex, 1);
    files.push(restoredFile);
    displayFiles();
    displayTrashBin();
    showNotification('File restored successfully.', 'success');
}

function permanentlyDeleteFile(fileId) {
    const fileIndex = trashBin.findIndex(f => f.id === fileId);
    trashBin.splice(fileIndex, 1);
    displayTrashBin();
    showNotification('File deleted permanently.', 'error');
}

let subMenu = document.getElementById("subMenu");
let card = document.getElementById('adminCard');

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}
card.addEventListener('click', function() {
    var url = card.querySelector('a').getAttribute('href');
    window.location.href = url;
});

document.querySelectorAll('.sub-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const subContent = event.target.nextElementSibling;
        subContent.style.display = subContent.style.display === 'block' ? 'none' : 'block';
    });
});