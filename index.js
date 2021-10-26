(function app() {

    let chartConfigurations = [];

    Chart.defaults.font.family = "'Zen Maru Gothic', sans-serif";

    Promise.all([
        fetch("practice.csv").then(response => response.text()),
        fetch("asana.csv").then(response => response.text()),
    ]).then(fetchedData => parseFilesAsData(fetchedData));

    function parseFilesAsData(fetchedData) {
        const rawTimeEntries = fetchedData[0];
        const rawAsana = fetchedData[1];
        const timeEntries = rawTimeEntries.split(/\r\n|\n/).map(entry => {
            const entryComponents = entry.split(',');
            const startDate = new Date(entryComponents[1]);
            const endDate = new Date(entryComponents[2]);
            return {
                description: entryComponents[0],
                startDate: startDate,
                endDate: endDate,
                duration: Math.abs(endDate - startDate)
            }
        });

        const asana = rawAsana.split(/\r\n|\n/).map(entry => {
            const entryComponents = entry.split(',');
            return {
                name: entryComponents[0],
                dateLearned: new Date(entryComponents[1])
            }
        });

        loadGraphs(asana, timeEntries);
    }

    function loadGraphs(asana, timeEntries) {

        chartConfigurations = [ 
            getHoursPracticedPerMonthBarChart(asana, timeEntries),
        ];

        const context = document.getElementById('chart');
        new Chart(context, chartConfigurations[0]);
    }

    function getHoursPracticedPerMonthBarChart(asana, timeEntries) {

        const groupFormatting = { month:'short' };
        const hoursPracticedPerMonth = timeEntries.reduce((acc, te) => {
            const group = te.startDate.toLocaleString('en-us', groupFormatting);
            if (!acc[group]) {
                acc[group] = 0;
            }
            
            acc[group] += te.duration / 1000 / 60 / 24;
            
            return acc;
        }, {});

        const configuration = {
            data: {
                datasets: [{
                    type: 'line',
                    label: {
                        display: false
                    },
                    data: hoursPracticedPerMonth,
                    fill: false,
                    backgroundColor: '#BF94E4',
                    tension: 0.1
                }, {
                    type: 'bar',
                    data: hoursPracticedPerMonth,
                    fill: false,
                    backgroundColor: '#BF94E4',
                    tension: 0.1
                } ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: data => 'Hours practiced in ' + data[0].label,
                            afterLabel: context => {
                                const month = context.parsed.x;
                                const asanaLearnedInMonth = asana
                                    .filter(a => a.dateLearned.getMonth() == month)
                                    .map(a => a.name);

                                return asanaLearnedInMonth.length == 0 
                                    ? "No new asana learned in that month" 
                                    : ('Asana learned in that month: ' + asanaLearnedInMonth.join(", "))
                            },
                            label: context => {
                                const rawHours = context.parsed.y;
                                const fullHours = parseInt(rawHours);
                                const remainder = rawHours - fullHours;
                                const minutes = parseInt(60 * remainder);

                                return fullHours + 'h' + String(minutes).padStart(2, '0');
                            }
                        }
                    },
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    }
                }
            }
        };

        return configuration;
    }
})();