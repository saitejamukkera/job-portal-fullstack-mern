import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/customHooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSearchCompanyByText } from "@/redux/companySlice";

function Companies() {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <div className="max-w-4xl mx-auto my-10 ">
        <div className="flex justify-between items-center mb-6">
          <Input
            className="w-fit"
            placeholder="Filter by Name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="ml-4 cursor-pointer"
            onClick={() => {
              navigate("/admin/companies/create");
            }}
          >
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
}

export default Companies;
