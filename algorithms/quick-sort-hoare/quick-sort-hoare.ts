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

    const rng = new Array1DRandomizer(16, 1, 50);
    const array = rng.getArray();
    (this.tracers.get("Array") as Array1DTracer).setArray(structuredClone(array));

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`initial array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).nop();
    // }
    const n = array.length;
    this.QuickSort(array, 0, n - 1);
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorted array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).nop();
    // }

    (this.tracers.get("Chart") as ChartTracer).fromArray1DTracer(this.tracers.get("Array") as Array1DTracer);
  }

  hoarePartition(array: Array<number>, left: number, right: number): number {
    let pivot = array[left];
    let i = left - 1;
    let j = right + 1;
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorting array[${left}...${right + 1}]`);
    (this.tracers.get("Array") as Array1DTracer).select(
      [...new Array(right - left + 1).keys()].map((i) => left + i),
      {
        i: i,
        j: j,
        pivot: pivot,
      },
    );
    // }

    while (true) {
      do {
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`array[${i}] < ${pivot}, incrementing i`);
        (this.tracers.get("Array") as Array1DTracer).select(
          [...new Array(right - left + 1).keys()].map((i) => left + i),
          {
            i: i,
            j: j,
            pivot: pivot,
          },
        );
        // }
        i++;
      } while (array[i] < pivot);

      do {
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`array[${j}] > ${pivot}, decrementing j`);
        (this.tracers.get("Array") as Array1DTracer).select(
          [...new Array(right - left + 1).keys()].map((i) => left + i),
          {
            i: i,
            j: j,
            pivot: pivot,
          },
        );
        // }
        j--;
      } while (array[j] > pivot);

      if (i >= j) {
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`updated array - [${array.join(", ")}]`);
        (this.tracers.get("Array") as Array1DTracer).nop();
        // }
        return j;
      }

      // trace {
      (this.tracers.get("Log") as LogTracer).print(`${i} < ${j}, swapping array[${i}] and array[${j}]`);
      (this.tracers.get("Array") as Array1DTracer).swap(i, j, {
        i: i,
        j: j,
        pivot: pivot,
      });
      // }
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  QuickSort(array: Array<number>, left: number, right: number): void {
    if (left >= right) {
      return;
    }

    const pivotIndex = this.hoarePartition(array, left, right);
    this.QuickSort(array, left, pivotIndex);
    this.QuickSort(array, pivotIndex + 1, right);
  }
}
