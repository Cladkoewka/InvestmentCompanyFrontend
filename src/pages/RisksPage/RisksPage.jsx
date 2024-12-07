import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Risk from "./Risk/Risk";
import './RisksPage.css';

const RisksPage = () => {
  const [risks, setRisks] = useState([]);
  const [newRisk, setNewRisk] = useState({ type: "", grade: "" });
  const { role } = useAuth();
  const isAdmin = role === "Admin";

  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchRisks = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get("http://localhost:5149/api/risk", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRisks(response.data);
      } catch (error) {
        console.error("Error fetching risks:", error);
      }
    };

    fetchRisks();
  }, [isAuthenticated, token]);

  const handleAddRisk = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5149/api/risk",
        newRisk,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRisks((prevRisks) => [...prevRisks, response.data]);
      setNewRisk({ type: "", grade: "" });
    } catch (error) {
      console.error("Error adding risk:", error);
    }
  };

  const handleEditRisk = async (updatedRisk) => {
    try {
      await axios.put(
        `http://localhost:5149/api/risk/${updatedRisk.id}`,
        updatedRisk,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRisks((prevRisks) =>
        prevRisks.map((risk) =>
          risk.id === updatedRisk.id ? updatedRisk : risk
        )
      );
    } catch (error) {
      console.error("Error editing risk:", error);
    }
  };

  const handleDeleteRisk = async (id) => {
    try {
      await axios.delete(`http://localhost:5149/api/risk/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRisks((prevRisks) => prevRisks.filter((risk) => risk.id !== id));
    } catch (error) {
      console.error("Error deleting risk:", error);
    }
  };

  return (
    <div>
      <h1>Risks</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to your account.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-risk-form">
              <input
                type="text"
                placeholder="Risk Type"
                value={newRisk.type}
                onChange={(e) => setNewRisk({ ...newRisk, type: e.target.value })}
              />
              <input
                type="number"
                placeholder="Grade"
                value={newRisk.grade}
                onChange={(e) => setNewRisk({ ...newRisk, grade: e.target.value })}
              />
              <button onClick={handleAddRisk}>Add Risk</button>
            </div>
          )}
          <ul>
            {risks.map((risk) => (
              <li key={risk.id}>
                <Risk
                  risk={risk}
                  isAdmin={isAdmin}
                  onEdit={handleEditRisk}
                  onDelete={handleDeleteRisk}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RisksPage;
