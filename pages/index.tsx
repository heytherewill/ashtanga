import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { DaysPracticedMatrixChart } from '../components/DaysPracticedMatrixChart';
import { HoursPracticedBarChart } from '../components/HoursPracticedBarChart';
import { TypeOfPracticeDoughnutChart } from '../components/TypeOfPracticeDoughnutChart';
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
                        <HoursPracticedBarChart asana={state.asana} timeEntries={state.timeEntries} />
                        <TypeOfPracticeDoughnutChart timeEntries={state.timeEntries} />
                        <DaysPracticedMatrixChart timeEntries={state.timeEntries} moondays={state.moondays} />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default Home;
