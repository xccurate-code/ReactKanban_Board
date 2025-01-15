import { Droppable } from '@hello-pangea/dnd';
import Column from './Column';

function Board({ data, searchTerm, onAddTask, onUpdateTask, onDeleteTask, onDeleteColumn }) {
  const filteredData = {
    ...data,
    tasks: Object.fromEntries(
      Object.entries(data.tasks).filter(([_, task]) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  };

  return (
    <div className="h-full flex gap-4 overflow-x-auto pb-4">
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds
          .map(taskId => filteredData.tasks[taskId])
          .filter(Boolean);

        return (
          <Column
            key={column.id}
            column={column}
            tasks={tasks}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onDeleteColumn={onDeleteColumn}
          />
        );
      })}
    </div>
  );
}

export default Board;