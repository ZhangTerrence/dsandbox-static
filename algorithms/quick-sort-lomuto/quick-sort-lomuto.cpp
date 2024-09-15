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

        int lomuto_partition(std::vector<int> &array, int const left, int const right) const
        {
            int pivot = array[right];
            int i = left - 1;
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"sorting array[", std::to_string(left), "...", std::to_string(right + 1), "]"}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(generate_range(left, right + 1), {{"i", i}, {"pivot", pivot}});
            // }

            for (int j = left; j < right; j++)
            {
                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"comparing array[", std::to_string(j), "] and ", std::to_string(pivot)}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(generate_range(left, right + 1), {{"i", i}, {"j", j}, {"pivot", pivot}});
                // }
                if (array[j] <= pivot)
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"array[", std::to_string(j), "] <= ", std::to_string(pivot), ", incrementing i and swapping array[", std::to_string(i + 1), "] and array[", std::to_string(j), "]"}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->swap(i + 1, j, {{"i", i}, {"j", j}, {"pivot", pivot}});
                    // }
                    i++;
                    std::swap(array[i], array[j]);
                }
            }

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"swapping array[", std::to_string(i + 1), "] and array[", std::to_string(right), "]"}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->swap(i + 1, right, {{"i", i}, {"pivot", pivot}});
            // }
            std::swap(array[i + 1], array[right]);

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"updated array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
            // }
            return i + 1;
        }

        void quick_sort(std::vector<int> &array, int const left, int const right) const
        {
            if (left >= right)
            {
                return;
            }

            int const pivotIndex = lomuto_partition(array, left, right);
            quick_sort(array, left, pivotIndex - 1);
            quick_sort(array, pivotIndex + 1, right);
        }
    };
}
