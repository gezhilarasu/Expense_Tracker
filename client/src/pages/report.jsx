import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Add this
import "./report.css";


function Report() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("userId");

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/");
      };

    // Toggle Sidebar
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

    // Fetch Expenses
    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:5000/api/expense/user-expenses/${userId}`)
            .then((res) => res.json())
            .then((data) => setExpenses(data))
            .catch((err) => console.error("Error fetching expenses:", err));
    }, [userId]);

    // Filter Expenses by Date
    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || expenseDate >= start) && (!end || expenseDate <= end);
    });

    // Generate PDF
    // Generate PDF
const downloadPDF = () => {
    if (filteredExpenses.length === 0) {
        alert("No expenses available to download.");
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);

    // Add Title
    doc.text("Expense Report", 15, 15);

    // Add Start and End Date
    const dateRangeText = `From: ${startDate || 'Not Set'} To: ${endDate || 'Not Set'}`;
    doc.setFontSize(12);
    doc.text(dateRangeText, 15, 25); // Adjust the position as needed

    // Format data for the table
    const tableData = filteredExpenses.map((expense) => [
        expense.date.split("T")[0], 
        expense.category, 
        `$${expense.amount.toFixed(2)}`, 
        expense.description
    ]);

    // Use autoTable to add the table
    autoTable(doc, {
        startY: 35, // Start below the date range text
        head: [["Date", "Category", "Amount", "Description"]],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 12 },
        headStyles: { fillColor: [0, 123, 255] },
        margin: { top: 20 }
    });

    doc.save("Expense_Report.pdf");
};

    
    

    return (
        <div className="report-container">
      <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />

            <main className="budget-content">
                <header className="header">
                    <div className="menu-icon" onClick={toggleNav}>☰</div>
                    <div>Generate Report</div>
                </header>

                {/* Filters & Download Button */}
                <div className="filters-container">
                    <div className="date-filters">
                        <label>Start Date:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                        <label>End Date:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>

                    <button className="download-btn" onClick={downloadPDF}>Download Report</button>
                </div>

                {/* Expenses Table */}
                <table className="report-table">
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
                                <td colSpan="4" className="no-expense">No expenses available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Report;
