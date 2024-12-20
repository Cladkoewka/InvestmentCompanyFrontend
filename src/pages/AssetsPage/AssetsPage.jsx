import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Asset from "./Asset/Asset";
import './AssetPage.css';

const AssetsPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [assets, setAssets] = useState([]);
  const [newAssetName, setNewAssetName] = useState("");
  const { role } = useAuth(); 
  const isAdmin = role === "Admin";

  // Проверяем авторизацию через localStorage или AuthContext
  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchAssets = async () => {
      if (!isAuthenticated) return; // Если пользователь не авторизован, не делаем запрос

      try {
        const response = await axios.get(`${API_BASE_URL}/asset`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [isAuthenticated, token]);

  const handleAddAsset = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/asset`,
        { name: newAssetName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssets((prevAssets) => [...prevAssets, response.data]);
      setNewAssetName("");
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const handleEditAsset = async (updatedAsset) => {
    try {
      await axios.put(
        `${API_BASE_URL}/asset/${updatedAsset.id}`,
        updatedAsset,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === updatedAsset.id ? updatedAsset : asset
        )
      );
    } catch (error) {
      console.error("Error editing asset:", error);
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/asset/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <div>
      <h1>Assets</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to your account.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-asset-form">
              <input
                type="text"
                placeholder="New asset name"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
              />
              <button onClick={handleAddAsset}>Add Asset</button>
            </div>
          )}
          <ul>
            {assets.map((asset) => (
              <li key={asset.id}>
                <Asset
                  asset={asset}
                  isAdmin={isAdmin}
                  onEdit={(updatedAsset) => handleEditAsset(updatedAsset)}
                  onDelete={handleDeleteAsset}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AssetsPage;
