import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EDA_URL = `${BASE_URL}/eda`;

const API = axios.create({
  baseURL: EDA_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch teachers profile based on subject and branch
export const fetchTeacherProfile = async (
  teacherId: string,
  subject: string,
  branch: string,
  section?: string
): Promise<any> => {
  try {
    const url = section 
      ? `/${teacherId}/${subject}/${branch}?section=${section}`
      : `/${teacherId}/${subject}/${branch}`;
    const data = await API.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching questions: \n", error);
    throw error;
  }
};
