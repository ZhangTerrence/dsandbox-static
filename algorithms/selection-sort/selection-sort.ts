// @ts-nocheck
import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import LogTracer from "./tracers/LogTracer";
import Scheduler from "./Scheduler";

const array1DTracer = new Array1DTracer("Array");
const logTracer = new LogTracer("Log");

function SelectionSort(array: Array<number>): void {
    const n = array.length;

    logTracer.print(`initial array - [${array.join(", ")}]`);
    array1DTracer.captureState();

    for (let i = 0; i < n; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            logTracer.print("comparing indexes j and minIndex");
            array1DTracer.select([j, j + 1], {
                i: i,
                j: j,
                minIndex: minIndex
            });
            if (array[j] < array[minIndex]) {
                logTracer.print("setting index minIndex to index j");
                array1DTracer.captureState({
                    i: i,
                    j: j,
                    minIndex: j,
                });
                minIndex = j;
            }
        }

        logTracer.print("swapping values at indexes i and minIndex");
        array1DTracer.swap(i, minIndex, {
            i: i,
            j: j,
            minIndex: minIndex,
        });
        [array[i], array[minIndex]] = [array[minIndex], array[i]];

        logTracer.print(`updated array - [${array.join(", ")}]`);
        array1DTracer.captureState({
            i: i,
            j: j,
        });
    }

    logTracer.print(`sorted array - [${array.join(", ")}]`);
    array1DTracer.captureState();
}

(function main() {
    array1DTracer.setArray(new Array1DRandomizer(10, 0, 10).getArray());
    SelectionSort(array);
    (new Scheduler(array1DTracer, logTracer)).run();
})();