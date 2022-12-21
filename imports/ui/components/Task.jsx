import React from "react";

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <li className="task-list">
      <div className="check-item">
        <input
          type="checkbox"
          checked={!!task.isChecked}
          onClick={() => onCheckboxClick(task)}
          readOnly
        />
        <span>{task.text}</span>
      </div>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
    </li>
  );
};
