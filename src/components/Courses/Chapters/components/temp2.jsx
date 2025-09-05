import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const UnitChip = ({ unit, index, onEdit, onDelete }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'mcq':
        return 'bg-blue-100 text-blue-800';
      case 'text':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    console.log('Edit unit:', { id: unit.id, name: unit.name, type: unit.unit_type });
    onEdit?.(unit);
  };

  const handleDelete = () => {
    console.log('Delete unit:', { id: unit.id, name: unit.name, type: unit.unit_type });
    onDelete?.(unit);
  };

  return (
    <div className="w-60 flex-shrink-0 bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 group">
      {/* Type Label */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${getTypeColor(unit.unit_type)}`}>
          {unit.unit_type}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
            aria-label="Edit unit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
            aria-label="Delete unit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Unit Name */}
      <h3 className="text-sm font-medium text-gray-900 truncate" title={unit.name}>
        {unit.name}
      </h3>
    </div>
  );
};

export default UnitChip;