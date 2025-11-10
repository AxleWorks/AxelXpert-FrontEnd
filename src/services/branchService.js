import axios from "axios";
import { BRANCHES_URL } from "../config/apiEndpoints.jsx";

export const getAllBranches = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(BRANCHES_URL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export default getAllBranches;
