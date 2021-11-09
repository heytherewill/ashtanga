import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { DaysPracticedMatrixChartProps } from '../components/DaysPracticedMatrixChart';

import { HoursPracticedChart } from '../components/HoursPracticedChart';
import { TypeOfPracticeChart } from '../components/TypeOfPracticeChart';
import { LoadState } from '../data/loadState';

const Home: NextPage = () => {
    const state = LoadState();

    return (
        <React.Fragment>
            <Head>
                <title>{"Will's Ashtanga Stats"}</title>
            </Head>

            <div id="container">
                {!state && <h1>Loading...</h1>}
                {state && (
                    <React.Fragment>
                        <h1> { "Will's Ashtanga Stats" } </h1>
                        <b> { "As a practitioner of the Mysore style of Ashtanga Yoga," } </b>
                        <b> { "I (try to) practice the asana sequences 6 times a week." } </b>
                        <b> { "As a time tracking nerd, I have a ton of data about all my practice sessions." } </b>
                        <b> { "This page contains some charts extracted from that data." } </b>
                        <HoursPracticedChart asana={state.asana} timeEntries={state.timeEntries} />
                        <TypeOfPracticeChart timeEntries={state.timeEntries} />
                        <DaysPracticedMatrixChartProps timeEntries={state.timeEntries} />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default Home;
