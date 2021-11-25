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
