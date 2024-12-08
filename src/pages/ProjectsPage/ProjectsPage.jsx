import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Project from "./Project/Project";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [risks, setRisks] = useState([]);
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
        // Загружаем проекты, клиентов, редакторов, активы, департаменты и риски
        const [projectsResponse, customersResponse, editorsResponse, assetsResponse, departmentsResponse, risksResponse] = await Promise.all([
          axios.get("http://localhost:5149/api/project", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/customer", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/editor", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/asset", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/department", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5149/api/risk", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsResponse.data);
        setCustomers(customersResponse.data);
        setEditors(editorsResponse.data);
        setAssets(assetsResponse.data);
        setDepartments(departmentsResponse.data);
        setRisks(risksResponse.data);
        
        // Загружаем связанные данные для каждого проекта
        const projectAssetsPromises = projectsResponse.data.map(project =>
          axios.get(`http://localhost:5149/api/projectassetlink/project/${project.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const projectDepartmentsPromises = projectsResponse.data.map(project =>
          axios.get(`http://localhost:5149/api/projectdepartmentlink/project/${project.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const projectRisksPromises = projectsResponse.data.map(project =>
          axios.get(`http://localhost:5149/api/projectrisklink/project/${project.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        

        // Ждём загрузки всех связанных данных
        const [projectAssets, projectDepartments, projectRisks] = await Promise.all([
          Promise.all(projectAssetsPromises),
          Promise.all(projectDepartmentsPromises),
          Promise.all(projectRisksPromises),
        ]);
        

        // Обновляем проекты с добавленными данными
        const updatedProjects = projectsResponse.data.map((project, index) => ({
          ...project,
          assetIds: projectAssets[index].data.assetIds,
          departmentIds: projectDepartments[index].data.departmentIds,
          riskIds: projectRisks[index].data.riskIds,
        }));

        setProjects(updatedProjects);

        
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const handleAddProject = async () => {
    if (!isAuthenticated) return;

    try {
        // Сначала добавляем проект
        const response = await axios.post(
            "http://localhost:5149/api/project",
            newProject,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const createdProject = response.data;

        // Теперь добавляем связи для assets, risks и departments
        // Приводим значения к числовому типу
        await Promise.all([
            newProject.assetIds.map(assetId =>
                axios.post(
                    `http://localhost:5149/api/projectassetlink`,
                    { projectId: createdProject.id, assetId: Number(assetId) }, // Преобразуем в число
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ),
            newProject.riskIds.map(riskId =>
                axios.post(
                    `http://localhost:5149/api/projectrisklink`,
                    { projectId: createdProject.id, riskId: Number(riskId) }, // Преобразуем в число
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ),
            newProject.departmentIds.map(departmentId =>
                axios.post(
                    `http://localhost:5149/api/projectdepartmentlink`,
                    { projectId: createdProject.id, departmentId: Number(departmentId) }, // Преобразуем в число
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ),
        ]);

        const updatedProject = {
            ...createdProject,
            assetIds: newProject.assetIds,
            riskIds: newProject.riskIds,
            departmentIds: newProject.departmentIds,
        };

        setProjects((prev) => [...prev, updatedProject]);
        setNewProject({
            name: "",
            status: "",
            profit: 0,
            cost: 0,
            deadline: "",
            customerId: "",
            editorId: "",
            assetIds: [],
            departmentIds: [],
            riskIds: [],
        });
    } catch (error) {
        console.error("Error adding project:", error);
    }
};


const handleEditProject = async (updatedProject) => {
    try {
        // Сначала редактируем проект
        await axios.put(
            `http://localhost:5149/api/project/${updatedProject.id}`,
            updatedProject,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Удаляем все старые связи
        await Promise.all([
            // Удаляем связи с активами
            axios.delete(`http://localhost:5149/api/projectassetlink/project/${updatedProject.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            // Удаляем связи с департаментами
            axios.delete(`http://localhost:5149/api/projectrisklink/project/${updatedProject.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            // Удаляем связи с рисками
            axios.delete(`http://localhost:5149/api/projectdepartmentlink/project/${updatedProject.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
        ]);

        // Добавляем новые
        await Promise.all([
            updatedProject.assetIds && updatedProject.assetIds.length > 0 ? updatedProject.assetIds.map(assetId =>
                axios.post(
                    `http://localhost:5149/api/projectassetlink`,
                    { projectId: updatedProject.id, assetId: Number(assetId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ) : [],

            updatedProject.riskIds && updatedProject.riskIds.length > 0 ? updatedProject.riskIds.map(riskId =>
                axios.post(
                    `http://localhost:5149/api/projectrisklink`,
                    { projectId: updatedProject.id, riskId: Number(riskId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ) : [],

            updatedProject.departmentIds && updatedProject.departmentIds.length > 0 ? updatedProject.departmentIds.map(departmentId =>
                axios.post(
                    `http://localhost:5149/api/projectdepartmentlink`,
                    { projectId: updatedProject.id, departmentId: Number(departmentId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ) : [],
        ]);
        
        
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );

        

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
              <select
                value={newProject.assetIds}
                onChange={(e) => setNewProject({
                    ...newProject,
                    assetIds: Array.isArray(e.target.value) ? e.target.value : [e.target.value]  // Преобразуем в массив
                })}
                multiple
                >
                {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                    {asset.name}
                    </option>
                ))}
                </select>

                <select
                value={newProject.departmentIds}
                onChange={(e) => setNewProject({
                    ...newProject,
                    departmentIds: Array.isArray(e.target.value) ? e.target.value : [e.target.value]  // Преобразуем в массив
                })}
                multiple
                >
                {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                    {department.name}
                    </option>
                ))}
                </select>

                <select
                value={newProject.riskIds}
                onChange={(e) => setNewProject({
                    ...newProject,
                    riskIds: Array.isArray(e.target.value) ? e.target.value : [e.target.value]  // Преобразуем в массив
                })}
                multiple
                >
                {risks.map((risk) => (
                    <option key={risk.id} value={risk.id}>
                    {risk.type}
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
                  assets={assets}
                  departments={departments}
                  risks={risks}
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