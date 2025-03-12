import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar";
import "./budget.css";

const Budget = () => {
  const [category, setCategory] = useState("");
  let [amount, setAmount] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null); // Track edit state
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/budget/user-budgets/${userId}`)
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error("Error fetching budgets:", err));
  }, [userId]);

  const handleAddBudget = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }
    const newBudget = { category, amount, userId };

    try {
      const response = await fetch("http://localhost:5000/api/budget/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });

      const data = await response.json();
      if (response.ok) {
        setBudgets([...budgets, data.budget]);
        setCategory("");
        setAmount("");
        setShowForm(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/budget/delete/${id}`, { method: "DELETE" });

      if (response.ok) {
        setBudgets(budgets.filter((budget) => budget._id !== id));
      } else {
        alert("Error deleting budget.");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(budget.amount);
    setShowForm(true);
  };




  const handleUpdateBudget = async (e) => {
    e.preventDefault();
  
    if (!editingBudget) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/budget/update/${editingBudget._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount }),
      });
  
      const updatedBudget = await response.json();
  
      if (response.ok) {
        // Update the budgets state with the fully updated budget from the backend
        setBudgets(
          budgets.map((b) =>
            b._id === updatedBudget._id ? updatedBudget : b
          )
        );
  
        setCategory("");
        setAmount("");
        setEditingBudget(null);
        setShowForm(false);
      } else {
        alert("Error updating budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };
  




  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNavOpen && !event.target.closest(".sidebar") && !event.target.closest(".menu-icon")) {
        setIsNavOpen(false);
      }
    };

    if (isNavOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isNavOpen]);

  return (
    <div className="budget-container">
      <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />

      <main className="budget-content">
        <header className="header">
          <div className="menu-icon" onClick={toggleNav}>☰</div>
          <div>Budgets</div>
        </header>

        <h2>Adding Budget</h2>

        {!showForm && (
          <button className="add-budget-btn" onClick={() => setShowForm(true)}>➕ Add Budget</button>
        )}

        {showForm && (
          <form  className="main-form"onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}>
            <div className="form"><input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
            <div className="form"><input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
            <button type="submit" className="add-budget-btn">{editingBudget ? "Update Budget" : "Add Budget"}</button>
          </form>
        )}

        <h2>Your Budgets</h2>
        <div className="budget-display">
          {budgets.map((budget) => (
            <div key={budget._id} className="budget-card">
              <div className="budget-info">
                <span className="budget-category">{budget.category}</span>
                <span className="budget-amount"><span className="budget-amount_1">Total</span> {budget.amount}</span>
                <span className="budget-amount"><span className="budget-amount_1">Balance</span> {budget.availableAmount}</span>
              </div>
              <div className="budget-actions">
                <button className="edit-btn" onClick={() => handleEditBudget(budget)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDeleteBudget(budget._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Budget;
