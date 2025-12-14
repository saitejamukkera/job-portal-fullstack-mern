import { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import { APPLICATION_API_END_POINT } from "@/utilis/const_endpoints";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setApplicants } from "@/redux/applicationSlice";

function Applicants() {
  const params = useParams();
  const dispatch = useDispatch();

  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        // Get applicants for a specific job
        const response = await axios.get(
          `${APPLICATION_API_END_POINT}/job/${params.id}/applicants`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          dispatch(setApplicants(response.data.applicants));
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    }
    fetchApplicants();
  }, []);
  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-semibold text-xl mt-5 ">
          Applicants({applicants.length})
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
}

export default Applicants;
