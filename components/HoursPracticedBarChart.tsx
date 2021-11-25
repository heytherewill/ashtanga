import React from 'react';
import { Asana, TimeEntry } from '../types';
import { ChartCanvas } from './ChartCanvas';
import groupBy from 'lodash.groupby';
import { Colors, useColors } from '../data/colors';
import { ChartConfiguration } from 'chart.js/auto';
import { formatHoursForDisplay } from './Common';

function getHoursPracticedPerMonthBarChart(
    asana: Asana[],
    timeEntries: TimeEntry[],
    colors: Colors,
) : ChartConfiguration<'bar' | 'line'> {
    const groupFormatting = { month: 'short' } as const;
    const groupedTimeEntries = groupBy(timeEntries, (te) => te.startDate.toLocaleString('en-us', groupFormatting));
    const hoursPracticedPerMonth = Object.fromEntries(
        Object.entries(groupedTimeEntries).map(([key, value]) => {
            const totalHoursPracticeInGroup = value
                .map((te) => te.duration / 1000 / 60 / 24)
                .reduce((a, b) => a + b);
            return [ key, totalHoursPracticeInGroup ];
        })
    );

    return {
        type: 'bar',
        data: {
            labels: Object.keys(hoursPracticedPerMonth),
            datasets: [
                {
                    type: 'line',
                    data: Object.values(hoursPracticedPerMonth),
                    fill: false,
                    backgroundColor: colors.primary,
                    tension: 0.1,
                },
                {
                    type: 'bar',
                    data: Object.values(hoursPracticedPerMonth),
                    backgroundColor: colors.primary,
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
                            return formatHoursForDisplay(rawHours);
                        },
                    },
                },
                legend: { display: false },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                        color: colors.chartBorder,
                    },
                    ticks: {
                        color: colors.onBackground,
                    },
                },
                y: {
                    grid: {
                        drawBorder: false,
                        color: colors.chartBorder,
                    },
                    ticks: {
                        color: colors.onBackground,
                    },
                },
            },
        },
    };
}

interface HoursPracticedBarChartProps {
    timeEntries: TimeEntry[];
    asana: Asana[];
}

export const HoursPracticedBarChart = ({ timeEntries, asana }: HoursPracticedBarChartProps) => {
    const colors = useColors();
    return (
        <React.Fragment>
            <h1>Hours Practiced</h1>
            <ChartCanvas {...getHoursPracticedPerMonthBarChart(asana, timeEntries, colors)} />
        </React.Fragment>
    );
};
