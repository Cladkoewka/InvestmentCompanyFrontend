import React, { useState } from "react";
import './Asset.css';

const Asset = ({ asset, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(asset.name);

  const handleSaveEdit = () => {
    // Обновление актива через переданную функцию onEdit
    onEdit({ ...asset, name: newName });
    setIsEditing(false);  // Закрыть форму редактирования
  };

  return (
    <div className="asset-item">
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
            <span>{asset.name}</span>
            {isAdmin && (
                <div className="button-container">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => onDelete(asset.id)}>Delete</button>
                </div>
            )}
            </>
        )}
        </div>
  );
};

export default Asset;
