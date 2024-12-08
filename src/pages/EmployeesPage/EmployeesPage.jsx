import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Employee from "./Employee/Employee";
import "./EmployeesPage.css";

const EmployeesPage = () => {
  const API_BASE_URL = 'http://localhost:5149/api';
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: "", lastName: "", departmentId: "" });
  const { role } = useAuth();
  const isAdmin = role === "Admin";
  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/employee`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/department`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setEmployees(employeesResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const handleAddEmployee = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/employee`,
        newEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees((prev) => [...prev, response.data]);
      setNewEmployee({ firstName: "", lastName: "", departmentId: "" });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = async (updatedEmployee) => {
    try {
      await axios.put(
        `${API_BASE_URL}/employee/${updatedEmployee.id}`,
        updatedEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Перезагрузить данные после обновления
      const response = await axios.get(`${API_BASE_URL}/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };
  

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="employees-page">
      <h1>Employees</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to manage employees.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-employee-form">
              <input
                type="text"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
              />
              <select
                value={newEmployee.departmentId}
                onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddEmployee}>Add Employee</button>
            </div>
          )}
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                <Employee
                  employee={employee}
                  departments={departments}
                  isAdmin={isAdmin}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EmployeesPage;
