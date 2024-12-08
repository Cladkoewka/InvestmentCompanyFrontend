import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Project from "./Project/Project";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    status: "",
    profit: 0,
    cost: 0,
    deadline: "",
    customerId: "",
    editorId: "",
  });
  const { role } = useAuth();
  const isAdmin = role === "Admin";
  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [projectsResponse, customersResponse, editorsResponse] = await Promise.all([
          axios.get("http://localhost:5149/api/project", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/customer", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/editor", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsResponse.data);
        setCustomers(customersResponse.data);
        setEditors(editorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const handleAddProject = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(
        "http://localhost:5149/api/project",
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) => [...prev, response.data]);
      setNewProject({
        name: "",
        status: "",
        profit: 0,
        cost: 0,
        deadline: "",
        customerId: "",
        editorId: "",
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      await axios.put(
        `http://localhost:5149/api/project/${updatedProject.id}`,
        updatedProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get("http://localhost:5149/api/project", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5149/api/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to manage projects.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-project-form">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>

              <input
                type="number"
                placeholder="Profit"
                value={newProject.profit}
                onChange={(e) => setNewProject({ ...newProject, profit: e.target.value })}
              />
              <input
                type="number"
                placeholder="Cost"
                value={newProject.cost}
                onChange={(e) => setNewProject({ ...newProject, cost: e.target.value })}
              />
              <input
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              />
              <select
                value={newProject.customerId}
                onChange={(e) => setNewProject({ ...newProject, customerId: e.target.value })}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <select
                value={newProject.editorId}
                onChange={(e) => setNewProject({ ...newProject, editorId: e.target.value })}
              >
                <option value="">Select Editor</option>
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>
                    {editor.fullName}
                  </option>
                ))}
              </select>
              <button onClick={handleAddProject}>Add Project</button>
            </div>
          )}
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Project
                  project={project}
                  customers={customers}
                  editors={editors}
                  isAdmin={isAdmin}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;


/*
// 1. Получаем связанные Id
      const [assetIdsResponse, departmentIdsResponse, riskIdsResponse] = await Promise.all([
        axios.get(http://localhost:5149/api/projectassetlink/project/${project.id}, {
          headers: { Authorization: Bearer ${token} },
        }),
        axios.get(http://localhost:5149/api/projectdepartmentlink/project/${project.id}, {
          headers: { Authorization: Bearer ${token} },
        }),
        axios.get(http://localhost:5149/api/projectrisklink/project/${project.id}, {
          headers: { Authorization: Bearer ${token} },
        }),
      ]);

      const assetIds = assetIdsResponse.data.AssetIds || [];
      console.debug(assetIds);
      const departmentIds = departmentIdsResponse.data.DepartmentIds || [];
      const riskIds = riskIdsResponse.data.RiskIds || [];

      // 2. Получаем полные данные для связанных сущностей
      const [assetsResponse, departmentsResponse, risksResponse] = await Promise.all([
        axios.get("http://localhost:5149/api/asset", {
          params: { ids: assetIds },
          headers: { Authorization: Bearer ${token} },
        }),
        axios.get("http://localhost:5149/api/department", {
          params: { ids: departmentIds },
          headers: { Authorization: Bearer ${token} },
        }),
        axios.get("http://localhost:5149/api/risk", {
          params: { ids: riskIds },
          headers: { Authorization: Bearer ${token} },
        }),
      ]);
      */