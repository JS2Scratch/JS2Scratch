declare module "scratch:constants" {
    global {
        var X: number;
        var Y: number;
        var Direction: number;

        var Size: number;

        var Volume: number;
        var Answer: string;
        var MouseX: number;
        var MouseY: number;
        var Loudness: number;
        var Timer: number;
        var DaysSince2000: number;
        var Username: string;
    }
    export = globalThis.constants;
}
