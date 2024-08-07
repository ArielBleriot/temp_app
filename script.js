document.addEventListener('DOMContentLoaded', function () {
    fetch('GlobalWeatherRepository.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('CSV Data:', data); // Log the raw CSV data
            const parsedData = parseCSV(data);
            console.log('Parsed Data:', parsedData); // Log the parsed data
            populateTable(parsedData);
            createLineChart(parsedData);
            createBarChart(parsedData);
            createBubbleChart(parsedData);
            createPieChart(parsedData); // Create the Pie Chart
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    function parseCSV(data) {
        const rows = data.split('\n').slice(1, 101); // Get the first 100 data records (excluding header)
        const countries = [];
        const temperatures = [];
        const humidities = [];
        const dates = [];
        const conditions = []; // Array to hold weather conditions

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length >= 19) { // Ensure there are enough columns
                const country = cols[0].trim(); // Country
                const temperature = parseFloat(cols[7].trim()); // Temperature in Celsius
                const humidity = parseFloat(cols[18].trim()); // Humidity
                const date = cols[6].trim(); // Last updated timestamp
                const condition = cols[9].trim(); // Weather condition

                countries.push(country);
                temperatures.push(temperature);
                humidities.push(humidity);
                dates.push(date);
                conditions.push(condition);
            }
        });

        console.log('Countries:', countries);
        console.log('Temperatures:', temperatures);
        console.log('Humidities:', humidities);
        console.log('Dates:', dates);
        console.log('Conditions:', conditions);

        return { countries, temperatures, humidities, dates, conditions };
    }

    function populateTable(data) {
        const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        data.dates.forEach((date, index) => {
            const row = tableBody.insertRow();
            const cellCountry = row.insertCell(0);
            const cellTemperature = row.insertCell(1);
            const cellHumidity = row.insertCell(2);
            const cellDate = row.insertCell(3);

            cellCountry.textContent = data.countries[index];
            cellTemperature.textContent = data.temperatures[index];
            cellHumidity.textContent = data.humidities[index];
            cellDate.textContent = date;
        });
    }

    function createLineChart(data) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: data.temperatures,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Humidity (%)',
                        data: data.humidities,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createBarChart(data) {
        const ctx = document.getElementById('barChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.dates,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: data.temperatures,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Humidity (%)',
                        data: data.humidities,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createBubbleChart(data) {
        const ctx = document.getElementById('bubbleChart').getContext('2d');
        const bubbleData = data.dates.map((date, index) => ({
            x: data.temperatures[index],
            y: data.humidities[index],
            r: 5
        }));

        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Temperature vs Humidity',
                    data: bubbleData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        }
                    }
                }
            }
        });
    }

    function createPieChart(data) {
        const ctx = document.getElementById('pieChart').getContext('2d');

        
        const countryCounts = data.countries.reduce((acc, country, index) => {
            if (!acc[country]) {
                acc[country] = {
                    count: 0,
                    temperature: data.temperatures[index],
                    humidity: data.humidities[index]
                };
            }
            acc[country].count += 1;
            return acc;
        }, {});


        const limitedCountries = Object.entries(countryCounts)
            .sort((a, b) => b[1].count - a[1].count) // Sort by occurrence count
            .slice(0, 15);

        const labels = limitedCountries.map(entry => entry[0]);
        const values = limitedCountries.map(entry => entry[1].count);
        const temperatures = limitedCountries.map(entry => entry[1].temperature);
        const humidities = limitedCountries.map(entry => entry[1].humidity);

        
        const pieData = {
            labels: labels,
            datasets: [{
                label: 'Country Occurrences',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const countryIndex = tooltipItem.dataIndex;
                                const country = labels[countryIndex];
                                const temperature = temperatures[countryIndex];
                                const humidity = humidities[countryIndex];
                                return `${country}: ${tooltipItem.raw} occurrences (Temp: ${temperature}°C, Humidity: ${humidity}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
});
