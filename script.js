document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    document.getElementById('upload').addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Form submitted');

        // Extract the values from input fields
        const stress = document.getElementById('stress').value;
        const systolic = document.getElementById('systolic').value;
        const diastolic = document.getElementById('diastolic').value;

        // Log the collected input data
        console.log('Collected data:', { stress, systolic, diastolic });

        // Create a payload (JSON) for the API
        const payload = {
            stress: stress,
            systolic: systolic,
            diastolic: diastolic
        };

        // Send the data to Flask backend
        fetch('http://127.0.0.1:58643/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)  // Send the data as JSON
        })
        .then(response => response.json())
        .then(result => {
            console.log('Result from backend:', result);
            displayResult(result);  // Display the result from Flask
            generateScatterPlot(stress, systolic, diastolic);  // Generate the scatter plot
            generateBarChart(stress, systolic, diastolic);     // Generate the bar chart
        })
        .catch(error => {
            console.error('Error during prediction:', error);
            document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
    });
});

// Function to display the result in the frontend
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Clear previous result

    if (result.error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
    } else {
        resultDiv.innerHTML = `<p>Predicted Activity Level: ${result.prediction}</p>`;
        // Update the color of the result box based on activity level
        if (result.prediction.includes("Low")) {
            resultDiv.className = "result-box low";
        } else if (result.prediction.includes("Good")) {
            resultDiv.className = "result-box good";
        } else {
            resultDiv.className = "result-box high";
        }
    }
}

// Global variables to track chart instances
let scatterChart;
let barChart;

// Function to generate scatter plot with the input values
function generateScatterPlot(stress, systolic, diastolic) {
    const ctx = document.getElementById('scatterPlot').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (scatterChart) {
        scatterChart.destroy();
    }

    // Create a new scatter chart
    scatterChart = new Chart(ctx, {
        type: 'bubble', // Bubble chart for scatter
        data: {
            datasets: [{
                label: 'Input Parameters',
                data: [
                    { x: 1, y: stress, r: 10 },  // Stress Level
                    { x: 2, y: systolic, r: 10 }, // Systolic BP
                    { x: 3, y: diastolic, r: 10 } // Diastolic BP
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 4,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'Parameter Type' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value' }
                }
            }
        }
    });
}

// Function to generate bar chart with the input values
function generateBarChart(stress, systolic, diastolic) {
    const ctx = document.getElementById('barChart').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (barChart) {
        barChart.destroy();
    }

    // Create a new bar chart
    barChart = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
            labels: ['Stress Level', 'Systolic BP', 'Diastolic BP'],
            datasets: [{
                label: 'Input Parameters',
                data: [stress, systolic, diastolic],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value' }
                }
            }
        }
    });
}
