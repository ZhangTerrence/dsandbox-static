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

            insertion_sort(array);

            std::dynamic_pointer_cast<ChartTracer>(this->tracers->get("Chart"))->from_array_1d_tracer(*std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array")));
        }

        void insertion_sort(std::vector<int> array) const
        {
            int const n = array.size();

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"initial array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({});
            // }
            for (int i = 1; i < n; i++)
            {
                int key = array[i];
                int j = i - 1;

                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"comparing array[", std::to_string(j), "] and ", std::to_string(key)}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select({i, j}, {{"i", i}, {"j", j}, {"key", key}});
                // }
                while (j >= 0 && array[j] > key)
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"array[", std::to_string(j), "] > ", std::to_string(key), ", setting array[", std::to_string(j), "] to array[", std::to_string(j + 1), "]"}));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(j + 1, array[j], {{"i", i}, {"j", j}, {"key", key}});
                    // }
                    array[j + 1] = array[j];
                    j--;
                }
                // trace {
                std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(template_string({"setting array[", std::to_string(j), "] to ", std::to_string(key)}));
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(j + 1, key, {{"i", i}, {"j", j}, {"key", key}});
                // }
                array[j + 1] = key;

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
