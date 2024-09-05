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

    this.BubbleSort(array);

    (this.tracers.get("Chart") as ChartTracer).fromArray1DTracer(this.tracers.get("Array") as Array1DTracer);
  }

  BubbleSort(array: Array<number>): void {
    const n = array.length;

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`initial array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).captureState();
    // }
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // trace {
        (this.tracers.get("Log") as LogTracer).print("comparing array[j] and array[j + 1]");
        (this.tracers.get("Array") as Array1DTracer).select([i, j, j + 1], {
          i: i,
          j: j,
        });
        // }
        if (array[j] > array[j + 1]) {
          // trace {
          (this.tracers.get("Log") as LogTracer).print("array[j] > array[j + 1], swapping array[j] and array[j + 1]");
          (this.tracers.get("Array") as Array1DTracer).swap(j, j + 1, {
            i: i,
            j: j,
          });
          // }
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`updated array - [${array.join(", ")}]`);
        (this.tracers.get("Array") as Array1DTracer).captureState({
          i: i,
          j: j,
        });
        // }
      }
    }
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorted array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).captureState();
    // }
  }
}
