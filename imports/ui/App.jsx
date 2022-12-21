import React from "react";
import { Task } from "./components/Task.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "../api/Collections/TasksCollection.js";
import { TaskForm } from "./components/TaskForm.jsx";

export const App = () => {
  const tasks = useTracker(() =>
    TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  const toggleChecked = ({ _id, isChecked }) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked,
      },
    });
  };

  const deleteTask = ({ _id }) => TasksCollection.remove(_id);

  return (
    <div className="App">
      <h1>Welcome to Meteor Todo App!</h1>

      <div className="task-container">
        <TaskForm />

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
