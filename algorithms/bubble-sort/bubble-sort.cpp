#include "randomizers/Array1DRandomizer.hpp"
#include "tracers/Array1DTracer.hpp"
#include "tracers/ChartTracer.hpp"
#include "tracers/LogTracer.hpp"
#include "Runner.hpp"
#include "Utilities.hpp"

#include <iostream>
#include <iterator>
#include <sstream>

auto chartTracer = std::make_shared<dsandbox::ChartTracer>("Chart", dsandbox::ChartRenderer);
auto array1DTracer = std::make_shared<dsandbox::Array1DTracer>("Array", dsandbox::Array1DRenderer);
auto logTracer = std::make_shared<dsandbox::LogTracer>("Log", dsandbox::LogRenderer);
std::stringstream ss;

void bubble_sort(std::vector<int>& array)
{
    int const n = array.size();

    ss = std::stringstream{};
    ss << "initial array - " << dsandbox::array_string(array);
    logTracer->print(ss.str());
    array1DTracer->capture_state(std::unordered_map<std::string, dsandbox::metadata_values>{});

    for (int i = 0; i < n - 1; i++)
    {
        for (int j = 0; j < n - i - 1; j++)
        {
            logTracer->print("comparing values at indexes j and j + 1");
            array1DTracer->select(std::vector{i, j, j + 1}, std::unordered_map<std::string, dsandbox::metadata_values>{{"i", i}, {"j", j}});
            if (array[j] > array[j + 1])
            {
                logTracer->print("swapping values at indexes j and j + 1");
                array1DTracer->swap(j, j + 1, std::unordered_map<std::string, dsandbox::metadata_values>{{"i", i}, {"j", j}});
                std::swap(array[j], array[j + 1]);
            }

            ss = std::stringstream{};
            ss << "updated array - " << dsandbox::array_string(array);
            logTracer->print(ss.str());
            array1DTracer->capture_state(std::unordered_map<std::string, dsandbox::metadata_values>{{"i", i}, {"j", j}});
        }
    }

    ss = std::stringstream{};
    ss << "sorted array - " << dsandbox::array_string(array);
    logTracer->print(ss.str());
    array1DTracer->capture_state(std::unordered_map<std::string, dsandbox::metadata_values>());
}

int main()
{
    const dsandbox::Array1DRandomizer rng{10, 1, 50};
    auto array = rng.get_array();
    array1DTracer->set_array(array);

    bubble_sort(array);

    chartTracer->from_array_1d_tracer(*array1DTracer.get());
    dsandbox::Runner const runner{std::vector<std::shared_ptr<dsandbox::Tracer>>{chartTracer, array1DTracer, logTracer}};
    runner.runSnippet();
}
