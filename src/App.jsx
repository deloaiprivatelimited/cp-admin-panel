import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
import ListMCQ from "./components/Questions/MCQ/ListMCQ.jsx";
import ListCourses from "./components/Courses/ListCourses.jsx";
// Pages
// import AdminsPage from "./pages/AdminsPage";
import Admins from "./components/Admins/Admins.jsx";
// import CollegesPage from "./pages/CollegesPage";
import CoursesPage from "./pages/CoursesPage";
import QuestionsCodingPage from "./pages/questions/CodingPage";
import QuestionsMcqPage from "./pages/questions/McqPage";
import QuestionsRearrangePage from "./pages/questions/RearrangePage";
import RedirectToDefault from "./components/redirectToDefault.jsx";
import NoPermissions from "./components/Auth/NoPermissions.jsx";
import EditQuestionBuilder from "./components/Questions/MCQ/Edit/EditQuestionBuilder.jsx";
// Components
import AddMCQQuestion from "./components/Questions/MCQ/AddMCQ.jsx";
import Login from "./components/Auth/Login.jsx";
import SideBar from "./components/sideBar.jsx";
import CollegeList from "./components/College/ListColleges.jsx";
import ViewCollege from "./components/College/ViewCollege.jsx";
// Layout wrapper to handle sidebar
const Layout = ({ children }) => {
  const location = useLocation();
    const path = location.pathname;

  const hideSidebarRoutes = ["/login", "/unauthorized", "/questions/mcq/add"];
  const shouldHideSidebar =
    hideSidebarRoutes.includes(path) ||
    path.startsWith("/questions/mcq/") && path.endsWith("/edit");

  const showSidebar = !shouldHideSidebar;
  // const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
   <div style={{ display: "flex" }}>
  {showSidebar && <SideBar />}
  <div style={{ flex: 1, padding: "20px", marginLeft: showSidebar ? "16rem" : "0" }}>
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
               <Route path="/college/:id" 
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
                  <ListCourses/>
                </ProtectedRoute>
              }
            />

            {/* Questions */}
            <Route
              path="/questions/coding"
              element={
                <ProtectedRoute requiredPermission="questions.coding">
                  <QuestionsCodingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/mcq"
              element={
                <ProtectedRoute requiredPermission="questions.mcq">
                  <ListMCQ/>
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
              path="/questions/mcq/add"
              element={
                <ProtectedRoute requiredPermission="questions.mcq">
                  <AddMCQQuestion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/rearrange"
              element={
                <ProtectedRoute requiredPermission="questions.rearrange">
                  <QuestionsRearrangePage />
                </ProtectedRoute>
              }
            /> {/* Catch-all for unmatched routes */}
            <Route
              path="*"
              element={
                <RedirectToDefault />
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
