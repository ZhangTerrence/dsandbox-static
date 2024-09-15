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

            Array1DRandomizer const rng{10, 1, 50};
            auto const array = rng.get_array();
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->set_array(array);

            selection_sort(array);

            std::dynamic_pointer_cast<ChartTracer>(this->tracers->get("Chart"))->from_array_1d_tracer(*std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array")));
        }

        void selection_sort(std::vector<int> array) const
        {
            int const n = array.size();

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"initial array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({});
            // }
            int i = 0;
            int j = 0;
            for (; i < n; i++)
            {
                int minIndex = i;

                for (j = i + 1; j < n; j++)
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"comparing array[", std::to_string(j), "] and array[", std::to_string(minIndex), "]"}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select({i, j, minIndex}, {{"i", i}, {"j", j}, {"minIndex", minIndex}});
                    // }
                    if (array[j] < array[minIndex])
                    {
                        // trace {
                        std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"array[", std::to_string(j), "] < array[", std::to_string(minIndex), "], setting minIndex to j"}));
                        std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({{"i", i}, {"j", j}, {"minIndex", minIndex}});
                        // }
                        minIndex = j;
                    }
                }
                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"swapping array[", std::to_string(i), "] and array[", std::to_string(minIndex), "]"}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->swap(i, minIndex, {{"i", i}, {"j", j}, {"minIndex", minIndex}});
                // }
                std::swap(array[i], array[minIndex]);

                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"updated array - ", to_array_string(array)}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({{"i", i}, {"j", j}});
                // }
            }
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"sorted array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({});
            // }
        }
    };
}
