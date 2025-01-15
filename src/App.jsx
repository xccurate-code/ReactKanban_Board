import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Board from './components/Board';
import Header from './components/Header';

const initialData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: []
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: []
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: []
    }
  },
  tasks: {},
  columnOrder: ['column-1', 'column-2', 'column-3']
};

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('kanbanData');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('kanbanData', JSON.stringify(data));
  }, [data]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];
    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    const newDestTaskIds = source.droppableId === destination.droppableId
      ? newSourceTaskIds
      : Array.from(destColumn.taskIds);

    newSourceTaskIds.splice(source.index, 1);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          taskIds: newSourceTaskIds
        },
        [destColumn.id]: {
          ...destColumn,
          taskIds: newDestTaskIds
        }
      }
    };

    setData(newData);
  };

  const addTask = (columnId, task) => {
    const taskId = uuidv4();
    const newTask = {
      id: taskId,
      ...task,
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };

    const column = data.columns[columnId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.push(taskId);

    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: newTask
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds
        }
      }
    });
  };

  const updateTask = (taskId, updatedTask) => {
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          ...updatedTask
        }
      }
    });
  };

  const deleteTask = (columnId, taskId) => {
    const column = data.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds
        }
      }
    });
  };

  const addColumn = (title) => {
    const columnId = uuidv4();
    const newColumn = {
      id: columnId,
      title,
      taskIds: []
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: newColumn
      },
      columnOrder: [...data.columnOrder, columnId]
    });
  };

  const deleteColumn = (columnId) => {
    const newColumns = { ...data.columns };
    delete newColumns[columnId];
    const newColumnOrder = data.columnOrder.filter(id => id !== columnId);

    setData({
      ...data,
      columns: newColumns,
      columnOrder: newColumnOrder
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddColumn={addColumn}
      />
      <div className="p-4 h-[calc(100vh-64px)] overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Board
            data={data}
            searchTerm={searchTerm}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onDeleteColumn={deleteColumn}
          />
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;