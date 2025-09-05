import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import UnitChip from './temp2';

const DUMMY_UNITS = [
  { id: "u1", name: "Introduction to C", unit_type: "text" },
  { id: "u2", name: "MCQ: Basics & Syntax", unit_type: "mcq" },
  { id: "u3", name: "Pointers — Overview", unit_type: "text" },
  { id: "u4", name: "Arrays Quiz", unit_type: "mcq" },
  { id: "u5", name: "File I/O Walkthrough", unit_type: "text" },
  { id: "u6", name: "Structures & Typedef", unit_type: "text" }
];

const ChapterContent = () => {
  const [units, setUnits] = useState(DUMMY_UNITS);
  const scrollContainerRef = useRef(null);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedUnits = Array.from(units);
    const [removed] = reorderedUnits.splice(result.source.index, 1);
    reorderedUnits.splice(result.destination.index, 0, removed);

    setUnits(reorderedUnits);
    console.log('Units reordered:', reorderedUnits.map(u => u.name));
  };

  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleAddUnit = () => {
    console.log('Add new unit clicked');
  };

  const handleEditUnit = (unit) => {
    console.log('Edit unit:', unit);
  };

  const handleDeleteUnit = (unit) => {
    console.log('Delete unit:', unit);
    setUnits(prevUnits => prevUnits.filter(u => u.id !== unit.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-green-600 text-white px-6 py-4 shadow-md z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Lesson Units</h1>
          <button 
            onClick={handleAddUnit}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            Add Unit
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-600">Drag to reorder units, or use your mouse wheel to scroll horizontally through the units.</p>
        </div>

        {/* Draggable Units Container */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="units" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={scrollContainerRef}
                onWheel={handleWheel}
                className="overflow-x-auto overflow-y-hidden pb-4"
                style={{ 
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex gap-4 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-green-50' : ''
                  }`}
                  style={{ minWidth: 'max-content' }}
                >
                  {units.map((unit, index) => (
                    <Draggable key={unit.id} draggableId={unit.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform duration-200 ${
                            snapshot.isDragging ? 'rotate-2 scale-105' : ''
                          }`}
                        >
                          <UnitChip
                            unit={unit}
                            index={index}
                            onEdit={handleEditUnit}
                            onDelete={handleDeleteUnit}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Additional Content to Show Vertical Scrolling */}
        <div className="mt-12 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Chapter Overview</h2>
            <p className="text-gray-600">This chapter covers the fundamental concepts of C programming language. Students will learn about basic syntax, data types, control structures, and memory management.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Learning Objectives</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Understand C syntax and basic programming constructs</li>
              <li>• Master pointer concepts and memory allocation</li>
              <li>• Work with arrays and data structures</li>
              <li>• Implement file input/output operations</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Assessment Criteria</h2>
            <p className="text-gray-600">Students will be evaluated based on their understanding of concepts, practical implementation skills, and ability to solve programming problems using C.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;