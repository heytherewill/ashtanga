import React from 'react';
import { Asana, State, TimeEntry } from '../types';
import { ChartCanvas } from './ChartCanvas';
import { ChartConfiguration } from 'chart.js/auto';
import { _adapters, Chart, ChartDataset } from 'chart.js';
import { MatrixController, MatrixDataPoint, MatrixElement } from 'chartjs-chart-matrix';
import getDayOfYear from 'date-fns/getDayOfYear'
import setDayOfYear from 'date-fns/setDayOfYear'
import format from 'date-fns/format';
import changeColorAlpha from 'color-alpha'
import 'chartjs-adapter-date-fns';
import { Colors, useColors } from '../data/colors';

function daysInYear(year: number) : (365 | 366) {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    return isLeapYear ? 366 : 365;
}

function getDaysPracticedMatrixChart(
    timeEntries: TimeEntry[],
    colors: Colors
): ChartConfiguration<'matrix'> {

    var longestDuration = 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const hoursPracticedPerDayOfYear = timeEntries.reduce((acc, te) => 
    {
        const dayOfYear = getDayOfYear(te.startDate);
        const duration = te.duration / 1000 / 60;
        acc[dayOfYear] = duration;

        if (duration > longestDuration) {
            longestDuration = duration;
        }

        return acc
    }, [] as number[]);

    let zeData = Array(daysInYear(currentYear)).fill(null).map((_, index) => {

        const dateForIndex = setDayOfYear(now, index);
        const formattedDayOfWeek = format(dateForIndex, 'iiii');
        const formattedDate = format(dateForIndex, 'yyyy-MM-dd');

        return {
            y: formattedDayOfWeek,
            x: formattedDate,
            d: formattedDate,
            v: hoursPracticedPerDayOfYear[index] ?? 0
        };
    });

    const data = {
        datasets: [{
            data: zeData,
            backgroundColor: (context: { raw: { v: number; }; }) => {
                const duration = context.raw.v;
                if (duration == 0) {
                    return colors.chartBorder;
                }
                const alpha = context.raw.v / longestDuration;
                const result = changeColorAlpha(colors.foreground, alpha).toString();
                return result;
            },
            borderRadius: 3,
            borderWidth: 1,
            borderColor: (context: { raw: { v: number; }; }) => {
                const duration = context.raw.v;
                if (duration == 0) {
                    return colors.chartBorder;
                }
                const alpha = context.raw.v / longestDuration;
                const result = changeColorAlpha(colors.foreground, alpha).toString();
                return result;
            },
            hoverBackgroundColor: colors.foreground,
            hoverBorderColor: colors.foreground,
            //@ts-expect-error
            width: (context) => (context.chart.chartArea || {}).width / 62,
            //@ts-expect-error
            height: (context) => (context.chart.chartArea || {}).height / 12
        }]
    };

    const scales = {
        x: {
            type: 'time',
            left: 'left',
            offset: true,
            time: {
                unit: 'week',
                round: 'week',
                isoWeekday: 1,
                displayFormats: {
                    month: 'MMM'
                }
            },
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                padding: 10,
            },
            grid: {
                display: false,
                drawBorder: false,
            },
            title: {
                display: false
            }
        },
        y: {
            type: 'time',
            position: 'left',
            offset: true,
            time: {
                unit: 'day',
                parser: 'iiii',
                isoWeekday: 1,
                displayFormats: {
                    day: 'iii'
                }
            },
            
            reverse: true,
            ticks: {
                padding: 10,
                maxRotation: 0,
                fontSize: 10
                
            },
            grid: {
                display: false,
                drawBorder: false,
            }
        }
    };

    const options = {
        aspectRatio: 4.5,
        plugins: {
            legend: false,
            tooltip: {
                displayColors: false,
                callbacks: {
                    title() {
                        return '';
                    },
                    // @ts-expect-error
                    label(context) {
                        const v = context.dataset.data[context.dataIndex];
                        return ['d: ' + v.d, 'v: ' + v.v.toFixed(2)];
                    }
                }
            },
        },
        scales: scales,
        layout: {
            padding: {
                top: 10,
            }
        }
    };
    
    return {
        type: 'matrix',
        // @ts-expect-error
        data: data,
        // @ts-expect-error
        options: options
    };
}

interface DaysPracticedMatrixChartProps {
    timeEntries: TimeEntry[];
}

export const DaysPracticedMatrixChartProps = ({ timeEntries }: DaysPracticedMatrixChartProps) => {
    Chart.register(MatrixController, MatrixElement);
    const colors = useColors();
    return (
        <React.Fragment>
            <h1>Days Practiced</h1>
            <ChartCanvas {...getDaysPracticedMatrixChart(timeEntries, colors)} />
        </React.Fragment>
    );
};
