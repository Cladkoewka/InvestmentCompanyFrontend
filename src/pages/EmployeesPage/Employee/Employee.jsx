import React, { useState } from "react";
import "./Employee.css";

const Employee = ({ employee, departments, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);

  const handleSaveEdit = () => {
    onEdit(editedEmployee);
    setIsEditing(false);
  };

  return (
    <div className="employee-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedEmployee.firstName}
            onChange={(e) => setEditedEmployee({ ...editedEmployee, firstName: e.target.value })}
          />
          <input
            type="text"
            value={editedEmployee.lastName}
            onChange={(e) => setEditedEmployee({ ...editedEmployee, lastName: e.target.value })}
          />
          <select
            value={editedEmployee.departmentId}
            onChange={(e) => setEditedEmployee({ ...editedEmployee, departmentId: e.target.value })}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <div className="button-container">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span>
            {employee.firstName} {employee.lastName} - {departments.find((d) => d.id === employee.departmentId)?.name || "Unknown"}
          </span>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(employee.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Employee;
