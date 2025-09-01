import React, { useState } from 'react';
import { 
  Settings, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  CheckSquare,
  Move,
  Code,
  LogOut
} from 'lucide-react';
// import { useAuth } from '../Auth/AuthContext';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const { auth, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

  const toggleQuestions = () => setIsQuestionsOpen(!isQuestionsOpen);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
<div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed flex flex-col">
  <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <nav className="space-y-2">
            {/* Admin */}
            {hasPermission("admins") && (
              <a
                href="/admins"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#4CA466] transition-all duration-200 group"
              >
                <Settings className="w-5 h-5 mr-3 group-hover:text-[#4CA466]" />
                <span className="text-sm font-medium">Admin</span>
              </a>
            )}

            {/* Colleges */}
            {hasPermission("colleges") && (
              <a
                href="/colleges"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#4CA466] transition-all duration-200 group"
              >
                <GraduationCap className="w-5 h-5 mr-3 group-hover:text-[#4CA466]" />
                <span className="text-sm font-medium">Colleges</span>
              </a>
            )}

            {/* Courses */}
            {hasPermission("courses") && (
              <a
                href="/courses"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#4CA466] transition-all duration-200 group"
              >
                <BookOpen className="w-5 h-5 mr-3 group-hover:text-[#4CA466]" />
                <span className="text-sm font-medium">Courses</span>
              </a>
            )}

            {/* Questions - Collapsible */}
            {(hasPermission("questions.coding") || hasPermission("questions.mcq") || hasPermission("questions.rearrange")) && (
              <div>
                <button
                  onClick={toggleQuestions}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#4CA466] transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-3 group-hover:text-[#4CA466]" />
                    <span className="text-sm font-medium">Questions</span>
                  </div>
                  {isQuestionsOpen ? (
                    <ChevronDown className="w-4 h-4 group-hover:text-[#4CA466] transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 group-hover:text-[#4CA466] transition-transform duration-200" />
                  )}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isQuestionsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="ml-6 mt-2 space-y-1">
                    {hasPermission("questions.mcq") && (
                      <a
                        href="/questions/mcq"
                        className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#4CA466] transition-all duration-200 group"
                      >
                        <CheckSquare className="w-4 h-4 mr-3 group-hover:text-[#4CA466]" />
                        <span className="text-sm">MCQ</span>
                      </a>
                    )}
                    {hasPermission("questions.rearrange") && (
                      <a
                        href="/questions/rearrange"
                        className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#4CA466] transition-all duration-200 group"
                      >
                        <Move className="w-4 h-4 mr-3 group-hover:text-[#4CA466]" />
                        <span className="text-sm">Rearrange</span>
                      </a>
                    )}
                    {hasPermission("questions.coding") && (
                      <a
                        href="/questions/coding"
                        className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#4CA466] transition-all duration-200 group"
                      >
                        <Code className="w-4 h-4 mr-3 group-hover:text-[#4CA466]" />
                        <span className="text-sm">Coding</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Logout Button at Bottom */}
      <div className="p-6 border-t border-gray-200">
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
    >
      <LogOut className="w-5 h-5 mr-3 group-hover:text-red-600" />
      <span className="text-sm font-medium">Logout</span>
    </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
