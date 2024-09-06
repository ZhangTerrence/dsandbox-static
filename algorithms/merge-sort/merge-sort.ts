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
    this.tracers.addArray1DTracer("Buffer");
    this.tracers.addChartTracer("Chart");
    this.tracers.addLogTracer("Log");

    const rng = new Array1DRandomizer(16, 1, 50);
    const array = rng.getArray();
    (this.tracers.get("Array") as Array1DTracer).setArray(structuredClone(array));
    const buffer = new Array(16).fill(0);
    (this.tracers.get("Buffer") as Array1DTracer).setArray(buffer);

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`initial array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).nop();
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }
    const n = array.length;
    this.MergeSort(array, 0, n - 1);
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorted array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).nop();
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }

    (this.tracers.get("Chart") as ChartTracer).fromArray1DTracer(this.tracers.get("Array") as Array1DTracer);
  }

  merge(array: Array<number>, left: number, middle: number, right: number) {
    const n1 = middle - left + 1;
    const n2 = right - middle;
    // trace {
    (this.tracers.get("Log") as LogTracer).print(`sorting array[${left}...${right + 1}]`);
    (this.tracers.get("Array") as Array1DTracer).select(
      [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
    );
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }

    const L = new Array(n1);
    const R = new Array(n2);

    // trace {
    (this.tracers.get("Log") as LogTracer).print(
      `copying array[${left}...${middle + n2 + 1}] to buffer${left}...${middle + n2 + 1}]`,
    );
    (this.tracers.get("Array") as Array1DTracer).select(
      [...new Array(middle + 1 + n2 - left).keys()].map((i) => left + i),
    );
    // }
    for (let i = 0; i < n1; i++) {
      // trace {
      (this.tracers.get("Buffer") as Array1DTracer).update(left + i, array[left + i], {}, false);
      // }
      L[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
      // trace {
      (this.tracers.get("Buffer") as Array1DTracer).update(middle + j + 1, array[middle + j + 1], {}, false);
      // }
      R[j] = array[middle + j + 1];
    }
    // trace {
    (this.tracers.get("Buffer") as Array1DTracer).captureState();
    // }

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`L: [${L.join(", ")}]; R: [${R.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).select(
      [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
    );
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`L[${i}] <= R[${j}], setting array[${k}] to L[${i}]`);
        (this.tracers.get("Array") as Array1DTracer).update(k, L[i], {
          k: k,
          selected: [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
        });
        (this.tracers.get("Buffer") as Array1DTracer).select([left + i, middle + j + 1], {
          [`L[${i}]`]: left + i,
          [`R[${j}]`]: middle + j + 1,
        });
        // }
        array[k] = L[i];
        i++;
      } else {
        // trace {
        (this.tracers.get("Log") as LogTracer).print(`L[${i}] > R[${j}], setting array[${k}] to R[${j}]`);
        (this.tracers.get("Array") as Array1DTracer).update(k, R[j], {
          k: k,
          selected: [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
        });
        (this.tracers.get("Buffer") as Array1DTracer).select([left + i, middle + j + 1], {
          [`L[${i}]`]: left + i,
          [`R[${j}]`]: middle + j + 1,
        });
        // }
        array[k] = R[j];
        j++;
      }
      k++;
    }

    // trace {
    (this.tracers.get("Log") as LogTracer).print(
      `copying remainder of L: [${L.slice(i).join(", ")}] to array[${k}...${k + n1 - i}]`,
    );
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }
    while (i < n1) {
      // trace {
      (this.tracers.get("Array") as Array1DTracer).update(k, L[i], { k: k }, false);
      // }
      array[k] = L[i];
      i++;
      k++;
    }
    // trace {
    (this.tracers.get("Array") as Array1DTracer).captureState({
      selected: [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
    });
    // }

    // trace {
    (this.tracers.get("Log") as LogTracer).print(
      `copying remainder of R: [${R.slice(j).join(", ")}] to array[${k}...${k + n2 - j}]`,
    );
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }
    while (j < n2) {
      // trace {
      (this.tracers.get("Array") as Array1DTracer).update(k, R[j], { k: k }, false);
      // }
      array[k] = R[j];
      j++;
      k++;
    }
    // trace {
    (this.tracers.get("Array") as Array1DTracer).captureState({
      selected: [...new Array(middle + n2 + 1 - left).keys()].map((i) => left + i),
    });
    // }

    // trace {
    (this.tracers.get("Log") as LogTracer).print(`updated array - [${array.join(", ")}]`);
    (this.tracers.get("Array") as Array1DTracer).nop();
    (this.tracers.get("Buffer") as Array1DTracer).nop();
    // }
  }

  MergeSort(array: Array<number>, left: number, right: number): void {
    if (left >= right) {
      return;
    }

    const middle = left + Math.floor((right - left) / 2);
    this.MergeSort(array, left, middle);
    this.MergeSort(array, middle + 1, right);
    this.merge(array, left, middle, right);
  }
}
