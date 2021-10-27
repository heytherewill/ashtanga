import { ChartConfiguration } from 'chart.js/auto';
import groupBy from 'lodash.groupby';
import { getColors } from '../data/colors';
import { State } from '../types';

export function getHoursPracticedPerMonthBarChart({ asana, timeEntries }: State): ChartConfiguration<'bar' | 'line'> {
    const groupFormatting = { month: 'short' } as const;
    const hoursPracticedPerMonth = Object.fromEntries(
        Object.entries(groupBy(timeEntries, (te) => te.startDate.toLocaleString('en-us', groupFormatting))).map(
            ([key, value]) => [key, value.map((te) => te.duration / 1000 / 60 / 24).reduce((a, b) => a + b)],
        ),
    );

    const colors = getColors()

    return {
        type: 'bar',
        data: {
            labels: Object.keys(hoursPracticedPerMonth),
            datasets: [
                {
                    type: 'line',
                    data: Object.values(hoursPracticedPerMonth),
                    fill: false,
                    backgroundColor: colors.foreground,
                    tension: 0.1,
                },
                {
                    type: 'bar',
                    data: Object.values(hoursPracticedPerMonth),
                    backgroundColor: colors.foreground,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (data) => 'Hours practiced in ' + data[0].label,
                        afterLabel: (context) => {
                            const month = context.parsed.x;
                            const asanaLearnedInMonth = asana
                                .filter((a) => a.dateLearned.getMonth() == month)
                                .map((a) => a.name);

                            return asanaLearnedInMonth.length == 0
                                ? 'No new asana learned in that month'
                                : 'Asana learned in that month: ' + asanaLearnedInMonth.join(', ');
                        },
                        label: (context) => {
                            const rawHours = context.parsed.y;
                            const fullHours = Math.trunc(rawHours);
                            const remainder = rawHours - fullHours;
                            const minutes = Math.trunc(60 * remainder);

                            return fullHours + 'h' + String(minutes).padStart(2, '0');
                        },
                    },
                },
                legend: { display: false },
            },
            scales: {
                x: {
                    grid: { display: false },
                },
            },
        },
    };
}
