import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import TaskForm from './TaskForm';

function Column({ column, tasks, onAddTask, onUpdateTask, onDeleteTask, onDeleteColumn }) {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = (task) => {
    onAddTask(column.id, task);
    setIsAddingTask(false);
  };

  // Calculate minimum height based on number of tasks
  const minHeight = Math.max(400, tasks.length * 100 + 200);

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm p-4 rounded-lg w-80 flex-shrink-0 shadow-lg flex flex-col"
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {column.title} ({tasks.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="text-blue-500 hover:text-blue-700 font-bold text-xl"
          >
            +
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 overflow-y-auto rounded-lg transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-transparent'}
            `}
          >
            <div className="min-h-[200px] p-1">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <Task
                      task={task}
                      provided={provided}
                      snapshot={snapshot}
                      onUpdate={(updatedTask) => onUpdateTask(task.id, updatedTask)}
                      onDelete={() => onDeleteTask(column.id, task.id)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {isAddingTask && (
        <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddingTask(false)} />
      )}
    </div>
  );
}

export default Column;