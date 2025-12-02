import { COMPANY_API_END_POINT } from "@/utilis/const_endpoints";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCompanies } from "../redux/companySlice";

function useGetAllCompanies() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const response = await axios.get(`${COMPANY_API_END_POINT}/my`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          dispatch(setCompanies(response?.data?.companies));
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };
    fetchAllCompanies();
  }, [dispatch]);
}

export default useGetAllCompanies;
