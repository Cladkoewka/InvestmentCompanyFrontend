import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Department from "./Department/Department";
import './DepartmentPage.css';

const DepartmentPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const { role } = useAuth();
  const isAdmin = role === "Admin";

  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!isAuthenticated) return;
  
      try {
        const response = await axios.get(`${API_BASE_URL}/department`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const departmentsWithEmployees = await Promise.all(
          response.data.map(async (department) => {
            const employeeResponse = await axios.get(
              `${API_BASE_URL}/employee/by-department/${department.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return {
              ...department,
              employees: employeeResponse.data,
            };
          })
        );
        setDepartments(departmentsWithEmployees);
      } catch (error) {
        console.error("Error fetching departments or employees:", error);
      }
    };
  
    fetchDepartments();
  }, [isAuthenticated, token]);

  const handleAddDepartment = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/department`,
        { name: newDepartmentName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments((prevDepartments) => [...prevDepartments, response.data]);
      setNewDepartmentName("");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleEditDepartment = async (updatedDepartment) => {
    try {
      await axios.put(
        `${API_BASE_URL}/department/${updatedDepartment.id}`,
        updatedDepartment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department.id === updatedDepartment.id ? updatedDepartment : department
        )
      );
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.id !== id)
      );
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div>
      <h1>Departments</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to your account.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-department-form">
              <input
                type="text"
                placeholder="New department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <button onClick={handleAddDepartment}>Add Department</button>
            </div>
          )}
          <ul>
            {departments.map((department) => (
              <li key={department.id}>
                <Department
                  department={department}
                  isAdmin={isAdmin}
                  onEdit={(updatedDepartment) =>
                    handleEditDepartment(updatedDepartment)
                  }
                  onDelete={handleDeleteDepartment}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DepartmentPage;
