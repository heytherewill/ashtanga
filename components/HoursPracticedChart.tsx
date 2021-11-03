import React from 'react';
import { Asana, State, TimeEntry } from '../types';
import { ChartCanvas } from './ChartCanvas';
import groupBy from 'lodash.groupby';
import { getColors } from '../data/colors';
import { ChartConfiguration } from 'chart.js/auto';

export function getHoursPracticedPerMonthBarChart(asana: Asana[], timeEntries: TimeEntry[]): ChartConfiguration<'bar' | 'line'> {
    const groupFormatting = { month: 'short' } as const;
    const groupedTimeEntries = groupBy(timeEntries, (te) => te.startDate.toLocaleString('en-us', groupFormatting));
    const hoursPracticedPerMonth = Object.fromEntries(
        Object.entries(groupedTimeEntries).map(
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
                    grid: { 
                        display: false,
                        color: colors.chartBorder
                    },
                    ticks: {
                        color: colors.onBackground
                    }
                },
                y : {
                    grid: {
                        color: colors.chartBorder
                    },
                    ticks: {
                        color: colors.onBackground
                    }
                }
            },
        },
    };
}

interface HoursPracticedChartProps {
    timeEntries: TimeEntry[];
    asana: Asana[];
}

export const HoursPracticedChart = ({ timeEntries, asana }: HoursPracticedChartProps) => {
    return (
        <React.Fragment>
            <h1>Hours Practiced</h1>
            <ChartCanvas {...getHoursPracticedPerMonthBarChart(asana, timeEntries)} />
        </React.Fragment>
    );
};
