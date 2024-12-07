import React, { useState } from "react";
import './Risk.css';

const Risk = ({ risk, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRisk, setEditedRisk] = useState({ type: risk.type, grade: risk.grade });

  const handleSaveEdit = () => {
    onEdit({ ...risk, ...editedRisk });
    setIsEditing(false);
  };

  return (
    <div className="risk-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedRisk.type}
            onChange={(e) => setEditedRisk({ ...editedRisk, type: e.target.value })}
          />
          <input
            type="number"
            value={editedRisk.grade}
            onChange={(e) => setEditedRisk({ ...editedRisk, grade: e.target.value })}
          />
          <div className="button-container">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span>Risk Type: {risk.type}</span>
          <span>Grade: {risk.grade}</span>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(risk.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Risk;
