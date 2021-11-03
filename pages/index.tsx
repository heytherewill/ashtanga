import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { HoursPracticedChart } from '../components/HoursPracticedChart';
import { TypeOfPracticeChart } from '../components/TypeOfPracticeChart';
import { LoadState } from '../data/loadState';

const Home: NextPage = () => {
    const state = LoadState();

    return (
        <React.Fragment>
            <Head>
                <title>{"Will's Yoga Statistics"}</title>
            </Head>

            <div id="container">
                {!state && <h1>Loading...</h1>}
                {state && (
                    <React.Fragment>
                        <HoursPracticedChart asana={state.asana} timeEntries={state.timeEntries} />
                        <TypeOfPracticeChart timeEntries={state.timeEntries} />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default Home;
