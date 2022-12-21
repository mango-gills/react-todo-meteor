import React, { Fragment, useState } from "react";
import { Task } from "./components/Task.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "../api/Collections/TasksCollection.js";
import { TaskForm } from "./components/TaskForm.jsx";
import { LoginForm } from "./components/LoginForm.jsx";

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  // get user
  const user = useTracker(() => Meteor.user());

  // filter tasks
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  // get data from db sorted by latest date created
  const tasks = useTracker(() => {
    if (!user) {
      return [];
    }

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  });

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
  const pendingTasksCount = useTracker(() => {
    if (!user) {
      return 0;
    }

    return TasksCollection.find(pendingOnlyFilter).count();
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : ""
  }`;

  const logout = () => Meteor.logout();

  return (
    <div className="App">
      {user ? (
        <Fragment>
          <h1>Welcome to Meteor Todo App!</h1>

          <div className="task-container">
            <div className="task-header">
              <h3>To Do List {pendingTasksTitle}</h3>

              <div className="user" onClick={logout}>
                {user.username}🚪
              </div>
            </div>

            <TaskForm user={user} />

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
        </Fragment>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
