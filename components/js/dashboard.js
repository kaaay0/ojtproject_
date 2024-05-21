function getTextContent(id) {
    const element = document.getElementById(id);
    if (element) {
        const contentWithoutCommas = element.textContent.replace(/,/g, '');
        return parseFloat(contentWithoutCommas) || 0;
    }
    return 0;
}
// lock/unlock the tables
function toggleLock() {
    try {
        const lockButton = document.getElementById('lock-button');
        if (!lockButton) {
            console.error('Lock button not found');
            return;
        }

        const editableElements = document.querySelectorAll('[contenteditable]');
        if (editableElements.length === 0) {
            console.error('No editable elements found');
            return;
        }

        const isLocked = lockButton.innerText.includes('Lock');
        lockButton.innerText = isLocked ? 'Unlock Table' : 'Lock Table';

        editableElements.forEach(element => {
            element.contentEditable = !isLocked;
        });

        console.log(`Tables are now ${isLocked ? 'unlocked' : 'locked'} for editing.`);
    } catch (error) {
        console.error('Failed to toggle lock:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // lock button function to para hindi maka edit.
    const lockButton = document.getElementById('lock-button');
    if (lockButton) {
        lockButton.addEventListener('click', toggleLock);
    } else {
        console.error('Lock button not found on page load.');
    }
    attachEventListenersForRealTimeUpdates('table_1');
    attachEventListenersForRealTimeUpdates('table_2');

    updateCalculations();
});


function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setTextContent(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = formatNumberWithCommas(value.toFixed(2));
    }
}

// start of calculations

// Calculation para sa dalawang tables active at deleted
function calculateTotals(tablePrefix) {
    const individualSections = ['afpfc-paid', 'not-entitled', 'remaining-unpaid'];
    individualSections.forEach(section => {
        const principalNr = getTextContent(`${tablePrefix}${section}-principal-nr`);
        const beneficiaryNr = getTextContent(`${tablePrefix}${section}-beneficiary-nr`);
        const principalAmt = getTextContent(`${tablePrefix}${section}-principal-amt`);
        const beneficiaryAmt = getTextContent(`${tablePrefix}${section}-beneficiary-amt`);
        
        setTextContent(`total-${tablePrefix}${section}-nr`, principalNr + beneficiaryNr);
        setTextContent(`total-${tablePrefix}${section}-amt`, principalAmt + beneficiaryAmt);
    });

    const alphaPrincipalNr = getTextContent(`${tablePrefix}alpha-list-principal-nr`);
    const alphaBeneficiaryNr = getTextContent(`${tablePrefix}alpha-list-beneficiary-nr`);
    const alphaPrincipalAmt = getTextContent(`${tablePrefix}alpha-list-principal-amt`);
    const alphaBeneficiaryAmt = getTextContent(`${tablePrefix}alpha-list-beneficiary-amt`);

    setTextContent(`total-${tablePrefix}alpha-nr`, alphaPrincipalNr + alphaBeneficiaryNr);
    setTextContent(`total-${tablePrefix}alpha-amt`, alphaPrincipalAmt + alphaBeneficiaryAmt);

    const payrollPrincipalAmt = getTextContent(`${tablePrefix}payroll-principal-amt`);
    const payrollBeneficiaryAmt = getTextContent(`${tablePrefix}payroll-beneficiary-amt`);

    setTextContent(`total-${tablePrefix}payroll-amt`, payrollPrincipalAmt + payrollBeneficiaryAmt);

    let payrollPrincipalNr = 0, payrollBeneficiaryNr = 0;
    individualSections.forEach(section => {
        payrollPrincipalNr += getTextContent(`${tablePrefix}${section}-principal-nr`);
        payrollBeneficiaryNr += getTextContent(`${tablePrefix}${section}-beneficiary-nr`);
    });

    setTextContent(`${tablePrefix}payroll-principal-nr`, payrollPrincipalNr);
    setTextContent(`${tablePrefix}payroll-beneficiary-nr`, payrollBeneficiaryNr);
    setTextContent(`total-${tablePrefix}payroll-nr`, payrollPrincipalNr + payrollBeneficiaryNr);
}

//grand totals
function calculateGrandTotals() {
    const sections = ['payroll', 'afpfc-paid', 'not-entitled', 'remaining-unpaid'];
    sections.forEach(section => {
        const totalNr = getTextContent(`total-${section}-nr`) + getTextContent(`total-deleted-${section}-nr`);
        const totalAmt = getTextContent(`total-${section}-amt`) + getTextContent(`total-deleted-${section}-amt`);

        setTextContent(`grand-total-${section}-nr`, totalNr);
        setTextContent(`grand-total-${section}-amt`, totalAmt);
    });
}

// para sa real-time updates
function attachEventListenersForRealTimeUpdates(tableId) {
    const editableCells = document.querySelectorAll(`#${tableId} [contenteditable="true"]`);
    
    editableCells.forEach(cell => {
        cell.addEventListener('input', function() {
            const tablePrefix = tableId === 'table_1' ? '' : 'deleted-';
            calculateTotals(tablePrefix);
            calculateGrandTotals(); // Update grand totals on input
        });
    });
}

// for both tables
function updateCalculations() {
    calculateTotals('');
    calculateTotals('deleted-');
    calculateGrandTotals();
}


// "Paid" section in the recap tables
function calculatePaidRecapTotals() {
    function getContentValue(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error('Element not found for ID:', id);
            return 0;
        }
        const value = element.textContent.replace(/,/g, '');
        return parseFloat(value) || 0;
    }

    const inAlphaNr = getContentValue('alpha-list-recap-nr-in');
    const inAlphaAmt = getContentValue('alpha-list-recap-amt-in');
    const notInAlphaNr = getContentValue('alpha-list-recap-nr-not-in');
    const notInAlphaAmt = getContentValue('alpha-list-recap-amt-not-in');

    const totalNr = inAlphaNr + notInAlphaNr;
    const totalAmt = inAlphaAmt + notInAlphaAmt;

    document.getElementById('total-alpha-recap-nr').textContent = totalNr.toFixed(2).toLocaleString();
    document.getElementById('total-alpha-recap-amt').textContent = totalAmt.toFixed(2).toLocaleString();
}


// calculate totals sa page load
document.addEventListener('DOMContentLoaded', function() {
    attachEventListenersForRealTimeUpdates('table_1');
    attachEventListenersForRealTimeUpdates('table_2');
    updateCalculations();
    document.getElementById('update-button').addEventListener('click', updateCalculations);

    // Delay the initial calculation to ensure all elements are fully loaded
    setTimeout(calculatePaidRecapTotals, 500);
    
    document.querySelectorAll('.recap-table [contenteditable="true"]').forEach(cell => {
        cell.addEventListener('input', calculatePaidRecapTotals);
    });
});

//calculate and update totals para sa "Paid" section secondd table
function updatePaidSecondTableTotals() {
    const DBMClaims = getTextContent('DBM-nr-claims');
    const DBMAmount = getTextContent('DBM-amt');
    const AFPFCClaims = getTextContent('AFPFC-nr-claims');
    const AFPFCAmount = getTextContent('AFPFC-amt');

    const totalClaims = DBMClaims - AFPFCClaims;
    const totalAmount = DBMAmount - AFPFCAmount;

    setTextContent('total-nr-claims', totalClaims);
    setTextContent('total-amt', totalAmount);
}

// for real-time updates
document.addEventListener('DOMContentLoaded', function() {
    const paidCells = document.querySelectorAll('#DBM-nr-claims, #DBM-amt, #AFPFC-nr-claims, #AFPFC-amt');
    paidCells.forEach(cell => {
        cell.addEventListener('input', updatePaidSecondTableTotals);
    });
    updatePaidSecondTableTotals();
});

// calculate totals the "UNPAID" section
function calculateUnpaidTotals() {

    const unpaidActiveNr = getTextContent('unpaid-active-nr');
    const unpaidActiveAmt = getTextContent('unpaid-active-amt');
    const unpaidMoniesNr = getTextContent('unpaid-monies-nr');
    const unpaidMoniesAmt = getTextContent('unpaid-monies-amt');


    const totalUnpaidNr = unpaidActiveNr + unpaidMoniesNr;
    const totalUnpaidAmt = unpaidActiveAmt + unpaidMoniesAmt;


    setTextContent('total-unpaid-nr', totalUnpaidNr);
    setTextContent('total-unpaid-amt', totalUnpaidAmt);
}

//  UNPAID input cells for real-time updates
document.addEventListener('DOMContentLoaded', function() {
    const unpaidCells = document.querySelectorAll('#unpaid-active-nr, #unpaid-active-amt, #unpaid-monies-nr, #unpaid-monies-amt');
    unpaidCells.forEach(cell => {
        cell.addEventListener('input', calculateUnpaidTotals);
    });
    calculateUnpaidTotals();
});

//est. deficit 
document.addEventListener('DOMContentLoaded', function() {
    calculateDeficit();
    setTimeout(attachDeficitListeners, 500);
});

function attachDeficitListeners() {
    const paidAmountInputs = ['DBM-amt', 'AFPFC-amt'];
    const unpaidAmountInputs = [ 'unpaid-monies-amt','unpaid-active-amt'];

    paidAmountInputs.forEach(id => {
        const element = document.getElementById(id);
        if(element) {
            element.addEventListener('input', calculateDeficit);
        } else {
            console.error(`Element with ID ${id} not found`);
        }
    });

    unpaidAmountInputs.forEach(id => {
        const element = document.getElementById(id);
        if(element) {
            element.addEventListener('input', calculateDeficit);
        } else {
            console.error(`Element with ID ${id} not found`);
        }
    });
}

function calculateDeficit() {
    const remainingClaimsFund = getTextContent('total-amt');
    const totalUnpaid = getTextContent('total-unpaid-amt');

    const deficit = totalUnpaid - remainingClaimsFund; // Calculate deficit
    setTextContent('total-deficit-amt', deficit);
}

//yearsht
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        attachYearDivListeners();
        calculateYearDivPercentages();
    }, 1000);
});

function attachYearDivListeners() {
    const yearDivAmountInputs = document.querySelectorAll('.year-div .amount');
    yearDivAmountInputs.forEach(input => {
        input.addEventListener('input', calculateYearDivPercentages);
    });
}

function calculateYearDivPercentages() {
    const yearDivAmountInputs = document.querySelectorAll('.year-div .amount');
    const notInPayrollAmount = parseFloat(getTextContent('grand-total-payroll-amt'));

    yearDivAmountInputs.forEach(input => {
        const amount = parseFloat(input.textContent.replace(/,/g, '')) || 0;
        const percentCell = input.closest('tr').querySelector('.percent');
        if (notInPayrollAmount === 0 || isNaN(notInPayrollAmount)) {
            percentCell.textContent = 'N/A';
        } else {
            const percentage = (amount / notInPayrollAmount) * 100;
            percentCell.textContent = percentage.toFixed(2);
        }
    });
}




// end of calculation

//edit mode on the title
function toggleEditTitle() {
    var title = document.getElementById('page-month');
    var isEditable = title.contentEditable === "true";
    title.contentEditable = !isEditable;
    title.focus();
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
