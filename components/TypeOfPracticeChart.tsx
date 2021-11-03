import React from 'react';
import { State } from '../types';
import { ChartCanvas } from './ChartCanvas';
import { ChartConfiguration } from 'chart.js/auto';
import { TimeEntry } from '../types';

function getTypesOfPracticeDoughnutChart(timeEntries: TimeEntry[]): ChartConfiguration<'doughnut'> {
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
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                    hoverOffset: 4,
                },
            ],
        },
    };
}

interface TypeOfPracticeChartProps {
    timeEntries: TimeEntry[];
}

export const TypeOfPracticeChart = ({timeEntries}: TypeOfPracticeChartProps,) => {
    return (
        <React.Fragment>
            <h1>Types of Practice</h1>
            <ChartCanvas {...getTypesOfPracticeDoughnutChart(timeEntries)} />
        </React.Fragment>
    );
};
