import React, { useState } from "react";
import './Customer.css';

const Customer = ({ customer, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(customer.name);

  const handleSaveEdit = () => {
    onEdit({ ...customer, name: newName });
    setIsEditing(false);
  };

  return (
    <div className="customer-item">
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
          <span>{customer.name}</span>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(customer.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customer;
