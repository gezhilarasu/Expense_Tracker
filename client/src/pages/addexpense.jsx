import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";

import "./addexpense.css";

function Addexpense() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();
    
    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Filter states
    const [filterCategory, setFilterCategory] = useState("");
    const [filterAmount, setFilterAmount] = useState("");
    const [amountFilterType, setAmountFilterType] = useState("Above"); // "Above" or "Below"

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
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

    // Fetch budgets
    useEffect(() => {
        fetch("http://localhost:5000/api/budget/getbudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setBudgets(data))
            .catch((err) => console.error("Error fetching budgets:", err));
    }, [token]);

    // Fetch expenses
    useEffect(() => {
        if (!token) return; // Changed from userId to token check since that's what you're using for auth
        
        fetch("http://localhost:5000/api/expense/getExpense", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                // Check if response is ok before parsing JSON
                if (!res.ok && res.status !== 404) {
                    throw new Error("Failed to fetch expenses");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched expenses:", data); // For debugging
                
                if (data.expenses) {
                    // If expenses property exists in the response
                    setExpenses(data.expenses);
                    setFilteredExpenses(data.expenses);
                } else if (Array.isArray(data)) {
                    // If the response is directly an array
                    setExpenses(data);
                    setFilteredExpenses(data);
                } else {
                    // Initialize with empty arrays if no expenses found
                    setExpenses([]);
                    setFilteredExpenses([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching expenses:", err);
                // Initialize with empty arrays on error
                setExpenses([]);
                setFilteredExpenses([]);
            });
    }, [token]);

    // Open form when budget is clicked
    const handleBudgetClick = (budget) => {
        setSelectedBudget(budget);
        setShowForm(true);
    };

    // Submit expense
    const handleSubmitExpense = async (e) => {
        e.preventDefault();
        if (!selectedBudget) return;

        const newExpense = {
            amount: Number(amount),
            description,
            date,
            category: selectedBudget.category,
            userId
        };

        try {
            const response = await fetch("http://localhost:5000/api/expense/addExpense", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newExpense),
            });
            const data = await response.json();
            if (response.ok) {
                // Fix: Make sure we're handling the response correctly
                const addedExpense = data.expense;
                
                // Make sure the expense has all required fields before adding to the list
                if (addedExpense) {
                    const updatedExpenses = [...expenses, addedExpense];
                    setExpenses(updatedExpenses);
                    setFilteredExpenses(updatedExpenses); // Update filtered expenses
                }
                
                setAmount("");
                setDescription("");
                setDate("");
                setShowForm(false);

                if (data.updatedBudget) {
                    // Update the selected budget with the updated values
                    setSelectedBudget(data.updatedBudget);
                    
                    // Update the budget in the budgets list
                    setBudgets(budgets.map(b => 
                        b._id === data.updatedBudget._id ? data.updatedBudget : b
                    ));
                }
            } else {
                alert(data.error || "Failed to add expense");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Error adding expense. Please try again.");
        }
    };

    // Unique categories for filtering dropdown
    const uniqueCategories = [...new Set(expenses.map(exp => exp.category))];

    // Filter expenses based on selected criteria
    useEffect(() => {
        let updatedExpenses = [...expenses]; // Create a copy to avoid mutating the original

        if (filterCategory) {
            updatedExpenses = updatedExpenses.filter(exp => exp.category === filterCategory);
        }

        if (filterAmount) {
            const amountValue = parseFloat(filterAmount);
            if (!isNaN(amountValue)) {
                updatedExpenses = updatedExpenses.filter(exp => 
                    amountFilterType === "Above" ? exp.amount >= amountValue : exp.amount <= amountValue
                );
            }
        }

        setFilteredExpenses(updatedExpenses);
    }, [filterCategory, filterAmount, amountFilterType, expenses]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Otherwise, format it properly
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
            return "Invalid Date";
        }
    };

    return (
        <div className="add-container">
            <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />
            <main className="budget-content">
                <header className="header">
                    <div className="menu-icon" onClick={toggleNav}>☰</div>
                    <div>CoinCounter</div>
                </header>
                <h2>Add expense based on your budget</h2>

                {/* Expense Form */}
                {showForm && (
                    <form className="expense-form" onSubmit={handleSubmitExpense}>
                        <h3>Add Expense for {selectedBudget.category}</h3>
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        <button type="submit">Add Expense</button>
                    </form>
                )}

                {/* Budget List */}
                <div className="budget-list">
                    {budgets.length > 0 ? (
                        budgets.map((budget) => (
                            <div key={budget._id} className="budget-card" onClick={() => handleBudgetClick(budget)}>
                                <span className="budget-category">{budget.category}</span>
                                <span className="budget-amount">Total: {budget.amount}</span>
                                <span className="budget-balance">
                                    Balance: {budget._id === selectedBudget?._id ? selectedBudget.availableAmount : budget.availableAmount}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-budget-message">No budgets available</p>
                    )}
                </div>

                {/* Expense Filters */}
                <h2>Your Expenses Records</h2>
                <div className="expense-filters">
                    <label>Category: </label>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="">All</option>
                        {uniqueCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>

                    <label>Amount: </label>
                    <select value={amountFilterType} onChange={(e) => setAmountFilterType(e.target.value)}>
                        <option value="Above">Above</option>
                        <option value="Below">Below</option>
                    </select>
                    <input 
                        type="number" 
                        placeholder="Enter amount" 
                        value={filterAmount} 
                        onChange={(e) => setFilterAmount(e.target.value)} 
                    />
                </div>

                {/* Expenses List */}
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses && filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense, index) => (
                                <tr key={expense._id || index}>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#555" }}>
                                    No expense is available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Addexpense;