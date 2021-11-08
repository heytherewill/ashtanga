import React from 'react';
import { ChartCanvas } from './ChartCanvas';
import { ChartConfiguration } from 'chart.js/auto';
import { TimeEntry } from '../types';
import { Colors, useColors } from '../data/colors';

function getTypesOfPracticeDoughnutChart(timeEntries: TimeEntry[], colors: Colors): ChartConfiguration<'doughnut'> {
    const labels: string[] = [];
    const typesOfPractice = timeEntries.reduce((acc, te) => {
        const group = te.description;
        if (!labels.some((x) => x == group)) {
            acc[labels.length] = 0;
            labels.push(group);
        }

        const labelIndex = labels.indexOf(group);
        acc[labelIndex] += te.duration / 1000 / 60 / 24;

        return acc;
    }, [] as number[]);

    return {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: typesOfPractice,
                    borderColor: colors.chartBorder,
                    hoverOffset: 4,
                    backgroundColor: [ '#22b1eb', '#0692cd', '#42c5f8'],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    };
}

interface TypeOfPracticeChartProps {
    timeEntries: TimeEntry[];
}

export const TypeOfPracticeChart = ({ timeEntries }: TypeOfPracticeChartProps) => {
    const colors = useColors();
    return (
        <React.Fragment>
            <h1>Types of Practice</h1>
            <ChartCanvas {...getTypesOfPracticeDoughnutChart(timeEntries, colors)} />
        </React.Fragment>
    );
};
