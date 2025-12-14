import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/customHooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSearchCompanyByText } from "@/redux/companySlice";
import getCurrentTime from "@/utilis/currentTime";
import { LuPlus, LuSearch, LuBuilding } from "react-icons/lu";

function Companies() {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <LuBuilding className="size-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Your Companies
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Good {getCurrentTime()}, {user.fullName}! Manage your companies
            here.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="relative flex-1 max-w-xs">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-10 w-full"
              placeholder="Search companies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            className="cursor-pointer gap-2 w-full sm:w-auto"
            onClick={() => navigate("/admin/companies/create")}
          >
            <LuPlus className="size-4" />
            New Company
          </Button>
        </div>

        {/* Table */}
        <CompaniesTable />
      </div>
    </div>
  );
}

export default Companies;
