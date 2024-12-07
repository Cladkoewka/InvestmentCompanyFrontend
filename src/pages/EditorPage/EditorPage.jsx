import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Editor from "./Editor/Editor";
import './EditorPage.css';

const EditorPage = () => {
  const [editors, setEditors] = useState([]);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const { role } = useAuth(); 
  const isAdmin = role === "Admin";

  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchEditors = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get("http://localhost:5149/api/editor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditors(response.data);
      } catch (error) {
        console.error("Error fetching editors:", error);
      }
    };

    fetchEditors();
  }, [isAuthenticated, token]);

  const handleAddEditor = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5149/api/editor",
        { fullName: newFullName, email: newEmail, phoneNumber: newPhoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditors((prevEditors) => [...prevEditors, response.data]);
      setNewFullName("");
      setNewEmail("");
      setNewPhoneNumber("");
    } catch (error) {
      console.error("Error adding editor:", error);
    }
  };

  const handleEditEditor = async (updatedEditor) => {
    try {
      await axios.put(
        `http://localhost:5149/api/editor/${updatedEditor.id}`,
        updatedEditor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditors((prevEditors) =>
        prevEditors.map((editor) =>
          editor.id === updatedEditor.id ? updatedEditor : editor
        )
      );
    } catch (error) {
      console.error("Error editing editor:", error);
    }
  };

  const handleDeleteEditor = async (id) => {
    try {
      await axios.delete(`http://localhost:5149/api/editor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditors((prevEditors) => prevEditors.filter((editor) => editor.id !== id));
    } catch (error) {
      console.error("Error deleting editor:", error);
    }
  };

  return (
    <div>
      <h1>Editors</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to your account.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-editor-form">
              <input
                type="text"
                placeholder="Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
              />
              <button onClick={handleAddEditor}>Add Editor</button>
            </div>
          )}
          <ul>
            {editors.map((editor) => (
              <li key={editor.id}>
                <Editor
                  editor={editor}
                  isAdmin={isAdmin}
                  onEdit={(updatedEditor) => handleEditEditor(updatedEditor)}
                  onDelete={handleDeleteEditor}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EditorPage;
