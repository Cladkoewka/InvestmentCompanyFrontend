import React, { useState } from "react";
import "./Project.css";

const Project = ({ project, customers, editors, risks, departments, assets, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleSaveEdit = () => {
    onEdit(editedProject);
    setIsEditing(false);
  };

  const handleSelectionChange = (e, setter) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setter(selectedValues);
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

          <label>Risks:</label>
          <select
            multiple
            value={editedProject.riskIds}
            onChange={(e) => handleSelectionChange(e, (values) => setEditedProject({ ...editedProject, riskIds: values }))}
          >
            
            {risks.map((risk) => (
              <option key={risk.id} value={risk.id}>
                {risk.type}
              </option>
            ))}
          </select>

          <label>Departments:</label>
          <select
            multiple
            value={editedProject.departmentIds}
            onChange={(e) => handleSelectionChange(e, (values) => setEditedProject({ ...editedProject, departmentIds: values }))}
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>

          <label>Assets:</label>
          <select
            multiple
            value={editedProject.assetIds}
            onChange={(e) => handleSelectionChange(e, (values) => setEditedProject({ ...editedProject, assetIds: values }))}
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
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


          <div>
            <strong>Assets:</strong>
            <ul>
              {assets.filter((asset) =>
                project.assetIds && project.assetIds.map(Number).includes(asset.id)
              ).length > 0
                ? assets
                    .filter((asset) =>
                      project.assetIds && project.assetIds.map(Number).includes(asset.id)
                    )
                    .map((asset) => <li key={asset.id}>{asset.name}</li>)
                : <li>N/A</li>}
            </ul>
          </div>

          <div>
            <strong>Departments:</strong>
            <ul>
              {departments.filter((department) =>
                project.departmentIds &&
                project.departmentIds.map(Number).includes(department.id)
              ).length > 0
                ? departments
                    .filter((department) =>
                      project.departmentIds &&
                      project.departmentIds.map(Number).includes(department.id)
                    )
                    .map((department) => <li key={department.id}>{department.name}</li>)
                : <li>N/A</li>}
            </ul>
          </div>

          <div>
            <strong>Risks:</strong>
            <ul>
              {risks.filter((risk) =>
                project.riskIds && project.riskIds.map(Number).includes(risk.id)
              ).length > 0
                ? risks
                    .filter((risk) =>
                      project.riskIds && project.riskIds.map(Number).includes(risk.id)
                    )
                    .map((risk) => <li key={risk.id}>{risk.type}</li>)
                : <li>N/A</li>}
            </ul>
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

export default Project;
