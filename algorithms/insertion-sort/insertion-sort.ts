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

    this.InsertionSort(array);

    (this.tracers.get("Chart") as ChartTracer).fromArray1DTracer(this.tracers.get("Array") as Array1DTracer);
  }

  InsertionSort(array: Array<number>): void {
    const n = array.length;

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`initial array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).captureState();
    // }
    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;

      // trace {
      (this.tracers.get("Log") as LogTracer).print("comparing values at indexes i and j");
      (this.tracers.get("Array") as Array1DTracer).select([i, j], {
        i: i,
        j: j,
        key: key,
      });
      // }
      while (j >= 0 && array[j] > key) {
        // trace {
        (this.tracers.get("Log") as LogTracer).print("moving value greater than key value one index to right");
        (this.tracers.get("Array") as Array1DTracer).update(j + 1, array[j], {
          i: i,
          j: j,
          key: key,
        });
        // }
        array[j + 1] = array[j];
        j--;
      }
      // trace {
      (this.tracers.get("Log") as LogTracer).print("updating value at index j to key value");
      (this.tracers.get("Array") as Array1DTracer).update(j + 1, key, {
        i: i,
        j: j,
        key: key,
      });
      // }
      array[j + 1] = key;

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
