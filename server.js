const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = __dirname + '/votes.json';
const ADMIN_PASSWORD = 'admin123'; // Set your own

app.use(cors());
app.use(express.json());

// Initialize vote data
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        option1: 0,
        option2: 0,
        option3: 0,
        votedRollNumbers: []
    }, null, 2));
}

const readVotes = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveVotes = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Submit vote
app.post('/vote', (req, res) => {
    const { option, rollNumber } = req.body;
    const data = readVotes();

    if (!option || !rollNumber) return res.status(400).json({ error: 'Missing data' });
    if (data.votedRollNumbers.includes(rollNumber)) return res.status(400).json({ error: 'Already voted' });

    if (data[option] !== undefined) {
        data[option]++;
        data.votedRollNumbers.push(rollNumber);
        saveVotes(data);
        return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid option' });
});

// Get results
app.get('/results', (req, res) => {
    const data = readVotes();
    res.json({
        option1: data.option1,
        option2: data.option2,
        option3: data.option3
    });
});

// Reset (protected)
app.post('/reset', (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Incorrect password' });

    const data = {
        option1: 0,
        option2: 0,
        option3: 0,
        votedRollNumbers: []
    };
    saveVotes(data);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
