import Array1DRandomizer from "./randomizers/Array1DRandomizer";
import Array1DTracer from "./tracers/Array1DTracer";
import ChartTracer from "./tracers/ChartTracer";
import LogTracer from "./tracers/LogTracer";
import { Tracers } from "./utilities";

export default class Snippet {
  tracers: Tracers;

  constructor() {
    this.tracers = new Tracers();
    this.tracers.addArray1DTracer("Array");
    this.tracers.addChartTracer("Chart");
    this.tracers.addLogTracer("Log");

    const rng = new Array1DRandomizer(10, 1, 50);
    const array = rng.getArray();
    (this.tracers.get("Array") as Array1DTracer).setArray(structuredClone(array));

    this.SelectionSort(array);

    (this.tracers.get("Chart") as ChartTracer).fromArray1DTracer(this.tracers.get("Array") as Array1DTracer);
  }

  SelectionSort(array: Array<number>): void {
    const n = array.length;

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`initial array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).captureState();
    // }
    let i = 0;
    let j = 0;
    for (; i < n; i++) {
      let minIndex = i;

      for (j = i + 1; j < n; j++) {
        // trace {
        (this.tracers.get("Log") as LogTracer).print("comparing array[j] and array[minIndex]");
        (this.tracers.get("Array") as Array1DTracer).select([i, j, minIndex], {
          i: i,
          j: j,
          minIndex: minIndex,
        });
        // }
        if (array[j] < array[minIndex]) {
          // trace {
          (this.tracers.get("Log") as LogTracer).print("array[j] < array[minIndex], setting minIndex to j");
          (this.tracers.get("Array") as Array1DTracer).captureState({
            i: i,
            j: j,
            minIndex: j,
          });
          // }
          minIndex = j;
        }
      }
      // trace {
      (this.tracers.get("Log") as LogTracer).print("swapping array[i] and array[minIndex]");
      (this.tracers.get("Array") as Array1DTracer).swap(i, minIndex, {
        i: i,
        j: j,
        minIndex: minIndex,
      });
      // }
      [array[i], array[minIndex]] = [array[minIndex], array[i]];

      // trace {
      (this.tracers.get("Log") as LogTracer).print(`updated array - [${array.join(", ")}]`);
      (this.tracers.get("Array") as Array1DTracer).captureState({
        i: i,
        j: j,
      });
      // }
    }
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorted array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).captureState();
    // }
  }
}
