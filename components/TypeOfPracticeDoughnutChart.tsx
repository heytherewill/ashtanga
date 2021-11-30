import React from 'react';
import { ChartCanvas } from './ChartCanvas';
import { ChartConfiguration } from 'chart.js/auto';
import { TimeEntry } from '../types';
import { Colors, useColors } from '../data/colors';

function getTypesOfPracticeDoughnutChart(
    timeEntries: TimeEntry[],
    colors: Colors
): ChartConfiguration<'doughnut'> {
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
                    backgroundColor: [ colors.primary, colors.secondary, colors.tertiary ],
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            aspectRatio: 1.5,
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    };
}

interface TypeOfPracticeDoughnutChartProps {
    timeEntries: TimeEntry[];
}

export const TypeOfPracticeDoughnutChart = ({timeEntries}: TypeOfPracticeDoughnutChartProps) => {
    const colors = useColors();
    return (
        <React.Fragment>
            <h1>Types of Practice</h1>
            <div className="doughnut-container">
                <ChartCanvas {...getTypesOfPracticeDoughnutChart(timeEntries, colors)} />
            </div>
            <div className="legend">
                <h5 className="instructed"> Instructed</h5>
                <h5 className="solo"> Solo</h5>
                <h5 className="guided"> Guided</h5>
            </div>
        </React.Fragment>
    );
};
