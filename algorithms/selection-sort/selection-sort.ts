import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import ChartTracer from "./tracers/ChartTracer";
import LogTracer from "./tracers/LogTracer";
import Runner from "./Runner";

const array1DTracer = new Array1DTracer("Array");
const chartTracer = new ChartTracer("Chart");
const logTracer = new LogTracer("Log");

function SelectionSort(array: Array<number>): void {
  const n = array.length;

  logTracer.print(`initial array - [${array.join(", ")}]`);
  array1DTracer.captureState();

  let i = 0;
  let j = 0;
  for (; i < n; i++) {
    let minIndex = i;

    for (j = i + 1; j < n; j++) {
      logTracer.print("comparing values at indexes j and minIndex");
      array1DTracer.select([i, j, minIndex], {
        i: i,
        j: j,
        minIndex: minIndex,
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
  const array = new Array1DRandomizer(10, 1, 50).getArray();
  array1DTracer.setArray(structuredClone(array));

  SelectionSort(structuredClone(array));

  chartTracer.fromArray1DTracer(array1DTracer);
  const runner = new Runner(chartTracer, array1DTracer, logTracer);
  runner.runSnippets();
})();
