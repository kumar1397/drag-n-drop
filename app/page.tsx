"use client"

import React, { useState } from "react";

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

interface DraggingTask {
  task: string;
  columnId: string;
}

const App: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: "col1", title: "Event 1", tasks: ["Task 1", "Task 2"] },
    { id: "col2", title: "Event 2", tasks: ["Task 3","Task 4"] },
    { id: "col3", title: "Event 3", tasks: ["Task 5", "Task 6"] },
    { id: "col4", title: "Event 4", tasks: ["Task 7", "Task 8"] },
  ]);

  const [draggingTask, setDraggingTask] = useState<DraggingTask | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [hoveredTaskIndex, setHoveredTaskIndex] = useState<number | null>(null);

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: string,
    columnId: string
  ) => {
    setDraggingTask({ task, columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string,
    index: number | null = null
  ) => {
    e.preventDefault();
    setHoveredColumn(columnId);
    setHoveredTaskIndex(index);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();

    if (draggingTask) {
      const sourceColumnId = draggingTask.columnId;
      const sourceTask = draggingTask.task;

      const updatedColumns = columns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
          };
        }

        if (column.id === columnId) {
          const newTasks = [...column.tasks];
          const dropIndex =
            hoveredTaskIndex !== null ? hoveredTaskIndex : newTasks.length;
          newTasks.splice(dropIndex, 0, sourceTask);
          return { ...column, tasks: newTasks };
        }

        return column;
      });

      setColumns(updatedColumns);
      setDraggingTask(null);
      setHoveredColumn(null);
      setHoveredTaskIndex(null);
    }
  };

  return (
    <div className="flex gap-4 p-6 bg-gray-100 min-h-screen justify-center">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`w-64 bg-white p-4 rounded-md shadow-md border ${hoveredColumn === column.id ? "border-yellow-400" : "border-gray-300"}`}
          onDragOver={(e) => onDragOver(e, column.id)}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <h2 className="text-lg font-semibold text-center mb-4 text-black">
            {column.title}
          </h2>
          <div className="space-y-2">
            {column.tasks.map((task, index) => (
              <div key={task} className={`p-3 bg-gray-200 rounded-md cursor-grab border text-black ${hoveredTaskIndex === index && hoveredColumn === column.id ? "border-blue-400 ": "border-gray-300"}`} draggable onDragStart={(e) => onDragStart(e, task, column.id)}
                onDragOver={(e) => onDragOver(e, column.id, index)}>
                {task}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;

