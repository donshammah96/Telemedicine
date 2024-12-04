const ctx = document.getElementById('iotDataChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Add timestamps here
        datasets: [{
            label: 'IoT Data',
            data: [], // Add data points here
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                }
            }
        }
    }
});

// Fetch data from the server and update the chart
async function fetchData() {
    const response = await fetch('/api/iot-data');
    const data = await response.json();
    chart.data.labels = data.timestamps;
    chart.data.datasets[0].data = data.values;
    chart.update();
}