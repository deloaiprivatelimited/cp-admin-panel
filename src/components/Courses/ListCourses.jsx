import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Settings } from 'lucide-react';

const ListCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock course data for demonstration
  const mockCourses = [
    {
      id: '1',
      name: 'Advanced React Development',
      tagline: 'Master modern React patterns and best practices',
      description: 'Deep dive into React hooks, context, performance optimization, and advanced patterns for building scalable applications.',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'JavaScript Fundamentals',
      tagline: 'Build a solid foundation in JavaScript',
      description: 'Learn core JavaScript concepts, ES6+ features, async programming, and DOM manipulation from ground up.',
      thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Node.js Backend Development',
      tagline: 'Create robust server-side applications',
      description: 'Master Node.js, Express, databases, authentication, and API development for full-stack applications.',
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      name: 'Python Data Science',
      tagline: 'Analyze data with Python and machine learning',
      description: 'Learn pandas, NumPy, scikit-learn, and data visualization to extract insights from complex datasets.',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      name: 'UI/UX Design Principles',
      tagline: 'Create beautiful and intuitive user experiences',
      description: 'Master design thinking, prototyping, user research, and modern design tools to craft exceptional interfaces.',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      name: 'DevOps and Cloud Computing',
      tagline: 'Deploy and scale applications with confidence',
      description: 'Learn Docker, Kubernetes, CI/CD pipelines, and cloud platforms to automate deployment and scaling.',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '7',
      name: 'Mobile App Development',
      tagline: 'Build native mobile applications',
      description: 'Create cross-platform mobile apps using React Native and learn native development principles.',
      thumbnail: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '8',
      name: 'Database Design & SQL',
      tagline: 'Master data modeling and database optimization',
      description: 'Learn relational database design, SQL optimization, indexing strategies, and NoSQL alternatives.',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Filter courses based on search query
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockCourses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleEdit = (courseId) => {
    console.log('Edit course:', courseId);
  };

  const handleDelete = (courseId) => {
    console.log('Delete course:', courseId);
  };

  const handleCourseBuilder = (courseId) => {
    console.log('Course builder for:', courseId);
  };

  const handleAddCourse = () => {
    console.log('Add new course (non-interactive)');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Search and Add Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={handleAddCourse}
            className="inline-flex items-center px-6 py-3 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a56] focus:outline-none focus:ring-2 focus:ring-[#4CA466] transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCourseBuilder(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-[#4CA466] font-medium text-sm mb-3 line-clamp-1">
                    {course.tagline}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No courses match "${searchQuery}"`
                : 'Start by adding your first course'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCourses;