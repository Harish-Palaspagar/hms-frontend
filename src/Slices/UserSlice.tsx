import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token") as string)
    : null,

  reducers: {
    setUser: (state, action) => {
      state = action.payload;
      return state;
    },
    removeUser: (state) => {
      state = null;
      return state;
    },
  },
});

export const { removeUser, setUser } = userSlice.actions;
export default userSlice.reducer;
