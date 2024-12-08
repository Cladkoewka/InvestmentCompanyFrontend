import React, { useState } from "react";
import "./Project.css";

const Project = ({ project, customers, editors, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleSaveEdit = () => {
    onEdit(editedProject);
    setIsEditing(false);
  };

  return (
    <div className="project-item">
      {isEditing ? (
        <>
          <label>Name:</label>
          <input
            type="text"
            value={editedProject.name}
            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
          />
          
          <label>Status:</label>
          <select
            value={editedProject.status}
            onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
          >
            <option value="Completed">Completed</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
          </select>

          <label>Profit:</label>
          <input
            type="number"
            value={editedProject.profit}
            onChange={(e) => setEditedProject({ ...editedProject, profit: e.target.value })}
          />
          
          <label>Cost:</label>
          <input
            type="number"
            value={editedProject.cost}
            onChange={(e) => setEditedProject({ ...editedProject, cost: e.target.value })}
          />
          
          <label>Deadline:</label>
          <input
            type="date"
            value={editedProject.deadline}
            onChange={(e) => setEditedProject({ ...editedProject, deadline: e.target.value })}
          />
          
          <label>Customer:</label>
          <select
            value={editedProject.customerId}
            onChange={(e) => setEditedProject({ ...editedProject, customerId: e.target.value })}
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          
          <label>Editor:</label>
          <select
            value={editedProject.editorId}
            onChange={(e) => setEditedProject({ ...editedProject, editorId: e.target.value })}
          >
            {editors.map((editor) => (
              <option key={editor.id} value={editor.id}>
                {editor.fullName}
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
          <span className="project-details">
          <div>
            <strong>Name:</strong> {project.name}
          </div>
          <div>
            <strong>Status:</strong> {project.status}
          </div>
          <div>
            <strong>Profit:</strong> {project.profit}
          </div>
          <div>
            <strong>Cost:</strong> {project.cost}
          </div>
          <div>
            <strong>Deadline:</strong> {project.deadline}
          </div>
          <div>
            <strong>Customer:</strong> {customers.find((c) => c.id === project.customerId)?.name || "Unknown"}
          </div>
          <div>
            <strong>Editor:</strong> {editors.find((e) => e.id === project.editorId)?.fullName || "Unknown"}
          </div>
          </span>
          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(project.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Project;


/*
  return (
    <div className="project-item">
      {isEditing ? (
        <>
          <div className="edit-field">
            <label htmlFor="name">Project Name:</label>
            <input
              id="name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="edit-field">
            <label htmlFor="status">Status:</label>
            <input
              id="status"
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </div>

          <div className="edit-field">
            <label htmlFor="profit">Profit ($):</label>
            <input
              id="profit"
              type="number"
              value={newProfit}
              onChange={(e) => setNewProfit(e.target.value)}
            />
          </div>

          <div className="edit-field">
            <label htmlFor="cost">Cost ($):</label>
            <input
              id="cost"
              type="number"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
            />
          </div>

          <div className="edit-field">
            <label htmlFor="deadline">Deadline:</label>
            <input
              id="deadline"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>

          <div className="edit-field">
            <label htmlFor="customer">Customer:</label>
            <select
              id="customer"
              value={newCustomerId}
              onChange={(e) => setNewCustomerId(e.target.value)}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-field">
            <label htmlFor="editor">Editor:</label>
            <select
              id="editor"
              value={newEditorId}
              onChange={(e) => setNewEditorId(e.target.value)}
            >
              {editors.map((editor) => (
                <option key={editor.id} value={editor.id}>
                  {editor.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-field">
            <label htmlFor="risks">Risks:</label>
            <select
              id="risks"
              multiple
              value={newRisks}
              onChange={(e) => handleSelectionChange(e, setNewRisks)}
            >
              {risks.map((risk) => (
                <option key={risk.id} value={risk.id}>
                  {risk.type}
                </option>
              ))}
            </select>
          </div>

        <div className="edit-field">
          <label htmlFor="departments">Departments:</label>
          <select
            id="departments"
            multiple
            value={newDepartments}
            onChange={(e) => handleSelectionChange(e, setNewDepartments)} // Use newDepartments here
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="edit-field">
          <label htmlFor="assets">Assets:</label>
          <select
            id="assets"
            multiple
            value={newAssets}
            onChange={(e) => handleSelectionChange(e, setNewAssets)} // Use newAssets here
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

          <button onClick={handleSaveEdit}>Save</button>
        </>
      ) : (
        <>
          <span>Project Name: {project.name}</span>
          <span>Status: {project.status}</span>
          <span>Profit: {project.profit}$</span>
          <span>Cost: {project.cost}$</span>
          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          <span>Customer: {customers.find(c => c.id === newCustomerId)?.name || "N/A"}</span>
          <span>Editor: {editors.find(editor => editor.id === newEditorId)?.fullName || "N/A"}</span>
          <div className="related-info">
          <p>
            <strong>Risks:</strong>{" "}
            {risks
              .filter(risk => project.risks?.includes(risk.id))
              .map(risk => risk.type)
              .join(", ") || "N/A"}
          </p>
          <p>
            <strong>Departments:</strong>{" "}
            {departments
              .filter(department => project.departments?.includes(department.id))
              .map(department => department.name)
              .join(", ") || "N/A"}
          </p>
          <p>
            <strong>Assets:</strong>{" "}
            {assets
              .filter(asset => project.assets?.includes(asset.id))
              .map(asset => asset.name)
              .join(", ") || "N/A"}
          </p>
        </div>

          {isAdmin && (
            <div className="button-container">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(project.id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
*/
