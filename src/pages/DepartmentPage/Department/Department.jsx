import React, { useState } from "react";
import './Department.css';

const Department = ({ department, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(department.name);

  const handleSaveEdit = () => {
    onEdit({ ...department, name: newName });
    setIsEditing(false);
  };

  return (
    <div className="department-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span>{department.name}</span>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(department.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Department;
