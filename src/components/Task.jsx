import { useState } from 'react';
import { format } from 'date-fns';
import TaskForm from './TaskForm';

const priorityColors = {
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high'
};

function Task({ task, provided, snapshot, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isEditing) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <TaskForm
          initialData={task}
          onSubmit={(updatedTask) => {
            onUpdate(updatedTask);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`
        task-card task-priority-${task.priority} 
        p-4 rounded-lg shadow-sm mb-2 
        cursor-grab active:cursor-grabbing
        ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500 opacity-90' : ''}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✎
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      </div>

      <div className={`mt-2 ${isExpanded ? 'block' : 'hidden'}`}>
        <p className="text-gray-600 text-sm">{task.description}</p>
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span className={`px-2 py-1 rounded text-white ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span>{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}

export default Task;