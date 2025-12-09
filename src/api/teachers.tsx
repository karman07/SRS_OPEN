import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TEACHERS_URL = `${BASE_URL}/teachers`;

const API = axios.create({
  baseURL: TEACHERS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all teachers
export const fetchTeachersList = async (): Promise<any> => {
  try {
    const data = await API.get("/all/teachers");
    return data;
  } catch (error) {
    console.error("Error fetching teachers list: \n", error);
    throw error;
  }
};

// Fetch teacher by Branch and Semester
export const fetchTeacherByBranchAndSemester = async (
  branch: string | undefined,
  semester: string | undefined,
  section?: string | undefined
): Promise<any> => {
  try {
    const params: any = { branch, semester };
    if (section) {
      params.section = section;
    }
    const data = await API.get(`/`, { params });
    return data;
  } catch (error) {
    console.error("Error fetching teacher by branch and semester: \n", error);
    throw error;
  }
};

// Add a new teacher
export const addTeacher = async (formData: any): Promise<any> => {
  try {
    const data = await API.post("/", formData);
    return data;
  } catch (error) {
    console.error("Error adding teacher: \n", error);
    throw error;
  }
};

// Update a teacher
export const updateTeacher = async (
  id: string,
  formData: any
): Promise<any> => {
  try {
    const data = await API.patch(`/${id}`, formData);
    return data;
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}: \n`, error);
    throw error;
  }
};

// Delete a teacher
export const deleteTeacher = async (id: string): Promise<any> => {
  try {
    const data = await API.delete(`/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting teacher: \n", error);
    throw error;
  }
};
