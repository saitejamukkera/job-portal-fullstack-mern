import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    job: null,
    adminJobs: [],
    searchAdminJobByText: "",
    allAppliedJobs: [],
    searchQuery: "",
    isLoading: false,
    filters: {
      location: [],
      jobType: [],
      salaryRange: [],
    },
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        location: [],
        jobType: [],
        salaryRange: [],
      };
    },
    setJob: (state, action) => {
      state.job = action.payload;
    },
    setAdminJobs: (state, action) => {
      state.adminJobs = action.payload;
    },
    setSearchAdminJobByText: (state, action) => {
      state.searchAdminJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setJobs,
  setJob,
  setAdminJobs,
  setSearchAdminJobByText,
  setAllAppliedJobs,
  setSearchQuery,
  setIsLoading,
  setFilters,
  clearFilters,
} = jobSlice.actions;
export default jobSlice.reducer;
