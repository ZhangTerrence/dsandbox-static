import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import ChartTracer from "./tracers/ChartTracer";
import LogTracer from "./tracers/LogTracer";
import Runner from "./Runner";

const array1DTracer = new Array1DTracer("Array");
const chartTracer = new ChartTracer("Chart");
const logTracer = new LogTracer("Log");

function BubbleSort(array: Array<number>): void {
  const n = array.length;

  logTracer.print(`initial array - [${array.join(", ")}]`);
  array1DTracer.captureState();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      logTracer.print("comparing values at indexes j and j + 1");
      array1DTracer.select([i, j, j + 1], {
        i: i,
        j: j,
      });
      if (array[j] > array[j + 1]) {
        logTracer.print("swapping values at indexes j and j + 1");
        array1DTracer.swap(j, j + 1, {
          i: i,
          j: j,
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
  const array = new Array1DRandomizer(10, 1, 50).getArray();
  array1DTracer.setArray(structuredClone(array));

  BubbleSort(structuredClone(array));

  chartTracer.fromArray1DTracer(array1DTracer);
  const runner = new Runner(chartTracer, array1DTracer, logTracer);
  runner.runSnippets();
})();
