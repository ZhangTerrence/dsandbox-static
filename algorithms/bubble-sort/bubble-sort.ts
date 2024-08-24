// @ts-nocheck
import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import LogTracer from "./tracers/LogTracer";
import Scheduler from "./Scheduler";

const array1DTracer = new Array1DTracer("Array");
const logTracer = new LogTracer("Log");

function BubbleSort(array: Array<number>): void {
    const n = array.length;

    logTracer.print(`initial array - [${array.join(", ")}]`);
    array1DTracer.captureState();

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            logTracer.print("comparing indexes j and j + 1");
            array1DTracer.select([j, j + 1], {
                i: i,
                j: j,
            });
            if (array[j] > array[j + 1]) {
                logTracer.print("swapping values at indexes j and j + 1");
                array1DTracer.swap(j, j + 1, {
                    i: i,
                    j: j
                });
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                logTracer.print(`updated array - [${array.join(", ")}]`);
                array1DTracer.captureState({
                    i: i,
                    j: j,
                });
            }
        }
    }

    logTracer.print(`sorted array - [${array.join(", ")}]`);
    array1DTracer.captureState();
}

(function main() {
    array1DTracer.setArray((new Array1DRandomizer(10, 0, 10)).getArray());
    BubbleSort(array);
    (new Scheduler(array1DTracer, logTracer)).run();
})();