import React from 'react';
import { Asana, Moonday, State, TimeEntry } from '../types';

export const LoadState = () => {
    const [state, setState] = React.useState<State | null>(null);

    React.useEffect(() => {
        const fetchState = async () => {
            const [csvAsana, csvTimeEntries, csvMoondays] = await Promise.all([
                fetch('/asana.csv').then((res) => res.text()),
                fetch('/practice.csv').then((res) => res.text()),
                fetch('/moon.csv').then((res) => res.text()),
            ]);

            const asana: Asana[] = csvAsana.split(/\r\n|\n/).map((entry) => {
                const entryComponents = entry.split(',');
                return {
                    name: entryComponents[0],
                    dateLearned: new Date(entryComponents[1]),
                    series: entryComponents[2] == '2' ? 'intermediate' : 'primary'
                };
            });

            const timeEntries: TimeEntry[] = csvTimeEntries.split(/\r\n|\n/).map((entry: string) => {
                const entryComponents = entry.split(',');
                const startDate = new Date(entryComponents[1]);
                const endDate = new Date(entryComponents[2]);
                return {
                    description: entryComponents[0],
                    startDate: startDate,
                    endDate: endDate,
                    duration: Math.abs(endDate.getTime() - startDate.getTime()),
                };
            });

            const moondays: Moonday[] = csvMoondays.split(/\r\n|\n/).map((entry: string) => {
                const entryComponents = entry.split(',');
                const date = new Date(entryComponents[0]);
                const kind = entryComponents[1] == 'new' ? 'new' : 'full';
                return {
                    date: date,
                    kind: kind,
                };
            });

            setState({
                asana,
                timeEntries,
                moondays
            });
        };
        fetchState();
    }, []);

    return state;
};
