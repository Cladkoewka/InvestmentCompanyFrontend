import React, { useState } from "react";
import './Editor.css';

const Editor = ({ editor, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(editor.fullName);
  const [newEmail, setNewEmail] = useState(editor.email);
  const [newPhoneNumber, setNewPhoneNumber] = useState(editor.phoneNumber);

  const handleSaveEdit = () => {
    // Обновление редактора через переданную функцию onEdit
    onEdit({
      ...editor,
      fullName: newFullName,
      email: newEmail,
      phoneNumber: newPhoneNumber,
    });
    setIsEditing(false);  // Закрыть форму редактирования
  };

  return (
    <div className="editor-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="tel"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span>{editor.fullName}</span>
          <p>{editor.email}</p>
          <p>{editor.phoneNumber}</p>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(editor.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Editor;
