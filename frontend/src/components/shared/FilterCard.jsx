import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";
import { LuFilter, LuX } from "react-icons/lu";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    options: ["New York", "San Francisco", "California", "Austin"],
  },
  {
    filterType: "Job Type",
    key: "jobType",
    options: ["Full-time", "Part-time", "Contract", "Internship"],
  },
  {
    filterType: "Salary Range",
    key: "salaryRange",
    options: [
      "0-40000",
      "40000-60000",
      "60000-80000",
      "80000-100000",
      "100000+",
    ],
  },
];

const salaryLabels = {
  "0-40000": "Under $40K",
  "40000-60000": "$40K - $60K",
  "60000-80000": "$60K - $80K",
  "80000-100000": "$80K - $100K",
  "100000+": "$100K+",
};

function FilterCard() {
  const dispatch = useDispatch();
  const { filters = { location: [], jobType: [], salaryRange: [] } } =
    useSelector((store) => store.job);

  const handleFilterChange = (filterKey, option, checked) => {
    const currentValues = filters[filterKey] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((val) => val !== option);
    }

    dispatch(
      setFilters({
        ...filters,
        [filterKey]: newValues,
      })
    );
  };

  const activeFilterCount =
    (filters.location?.length || 0) +
    (filters.jobType?.length || 0) +
    (filters.salaryRange?.length || 0);

  return (
    <div className="p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LuFilter className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-base">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <LuX className="size-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {filterData.map((section, index) => (
          <div key={index}>
            <Label className="font-medium text-sm block mb-2.5 text-foreground">
              {section.filterType}
            </Label>

            <div className="flex flex-col gap-2">
              {section.options.map((option, idx) => {
                const isChecked =
                  filters[section.key]?.includes(option) || false;
                const displayLabel =
                  section.key === "salaryRange"
                    ? salaryLabels[option] || option
                    : option;

                return (
                  <label
                    key={idx}
                    className="flex items-center gap-3 cursor-pointer group py-1 px-2 -mx-2 rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={`${section.filterType}-${option}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleFilterChange(section.key, option, checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {displayLabel}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterCard;
