import React, { useState } from "react";
import { Task } from "./components/Task.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "../api/Collections/TasksCollection.js";
import { TaskForm } from "./components/TaskForm.jsx";

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  // filter tasks
  const hideCompletedFilter = { isChecked: { $ne: true } };

  // get data from db sorted by latest date created
  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch()
  );

  // update task if checked
  const toggleChecked = ({ _id, isChecked }) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked,
      },
    });
  };

  // delete a task
  const deleteTask = ({ _id }) => TasksCollection.remove(_id);

  // count number of uncompleted/pending tasks
  const pendingTasksCount = useTracker(() =>
    TasksCollection.find(hideCompletedFilter).count()
  );

  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : ""
  }`;

  return (
    <div className="App">
      <h1>Welcome to Meteor Todo App!</h1>

      <div className="task-container">
        <h3>To Do List {pendingTasksTitle}</h3>

        <TaskForm />

        <div className="filter">
          <button onClick={() => setHideCompleted(!hideCompleted)}>
            {hideCompleted ? "Show All" : "Hide Completed"}
          </button>
        </div>

        <ul className="list">
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onCheckboxClick={toggleChecked}
              onDeleteClick={deleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
