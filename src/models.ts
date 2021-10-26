export interface TimeEntry {
    description: string
    startDate: Date
    endDate: Date
    duration: number
}

export interface Asana {
    name: string
    dateLearned: Date
}

export interface State {
    timeEntries: TimeEntry[],
    asana: Asana[]
}