// @ts-nocheck
import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import LogTracer from "./tracers/LogTracer";
import Scheduler from "./Scheduler";

const array1DTracer = new Array1DTracer("Array");
const logTracer = new LogTracer("Log");
const scheduler = new Scheduler(array1DTracer, logTracer);

const array = new Array1DRandomizer(10, 0, 10).array;

function SelectionSort(array: Array<number>): void {
    const n = array.length;

    array1DTracer.nop();
    logTracer.print(`Initial array - [${array.join(", ")}]`);

    for (let i = 0; i < n; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            array1DTracer.select([i, j, minIndex]);
            logTracer.print(`i: ${i}, j: ${j}, minIndex: ${minIndex}`);
            array1DTracer.unselect([i, j, minIndex], false);

            array1DTracer.nop();
            logTracer.print(`Comparing indexes minIndex ${minIndex} and j ${j}: ${array[minIndex]} and ${array[j]}`);

            if (array[j] < array[minIndex]) {
                array1DTracer.nop();
                logTracer.print(`Updating minIndex to j.`);

                minIndex = j;
            }
        }

        array1DTracer.swap(i, minIndex);
        logTracer.print(`Swapping indexes i and minIndex: ${array[i]} and ${array[minIndex]}`);

        [array[i], array[minIndex]] = [array[minIndex], array[i]];

        array1DTracer.nop();
        logTracer.print(`Updated array - [${array.join(", ")}]`);
    }

    array1DTracer.captureState();
    logTracer.print(`Sorted array - [${array.join(", ")}]`);
}

(function main() {
    array1DTracer.setArray(array);

    SelectionSort(array);

    console.log(scheduler.generateSchedules());
})();