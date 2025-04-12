let selectedOption = null;
let rollNumber = '';

function askForRollNumber(option) {
    selectedOption = option;
    document.getElementById('rollNumberModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('rollNumberModal').style.display = 'none';
    document.getElementById('error-message').innerText = '';
}

function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('password-error-message').innerText = '';
    document.getElementById('passwordInput').value = '';
}

function submitRollNumber() {
    rollNumber = document.getElementById('rollNumberInput').value.trim();
    if (!rollNumber) {
        document.getElementById('error-message').innerText = 'Roll number is required';
        return;
    }

    fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: selectedOption, rollNumber })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showMessage('Vote submitted successfully!');
        } else {
            showMessage(data.error, true);
        }
        closeModal();
    });
}

function showMessage(msg, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.style.color = isError ? 'red' : 'green';
    messageDiv.innerText = msg;
    setTimeout(() => messageDiv.innerText = '', 4000);
}

function askForPassword(isReset = false) {
    document.getElementById('passwordModal').style.display = 'block';
    document.getElementById('passwordModal').dataset.reset = isReset;
}

function submitPassword() {
    const password = document.getElementById('passwordInput').value;
    const isReset = document.getElementById('passwordModal').dataset.reset === "true";

    if (isReset) {
        fetch('http://localhost:3000/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage('Voting has been reset');
                fetchResults();
            } else {
                document.getElementById('password-error-message').innerText = data.error;
            }
        });
    } else {
        fetchResults(password);
    }

    closePasswordModal();
}

function fetchResults(password = '') {
    fetch('http://localhost:3000/results')
        .then(res => res.json())
        .then(data => {
            const { option1, option2, option3 } = data;

            document.getElementById('result-option1').style.display = 'flex';
            document.getElementById('result-option2').style.display = 'flex';
            document.getElementById('result-option3').style.display = 'flex';

            document.getElementById('option1-votes').innerText = option1;
            document.getElementById('option2-votes').innerText = option2;
            document.getElementById('option3-votes').innerText = option3;

            document.getElementById('graph-container').style.display = 'block';
            drawChart(option1, option2, option3);
        });
}

function drawChart(opt1, opt2, opt3) {
    const ctx = document.getElementById('voteGraph').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Option 1', 'Option 2', 'Option 3'],
            datasets: [{
                label: 'Votes',
                data: [opt1, opt2, opt3],
                backgroundColor: ['#007BFF', '#28A745', '#FFC107']
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
function askForPassword(isReset = false) {
    document.getElementById('passwordModal').style.display = 'block';
    document.getElementById('passwordModal').dataset.reset = isReset;
}

function submitPassword() {
    const password = document.getElementById('passwordInput').value;
    const isReset = document.getElementById('passwordModal').dataset.reset === "true";

    if (isReset) {
        fetch('http://localhost:3000/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage('Voting has been reset');
                fetchResults();
            } else {
                document.getElementById('password-error-message').innerText = data.error;
            }
        });
    } else {
        fetchResults(password);
    }

    closePasswordModal();
}
