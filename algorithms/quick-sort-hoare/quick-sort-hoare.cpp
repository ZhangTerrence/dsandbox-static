#include "randomizers/Array1DRandomizer.hpp"
#include "tracers/Array1DTracer.hpp"
#include "tracers/ChartTracer.hpp"
#include "tracers/LogTracer.hpp"
#include "utilities.hpp"

namespace dsandbox
{
    class Snippet
    {
    public:
        std::unique_ptr<Tracers> tracers;

        Snippet()
        {
            this->tracers = std::make_unique<Tracers>();
            this->tracers->add_array_1d_tracer("Array");
            this->tracers->add_chart_tracer("Chart");
            this->tracers->add_log_tracer("Log");

            Array1DRandomizer const rng{16, 1, 50};
            auto array = rng.get_array();
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->set_array(array);

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"initial array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
            // }
            int const n = array.size();
            quick_sort(array, 0, n - 1);
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"sorted array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
            // }

            std::dynamic_pointer_cast<ChartTracer>(this->tracers->get("Chart"))->from_array_1d_tracer(*std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array")));
        }

        int hoare_partition(std::vector<int> &array, int const left, int const right) const
        {
            int pivot = array[left];
            int i = left - 1;
            int j = right + 1;
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"sorting array[", std::to_string(left), "...", std::to_string(right + 1), "]"}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(generate_range(left, right + 1), {{"i", i}, {"j", j}, {"pivot", left}});
            // }

            while (true)
            {
                do
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"array[", std::to_string(i), "] < ", std::to_string(pivot), ", incrementing i"}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(generate_range(left, right + 1), {{"i", i}, {"j", j}, {"pivot", left}});
                    // }
                    i++;
                } while (array[i] < pivot);

                do
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"array[", std::to_string(j), "] > ", std::to_string(pivot), ", decrementing i"}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(generate_range(left, right + 1), {{"i", i}, {"j", j}, {"pivot", left}});
                    // }
                    j--;
                } while (array[j] > pivot);

                if (i >= j)
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"updated array - ", to_array_string(array)}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
                    // }
                    return j;
                }

                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({std::to_string(i), " < ", std::to_string(j), ", swapping array[", std::to_string(i), "] and array[", std::to_string(j), "]"}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->swap(i, j, {{"i", i}, {"j", j}, {"pivot", left}});
                // }
                std::swap(array[i], array[j]);
            }
        }

        void quick_sort(std::vector<int> &array, int const left, int const right) const
        {
            if (left >= right)
            {
                return;
            }

            int const pivotIndex = hoare_partition(array, left, right);
            quick_sort(array, left, pivotIndex);
            quick_sort(array, pivotIndex + 1, right);
        }
    };
}
