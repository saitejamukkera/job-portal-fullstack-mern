import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [],
  },
  reducers: {
    setApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    updateApplicantStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const applicant = state.applicants.find(
        (app) => app._id === applicationId
      );
      if (applicant) {
        applicant.status = status;
      }
    },
  },
});

export const { setApplicants, updateApplicantStatus } =
  applicationSlice.actions;
export default applicationSlice.reducer;
