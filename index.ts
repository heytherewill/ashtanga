import { Chart, ChartConfiguration, ChartItem } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import groupBy from 'lodash.groupby'

let chartConfigurations: ChartConfiguration[] = [];

Chart.register(MatrixController, MatrixElement);
Chart.defaults.font = { family: "'Zen Maru Gothic', sans-serif" } as const;

Promise.all([
    fetch("practice.csv").then(response => response.text()),
    fetch("asana.csv").then(response => response.text()),
]).then(fetchedData => parseFilesAsData(fetchedData));

function parseFilesAsData(fetchedData: [string, string]) {
    const rawTimeEntries = fetchedData[0];
    const rawAsana = fetchedData[1];
    const timeEntries: TimeEntry[] = rawTimeEntries.split(/\r\n|\n/).map((entry: string) => {
        const entryComponents = entry.split(',');
        const startDate = new Date(entryComponents[1]);
        const endDate = new Date(entryComponents[2]);
        return {
            description: entryComponents[0],
            startDate: startDate,
            endDate: endDate,
            duration: Math.abs(endDate.getTime() - startDate.getTime())
        }
    });

    const asana: Asana[] = rawAsana.split(/\r\n|\n/).map(entry => {
        const entryComponents = entry.split(',');
        return {
            name: entryComponents[0],
            dateLearned: new Date(entryComponents[1])
        }
    });

    loadGraphs(asana, timeEntries);
}

function loadGraphs(asana: Asana[], timeEntries: TimeEntry[]) {

    chartConfigurations = [ 
        getHoursPracticedPerMonthBarChart(asana, timeEntries),
        getTypesOfPracticeDoughnutChart(timeEntries),
    ];

    const context = document.getElementById('chart') as HTMLCanvasElement;
    new Chart(context, chartConfigurations[0]);
}

function getHoursPracticedPerMonthBarChart(asana: Asana[], timeEntries: TimeEntry[]) : ChartConfiguration {

    const groupFormatting = { month: 'short' } as const;
    const hoursPracticedPerMonth = 
        Object.fromEntries(
            Object.entries(
                groupBy(timeEntries, (te) => te.startDate.toLocaleString('en-us', groupFormatting))
            ).map(([key, value]) => [key, value.map(te => te.duration / 1000 / 60 / 24)])
        );

    return {
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
                                ? 'No new asana learned in that month' 
                                : ('Asana learned in that month: ' + asanaLearnedInMonth.join(', '))
                        },
                        label: context => {
                            const rawHours = context.parsed.y;
                            const fullHours = Math.trunc(rawHours);
                            const remainder = rawHours - fullHours;
                            const minutes = Math.trunc(60 * remainder);

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
}

function getTypesOfPracticeDoughnutChart(timeEntries: TimeEntry[]) : ChartConfiguration {

    const labels: string[] = []
    const typesOfPractice = timeEntries.reduce((acc, te) => {
        const group = te.description;
        if (!labels.some(x => x == group)) {
            acc[labels.length] = 0;
            labels.push(group);
        }
        
        const labelIndex = labels.indexOf(group);
        acc[labelIndex] += te.duration / 1000 / 60 / 24;
        
        return acc;
    }, []);


    return {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: typesOfPractice,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    };
}

interface TimeEntry {
    description: string
    startDate: Date
    endDate: Date
    duration: number
}

interface Asana {
    name: string
    dateLearned: Date
}