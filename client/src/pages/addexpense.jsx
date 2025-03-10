import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";

import "./addexpense.css";

function Addexpense() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]); // New state for filtered expenses
    const [showForm, setShowForm] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    let [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
      const navigate = useNavigate();
    
    const userId = localStorage.getItem("userId");

    // Filter states
    const [filterCategory, setFilterCategory] = useState("");
    const [filterAmount, setFilterAmount] = useState("");
    const [amountFilterType, setAmountFilterType] = useState("Above"); // "Above" or "Below"


    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
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
        if (!userId) return;
        fetch(`http://localhost:5000/api/budget/user-budgets/${userId}`)
            .then((res) => res.json())
            .then((data) => setBudgets(data))
            .catch((err) => console.error("Error fetching budgets:", err));
    }, [userId]);

    // Fetch expenses
    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:5000/api/expense/user-expenses/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setExpenses(data);
                setFilteredExpenses(data); // Initialize filtered expenses with all expenses
            })
            .catch((err) => console.error("Error fetching expenses:", err));
    }, [userId]);

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
            userId,
        };

        try {
            const response = await fetch("http://localhost:5000/api/expense/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            });

            const data = await response.json();
            if (response.ok) {
                const updatedExpenses = [...expenses, data.expense];
                setExpenses(updatedExpenses);
                setFilteredExpenses(updatedExpenses); // Update filtered expenses
                setAmount("");
                setDescription("");
                setDate("");
                setShowForm(false);

                if (data.updatedBudget) {
                    setSelectedBudget(data.updatedBudget);
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    // Unique categories for filtering dropdown
    const uniqueCategories = [...new Set(expenses.map(exp => exp.category))];

    // Filter expenses based on selected criteria
    useEffect(() => {
        let updatedExpenses = expenses;

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
        {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                    <td>{expense.date.split("T")[0]}</td>
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
