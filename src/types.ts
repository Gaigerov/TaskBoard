export interface Task {
    [x: string]: unknown;
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: string;
}
