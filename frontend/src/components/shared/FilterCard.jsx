import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "@/redux/jobSlice";

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
  "0-40000": "Under $40,000",
  "40000-60000": "$40,000 - $60,000",
  "60000-80000": "$60,000 - $80,000",
  "80000-100000": "$80,000 - $100,000",
  "100000+": "$100,000+",
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

  const hasActiveFilters =
    filters.location?.length > 0 ||
    filters.jobType?.length > 0 ||
    filters.salaryRange?.length > 0;

  return (
    <div className="p-4 rounded-lg border border-border bg-background text-foreground">
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      <hr className="mb-4" />

      {filterData.map((section, index) => (
        <div key={index} className="mb-6">
          <Label className="font-medium text-base block mb-2">
            {section.filterType}
          </Label>

          <div className="flex flex-col gap-2">
            {section.options.map((option, idx) => {
              const isChecked = filters[section.key]?.includes(option) || false;
              const displayLabel =
                section.key === "salaryRange"
                  ? salaryLabels[option] || option
                  : option;

              return (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    id={`${section.filterType}-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleFilterChange(section.key, option, checked)
                    }
                  />
                  <span className="text-sm">{displayLabel}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FilterCard;
