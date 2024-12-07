import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5149/api/asset', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAssets(response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="main-content">
      <h1>Assets</h1>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>{asset.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssetsPage;
