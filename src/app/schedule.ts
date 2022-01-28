export interface Schedule {
    enable: boolean;
    id: number;
    starttime: string;
    stations: Array<string>;
    stoptime: string;
    title: string;
}
