// EditTaskForm.jsx
import React, { useState } from "react";
export default function EditTaskForm({ task, onCancel, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...task, title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
          Save
        </button>
      </div>
    </form>
  );
}
