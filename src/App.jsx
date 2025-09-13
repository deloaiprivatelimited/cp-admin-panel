import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
import ListMCQ from "./components/Questions/MCQ/ListMCQ.jsx";
import ListCourses from "./components/Courses/ListCourses.jsx";
import ListRearrange from "./components/Questions/Rearrange/ListRearrange.jsx";
// import CodeBuilder from "./components/Questions/Coding/CodeBuilder.jsx";
import MyComponent from "./components/Questions/Coding/CodingBuilder/CodingQuestion.jsx";
import QuestionList from "./components/Questions/Coding/Questions.js";
// Pages
import CourseCodeBuilder from "./components/Courses/Chapters/components/UnitBuilders/Coding/CodingBuilder/index.jsx";
import RearrangeBuilder from "./components/Questions/Rearrange/RearrangeBuilder.jsx";
// import AdminsPage from "./pages/AdminsPage";
import Admins from "./components/Admins/Admins.jsx";
// import CollegesPage from "./pages/CollegesPage";
import RedirectToDefault from "./components/redirectToDefault.jsx";
import NoPermissions from "./components/Auth/NoPermissions.jsx";
import EditQuestionBuilder from "./components/Questions/MCQ/Edit/EditQuestionBuilder.jsx";
// Components
import AddMCQQuestion from "./components/Questions/MCQ/AddMCQ.jsx";
import Login from "./components/Auth/Login.jsx";
import SideBar from "./components/sideBar.jsx";
import CollegeList from "./components/College/ListColleges.jsx";
import ViewCollege from "./components/College/ViewCollege.jsx";
import ChapterManager from "./components/Courses/Chapters/ChapterManager.jsx";
import CodeBuilder from "./components/Questions/Coding/CodingBuilder/index.jsx";
import { Code } from "lucide-react";
import EditRearrangeBuilder from "./components/Questions/Rearrange/Edit/EditQuestionBuilder.jsx";
import CodeRunner from "./components/CodeRunner/index.js";
// Layout wrapper to handle sidebar
// Layout wrapper to handle sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const hideSidebarRoutes = ["/login", "/unauthorized", "/questions/mcq/add"];

  const shouldHideSidebar =
    hideSidebarRoutes.includes(path) ||
    (path.startsWith("/questions/mcq/") && path.endsWith("/edit")) ||
    (path.startsWith("/courses/chapter-builder/") && path.endsWith("/edit")) ||
    (path.startsWith("/questions/coding/") && path.endsWith("/code-builder")) ||
    (path.startsWith("/questions/coding") && path.endsWith("/course-code-builder"));

  const showSidebar = !shouldHideSidebar;

  return (
    <div className="flex w-screen h-screen overflow-auto">
      {showSidebar && <SideBar />}
      <div
        className={`flex-1 ${
          showSidebar ? "ml-64 " : "m-0 p-0"
        } w-full h-full overflow-auto`}
      >
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />

        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<NoPermissions />} />
            {/* Admins */}
            <Route
              path="/admins"
              element={
                <ProtectedRoute requiredPermission="admins">
                  <Admins />
                </ProtectedRoute>
              }
            />
            {/* Colleges */}
            <Route
              path="/colleges"
              element={
                <ProtectedRoute requiredPermission="colleges">
                  <CollegeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/:id"
              element={
                <ProtectedRoute requiredPermission="colleges">
                  <ViewCollege />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute requiredPermission="courses">
                  <ListCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/chapter-builder/:courseId/edit"
              element={
                <ProtectedRoute requiredPermission="courses">
                  <ChapterManager />
                </ProtectedRoute>
              }
            />
            {/* Questions */}
            <Route
              path="/questions/coding"
              element={
                <ProtectedRoute requiredPermission="questions.coding">
                  <QuestionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/coding/:questionId/code-builder"
              element={
                <ProtectedRoute requiredPermission="questions.coding">
                  <CodeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/coding/:questionId/code-builder"
              element={
                <ProtectedRoute requiredPermission="courses">
                  <CodeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/coding/:questionId/course-code-builder"
              element={
                <ProtectedRoute requiredPermission="courses">
                  <CourseCodeBuilder />
                </ProtectedRoute>
              }
            />
               <Route
              path="/questions/coding/:questionId/preview"
              element={
                <ProtectedRoute>
                  <CodeRunner/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/mcq"
              element={
                <ProtectedRoute requiredPermission="questions.mcq">
                  <ListMCQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/mcq/:id/edit"
              element={
                <ProtectedRoute requiredPermission="questions.mcq">
                  <EditQuestionBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/rearrange/:id/edit"
              element={
                <ProtectedRoute requiredPermission="questions.rearrange">
                  <EditRearrangeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/mcq/add"
              element={
                <ProtectedRoute requiredPermission="questions.mcq">
                  <AddMCQQuestion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/rearrange/add"
              element={
                <ProtectedRoute requiredPermission="questions.rearrange">
                  <RearrangeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/rearrange"
              element={
                <ProtectedRoute requiredPermission="questions.rearrange">
                  <ListRearrange />
                </ProtectedRoute>
              }
            />{" "}
            {/* Catch-all for unmatched routes */}
            <Route path="*" element={<RedirectToDefault />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
