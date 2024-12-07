import React, { useState } from "react";
import "./Department.css";

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
          <div className="department-header">
            <span>{department.name}</span>
            {isAdmin && (
              <div className="button-container">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => onDelete(department.id)}>Delete</button>
              </div>
            )}
          </div>
          <div className="employee-list">
            <h4>Employees:</h4>
            {department.employees && department.employees.length > 0 ? (
              <ul>
                {department.employees.map((employee) => (
                  <li key={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No employees in this department.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Department;
