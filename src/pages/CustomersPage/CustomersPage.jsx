import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Customer from "./Customer/Customer";
import './CustomersPage.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState("");
  const { role } = useAuth();
  const isAdmin = role === "Admin";

  const token = localStorage.getItem("token");
  const isAuthenticated = token != null;

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get("http://localhost:5149/api/customer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [isAuthenticated, token]);

  const handleAddCustomer = async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5149/api/customer",
        { name: newCustomerName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers((prevCustomers) => [...prevCustomers, response.data]);
      setNewCustomerName("");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      await axios.put(
        `http://localhost:5149/api/customer/${updatedCustomer.id}`,
        updatedCustomer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
    } catch (error) {
      console.error("Error editing customer:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:5149/api/customer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id)
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="main-content">
      <h1>Customers</h1>
      {!isAuthenticated ? (
        <div className="login-message">
          <p>Log in to your account.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="add-customer-form">
              <input
                type="text"
                placeholder="New customer name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
              <button onClick={handleAddCustomer}>Add Customer</button>
            </div>
          )}
          <ul>
            {customers.map((customer) => (
              <li key={customer.id}>
                <Customer
                  customer={customer}
                  isAdmin={isAdmin}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CustomersPage;
