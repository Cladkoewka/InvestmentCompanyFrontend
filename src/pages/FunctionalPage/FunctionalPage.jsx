import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import './FunctionalPage.css';

const FunctionalPage = () => {
  const API_BASE_URL = 'http://localhost:5149/api';
  const [profit, setProfit] = useState(null); // Состояние для хранения прибыли
  const [projects, setProjects] = useState([]); // Состояние для хранения проектов
  const [customerName, setCustomerName] = useState(""); // Состояние для ввода customerName
  const { role } = useAuth();
  const isAdmin = role === "Admin";

  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  // Обработчик для вызова функции получения общей прибыли
  const handleTotalProfitCallFunction = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/functional/totalprofit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfit(response.data.profit); // Ожидаем, что API вернет объект с полем profit
    } catch (error) {
      console.error("Error calling function:", error);
      setProfit(null); // Если ошибка, сбрасываем profit
    }
  };

  // Обработчик для вызова функции получения проектов по customerName
  const handleGetProjectsByCustomerName = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    if (!customerName) {
      console.log("Please provide a customer name.");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/functional/projects/${customerName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data); // Ожидаем, что API вернет список проектов
    } catch (error) {
      console.error("Error calling function:", error);
      setProjects([]); // Если ошибка, сбрасываем проекты
    }
  };

  return (
    <div>
      <h1>Functional Page</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to access the functions.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="call-total-profit-function">
              <button onClick={handleTotalProfitCallFunction}>Call Total Profit Function</button>
            </div>
          )}
          {profit !== null && (
            <div className="profit-display">
              <h2>Total Profit: {profit}</h2> {/* Отображаем прибыль */}
            </div>
          )}
          {profit === null && (
            <div className="response-message">
              <p>Profit data not available or error occurred.</p>
            </div>
          )}
          
          {/* Ввод customerName и кнопка для получения проектов */}
          {isAdmin && (
            <div className="get-projects-by-customer">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter Customer Name"
              />
              <button onClick={handleGetProjectsByCustomerName}>Get Projects for Customer</button>
            </div>
          )}
          
          {/* Отображение проектов */}
          {projects.length > 0 ? (
            <div className="projects-list">
              <h3>Projects for Customer: {customerName}</h3>
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <h4>{project.name}</h4>
                    <p>Status: {project.status}</p>
                    <p>Profit: {project.profit}</p>
                    <p>Cost: {project.cost}</p>
                    <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                    <p>Customer: {project.customerName}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            customerName && <p>No projects found for the given customer name.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FunctionalPage;
