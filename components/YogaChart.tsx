import React from 'react';
import { State } from '../types';
import { ChartCanvas } from './ChartCanvas';
import { getHoursPracticedPerMonthBarChart } from './getHoursPracticedPerMonthBarChart';
import { getTypesOfPracticeDoughnutChart } from './getTypesOfPracticeDoughnutChart';

interface YogaChartProps {
    type: 'bar' | 'doughnut';
    state: State;
}

export const YogaChart = ({ state, type }: YogaChartProps) => {
    return (
        <React.Fragment>
            {type === 'bar' && <ChartCanvas {...getHoursPracticedPerMonthBarChart(state)} />}
            {type === 'doughnut' && <ChartCanvas {...getTypesOfPracticeDoughnutChart(state.timeEntries)} />}
        </React.Fragment>
    );
};
