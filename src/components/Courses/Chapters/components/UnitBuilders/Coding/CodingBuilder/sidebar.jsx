import React from 'react';
import { BookOpen, TestTube, ArrowLeft, FileCode, PenTool, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
function Sidebar({ activeComponent, setActiveComponent }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'questions', icon: BookOpen, label: 'Questions', component: 'questions' },
    { id: 'test-cases', icon: TestTube, label: 'Test Cases', component: 'test-cases' },
    { id: 'boilerplate-editor', icon: FileCode, label: 'Boilerplate', component: 'boilerplate-editor' },
    { id: 'solution-editor', icon: PenTool, label: 'Solution', component: 'solution-editor' },
  ];

 

  return (
    <div className="w-16 h-full flex flex-col items-center pt-3">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="w-12 h-12 mb-4 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
        title="Go Back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Sidebar Menu */}
      <div className="flex-1 flex flex-col items-center space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeComponent === item.component;

          return (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.component)}
              className={`
                w-16 h-16 flex flex-col items-center justify-center transition-all duration-200 p-2
                ${isActive ? 'bg-[#4CA466] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>

    
    </div>
  );
}

export default Sidebar;
