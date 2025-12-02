import { COMPANY_API_END_POINT } from "@/utilis/const_endpoints";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSingleCompany } from "@/redux/companySlice";

function useGetCompanyByID(companyId) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${COMPANY_API_END_POINT}/${companyId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          dispatch(setSingleCompany(response.data.company));
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]);

  return isLoading;
}

export default useGetCompanyByID;
