async function checkSymptoms() {
    const response = await fetch('/ai/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: 'headache, fever' })
    });
    const data = await response.json();
    document.getElementById('aiResults').innerText = JSON.stringify(data);
}

async function determineTriage() {
    const response = await fetch('/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptomData: 'headache, fever' })
    });
    const data = await response.json();
    document.getElementById('aiResults').innerText = JSON.stringify(data);
}

async function predictTrends() {
    const response = await fetch('/ai/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historicalData: 'past data' })
    });
    const data = await response.json();
    document.getElementById('aiResults').innerText = JSON.stringify(data);
}