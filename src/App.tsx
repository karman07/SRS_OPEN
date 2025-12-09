import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { DepartmentsCards } from "./components/DepartmentCard";
import { TeacherCards } from "./components/TeacherCard";
import { StudentReviewPage } from "./components/StudentReview";
import { TeacherProfile } from "./pages/Teachers/TeacherProfile";
import { SemesterCards } from "./components/SemesterCard";
import { TeachersTable } from "./pages/Teachers/TeachersTable";
import { QuestionsTable } from "./pages/Questions/QuestionsTable";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<SemesterCards />} />
        <Route
          path="/reviews/semester/:semesterId"
          element={<DepartmentsCards />}
        />
        <Route
          path="/reviews/semester/:semesterId/department/:departmentId"
          element={<TeacherCards />}
        />
        <Route
          path="/reviews/semester/:semester/department/:departmentId/teacher/:teacherId/subject/:subject"
          element={<TeacherProfile />}
        />
        <Route
          path="/reviews/semester/:semester/department/:departmentId/section/:section/teacher/:teacherId/subject/:subject"
          element={<TeacherProfile />}
        />
        <Route
          path="/reviews/semester/:semester/department/:departmentId/teacher/:teacherId/student/:studentId"
          element={<StudentReviewPage />}
        />
        <Route path="/teachers" element={<TeachersTable />} />
        <Route path="/questions" element={<QuestionsTable />} />
      </Routes>
    </div>
  );
};

export default App;
