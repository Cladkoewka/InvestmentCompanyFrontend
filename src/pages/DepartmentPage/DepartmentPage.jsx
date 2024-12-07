import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Department from "./Department/Department";
import './DepartmentPage.css';

const DepartmentPage = () => {
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
        const response = await axios.get("http://localhost:5149/api/department", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
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
        "http://localhost:5149/api/department",
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
        `http://localhost:5149/api/department/${updatedDepartment.id}`,
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
      await axios.delete(`http://localhost:5149/api/department/${id}`, {
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
    <div className="main-content">
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
