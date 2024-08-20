// @ts-nocheck
import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import LogTracer from "./tracers/LogTracer";
import Scheduler from "./Scheduler";

const array1DTracer = new Array1DTracer("Array");
const logTracer = new LogTracer("Log");
const scheduler = new Scheduler(array1DTracer, logTracer);

const array = new Array1DRandomizer(10, 0, 10).array;

function BubbleSort(array: Array<number>): void {
    const n = array.length;

    array1DTracer.nop();
    logTracer.print(`Initial array - [${array.join(", ")}]`);

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            array1DTracer.select([i, j]);
            logTracer.print(`i: ${i}, j: ${j}`);
            array1DTracer.unselect([i, j], false);

            array1DTracer.nop();
            logTracer.print(`Comparing indexes j and j + 1: ${array[j]} and ${array[j + 1]}`);

            if (array[j] > array[j + 1]) {
                array1DTracer.swap(j, j + 1);
                logTracer.print(`Swapping indexes j and j + 1: ${array[j]} and ${array[j + 1]}`);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                array1DTracer.nop();
                logTracer.print(`Updated array - [${array.join(", ")}]`);
            }
        }
    }

    array1DTracer.captureState();
    logTracer.print(`Sorted array - [${array.join(", ")}]`);
}

(function main() {
    array1DTracer.setArray(array);

    BubbleSort(array);

    console.log(scheduler.generateSchedules());
})();