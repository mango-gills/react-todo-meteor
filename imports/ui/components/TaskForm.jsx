import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { TasksCollection } from "../../api/Collections/TasksCollection";

export const TaskForm = ({ user }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) return;

    // TasksCollection.insert({
    //   text: text.trim(),
    //   userId: user._id,
    //   createdAt: new Date(),
    // });

    Meteor.call("tasks.insert", text);

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-input"
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};
