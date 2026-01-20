import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const profileSlice = createSlice({
  name: "profile",
  initialState: null as any,  

  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
      return state;
    },
    removeProfile: (state) => {
      state = null;
      return state;
    },
  },
});

export const { removeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;