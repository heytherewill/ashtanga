import React from 'react';
import { Moonday, TimeEntry } from '../types';
import { ChartCanvas } from './ChartCanvas';
import { ChartConfiguration } from 'chart.js/auto';
import { _adapters, Chart, TooltipItem } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import getDayOfYear from 'date-fns/getDayOfYear'
import setDayOfYear from 'date-fns/setDayOfYear'
import format from 'date-fns/format';
import changeColorAlpha from 'color-alpha'
import 'chartjs-adapter-date-fns';
import { Colors, useColors } from '../data/colors';
import { formatHoursForDisplay } from './Common';
import { isSameDay } from 'date-fns';

function daysInYear(year: number) : (365 | 366) {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    return isLeapYear ? 366 : 365;
}

function colorWithProportionalAlpha(color: string, value: number, maxValue: number) : string {
    const alpha = value / maxValue;
    const result = changeColorAlpha(color, alpha).toString();
    return result;
}

function getDaysPracticedMatrixChart(
    timeEntries: TimeEntry[],
    moondays: Moonday[],
    colors: Colors
): ChartConfiguration<'matrix'> {

    var longestDuration = 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const hoursPracticedPerDayOfYear = timeEntries.reduce((acc, te) => 
    {
        const dayOfYear = getDayOfYear(te.startDate);
        const duration = te.duration / 1000 / 60 / 24;
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
            x: formattedDate
        };
    });

    const data = {
        datasets: [{
            data: zeData,
            backgroundColor: (context: { dataIndex: number; }) => {
                const dayOfYear = setDayOfYear(now, context.dataIndex);
                const isMoonday = moondays.some(m => isSameDay(m.date, dayOfYear))
                if (isMoonday)
                    return colors.moondays;
                
                const hoursPracticed = hoursPracticedPerDayOfYear[context.dataIndex] ?? 0;
                if (hoursPracticed == 0)
                    return colors.chartBorder;

                return colorWithProportionalAlpha(colors.primary, hoursPracticed, longestDuration);
            },
            borderRadius: 3,
            borderWidth: 2,
            borderColor: (context: { dataIndex: number; }) => {
                const dayOfYear = setDayOfYear(now, context.dataIndex);
                const isMoonday = moondays.some(m => isSameDay(m.date, dayOfYear))
                const hoursPracticed = hoursPracticedPerDayOfYear[context.dataIndex] ?? 0;

                return hoursPracticed == 0
                    ? (isMoonday ? colors.moondays : colors.chartBorder)
                    : colorWithProportionalAlpha(colors.primary, hoursPracticed, longestDuration);
            },
            hoverBackgroundColor: colors.primary,
            hoverBorderColor: colors.primary,
            // @ts-expect-error
            width: (context) => (context.chart.chartArea || {}).width / 62,
            // @ts-expect-error
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
                    title: () => '',
                    label: (context: TooltipItem<'matrix'>) => {
                        const dayOfYear = setDayOfYear(now, context.dataIndex);
                        const moonday = moondays.find(m => isSameDay(m.date, dayOfYear))
                        const moondayInfo = moonday == undefined ? [] : [ 'This is a ' + moonday.kind + ' moon day.' ]

                        const hoursPracticed = hoursPracticedPerDayOfYear[context.dataIndex] ?? 0;
                        const practiceInfo = hoursPracticed == 0 
                            ? [ 'No practice registered for this day.' ] 
                            : [ 'Practiced for ' + formatHoursForDisplay(hoursPracticed) ];

                        return moondayInfo.concat(practiceInfo);
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
    moondays: Moonday[];
}

export const DaysPracticedMatrixChart = ({ timeEntries, moondays, }: DaysPracticedMatrixChartProps) => {
    Chart.register(MatrixController, MatrixElement);
    const colors = useColors();
    return (
        <React.Fragment>
            <h1>Days Practiced</h1>
            <ChartCanvas {...getDaysPracticedMatrixChart(timeEntries, moondays, colors)} />
        </React.Fragment>
    );
};
