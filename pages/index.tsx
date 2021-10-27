import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { YogaChart } from '../components/YogaChart';
import { useCSVState } from '../data/useCSVState';

const Home: NextPage = () => {
    const state = useCSVState();

    return (
        <React.Fragment>
            <Head>
                <title>{"Will's Yoga Statistics"}</title>
            </Head>

            <h1>Hours Practiced</h1>
            <div id="container">
                {!state && <h1>Loading...</h1>}
                {state && <YogaChart state={state} type="bar" />}
            </div>
        </React.Fragment>
    );
};

export default Home;
