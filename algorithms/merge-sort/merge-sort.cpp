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
            this->tracers->add_array_1d_tracer("Buffer");
            this->tracers->add_chart_tracer("Chart");
            this->tracers->add_log_tracer("Log");

            Array1DRandomizer const rng{16, 1, 50};
            auto array = rng.get_array();
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->set_array(array);
            std::vector const buffer(16, 0);
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->set_array(buffer);

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string(std::vector<std::string>{"initial array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }
            int const n = array.size();
            merge_sort(array, 0, n - 1);
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string(std::vector<std::string>{"sorted array - ", to_array_string(array)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->nop();
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }

            std::dynamic_pointer_cast<ChartTracer>(this->tracers->get("Chart"))->from_array_1d_tracer(
                *std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array")));
        }

        void merge(std::vector<int>& array, int const left, int const middle, int const right) const
        {
            int const n1 = middle - left + 1;
            int const n2 = right - middle;
            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string({"sorting array[", std::to_string(left), "...", std::to_string(right + 1), "]"}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(
                generate_range(left, middle + n2 + 1), {});
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }

            std::vector<int> L(n1);
            std::vector<int> R(n2);

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string({
                    "copying array[", std::to_string(left), "...", std::to_string(middle + n2 + 1), "]", "to buffer[",
                    std::to_string(left), "...", std::to_string(middle + n2 + 1), "]"
                }));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(
                generate_range(left, middle + n2 + 1), {});
            // }
            for (int i = 0; i < n1; i++)
            {
                // trace {
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->update(
                    left + i, array[left + i], {}, false);
                // }
                L[i] = array[left + i];
            }
            for (int j = 0; j < n2; j++)
            {
                // trace {
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->update(
                    middle + j + 1, array[middle + j + 1], {}, false);
                // }
                R[j] = array[middle + j + 1];
            }
            // trace {
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->capture_state({});
            // }

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string({"L: ", to_array_string(L), "; R: ", to_array_string(R)}));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->select(
                generate_range(left, middle + n2 + 1), {});
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }

            int i = 0;
            int j = 0;
            int k = left;

            while (i < n1 && j < n2)
            {
                if (L[i] <= R[j])
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                        template_string({
                            "L[", std::to_string(i), "] <= R[", std::to_string(j), "], setting array[",
                            std::to_string(i), "] to L[", std::to_string(i), "]"
                        }));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(
                        k, L[i], {{"k", k}, {"selected", generate_range(left, middle + n2 + 1)}});
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->select(
                        {left + i, middle + j + 1}, {
                            {template_string({"L[", std::to_string(i), "]"}), left + i},
                            {template_string({"R[", std::to_string(j), "]"}), middle + j + 1}
                        });
                    // }
                    array[k] = L[i];
                    i++;
                }
                else
                {
                    // trace {
                    std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                        template_string({
                            "L[", std::to_string(i), "] > R[", std::to_string(j), "], setting array[",
                            std::to_string(i), "] to R[", std::to_string(j), "]"
                        }));
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(
                        k, R[j], {{"k", k}, {"selected", generate_range(left, middle + n2 + 1)}});
                    std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->select(
                        {left + i, middle + j + 1}, {
                            {template_string({"L[", std::to_string(i), "]"}), left + i},
                            {template_string({"R[", std::to_string(j), "]"}), middle + j + 1}
                        });
                    // }
                    array[k] = R[j];
                    j++;
                }
                k++;
            }

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string({
                    "copying remainder of L: ", to_array_string(L), " to array[", std::to_string(k), "...",
                    std::to_string(k + n1 - i), "]"
                }));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }
            while (i < n1)
            {
                // trace {
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(
                    k, L[i], {{std::to_string(k), k}}, false);
                // }
                array[k] = L[i];
                i++;
                k++;
            }
            // trace {
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({
                {"selected", generate_range(left, middle + n2 + 1)}
            });
            // }

            // trace {
            std::dynamic_pointer_cast<LogTracer>(this->tracers->get("Log"))->print(
                template_string({
                    "copying remainder of R: ", to_array_string(R), " to array[", std::to_string(k), "...",
                    std::to_string(k + n2 - j), "]"
                }));
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Buffer"))->nop();
            // }
            while (j < n2)
            {
                // trace {
                std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->update(
                    k, R[j], {{std::to_string(k), k}}, false);
                // }
                array[k] = R[j];
                j++;
                k++;
            }
            // trace {
            std::dynamic_pointer_cast<Array1DTracer>(this->tracers->get("Array"))->capture_state({
                {"selected", generate_range(left, middle + n2 + 1)}
            });
            // }
        }

        void merge_sort(std::vector<int>& array, int const left, int const right) const
        {
            if (left >= right)
            {
                return;
            }

            int const middle = left + (right - left) / 2;
            merge_sort(array, left, middle);
            merge_sort(array, middle + 1, right);
            merge(array, left, middle, right);
        }
    };
}
