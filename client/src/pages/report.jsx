import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import "./report.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Report() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();
    const chartRef = useRef(null);
    const mainContentRef = useRef(null); // Reference to the main content area

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

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Check if sidebar is open and the click is outside the sidebar
            if (isNavOpen && event.target.closest('.sidebar') === null && 
                event.target.closest('.menu-icon') === null) {
                setIsNavOpen(false);
            }
        }

        // Add event listener when the sidebar is open
        if (isNavOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNavOpen]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("https://expense-tracker-x5i9.onrender.com/api/expense/getExpense", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Expense data received:", data);

            if (data.expenses) {
                setExpenses(data.expenses);
            } else {
                setExpenses([]);
            }
        })
        .catch((err) => {
            console.error("Error fetching expenses:", err);
            setExpenses([]);
        });
    }, []);

    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || expenseDate >= start) && (!end || expenseDate <= end);
    });

    // Process expense data for the chart
    const prepareChartData = (expenseData) => {
        // Group expenses by category and sum amounts
        const categoryTotals = {};
        
        expenseData.forEach(expense => {
            const category = expense.category || 'Uncategorized';
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += parseFloat(expense.amount);
        });

        // Generate random colors for categories
        const generateColor = () => {
            const r = Math.floor(Math.random() * 200) + 55;  // Avoid too dark colors
            const g = Math.floor(Math.random() * 200) + 55;
            const b = Math.floor(Math.random() * 200) + 55;
            return `rgb(${r}, ${g}, ${b})`;
        };

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        const backgroundColors = categories.map(() => generateColor());

        return {
            labels: categories,
            datasets: [
                {
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 1)')),
                    borderWidth: 1,
                },
            ],
        };
    };

    // Chart options
    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '70%',
        maintainAspectRatio: false
    };

    // Calculate summary statistics
    const calculateSummary = (expenseData) => {
        const total = expenseData.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        
        // Find highest expense
        let highestExpense = { amount: 0 };
        expenseData.forEach(expense => {
            if (parseFloat(expense.amount) > highestExpense.amount) {
                highestExpense = expense;
            }
        });

        // Calculate average expense
        const averageExpense = expenseData.length > 0 ? total / expenseData.length : 0;

        return {
            total: total.toFixed(2),
            average: averageExpense.toFixed(2),
            highestCategory: highestExpense.category || 'None',
            highestAmount: highestExpense.amount.toFixed(2)
        };
    };

    // Generate PDF with chart
    const downloadPDF = () => {
        if (filteredExpenses.length === 0) {
            alert("No expenses available to download.");
            return;
        }

        const doc = new jsPDF();
        
        // Add styling to the PDF
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        
        // Add Title with styling
        doc.text("Expense Report", 105, 20, { align: "center" });
        
        // Add Date Range
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 73, 94);
        const dateRangeText = `Period: ${startDate || 'All time'} to ${endDate || 'Present'}`;
        doc.text(dateRangeText, 105, 30, { align: "center" });
        
        // Add summary statistics
        const summary = calculateSummary(filteredExpenses);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Summary", 15, 45);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Expenses: $${summary.total}`, 15, 55);
        doc.text(`Average Expense: $${summary.average}`, 15, 62);
        doc.text(`Highest Category: ${summary.highestCategory} ($${summary.highestAmount})`, 15, 69);
        
        // Add chart to PDF
        if (chartRef.current) {
            // Convert chart to image data URL
            const chartCanvas = chartRef.current.canvas;
            const chartImage = chartCanvas.toDataURL('image/png', 1.0);
            
            // Add chart image to PDF
            doc.text("Expense Distribution by Category", 105, 85, { align: "center" });
            doc.addImage(chartImage, 'PNG', 20, 90, 170, 85);
        }
        
        // Format data for the expense table
        const tableData = filteredExpenses.map((expense) => [
            expense.date.split("T")[0], 
            expense.category || 'Uncategorized', 
            `$${parseFloat(expense.amount).toFixed(2)}`, 
            expense.description || '-'
        ]);

        // Add detailed expenses table
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Expenses", 15, 190);
        
        // Use autoTable to add the table
        autoTable(doc, {
            startY: 195,
            head: [["Date", "Category", "Amount", "Description"]],
            body: tableData,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { 
                fillColor: [41, 128, 185], 
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 180 }
        });

        doc.save("Expense_Report.pdf");
    };

    return (
        <div className="report-container">
            <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />

            <main className="budget-content" ref={mainContentRef}>
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

                {/* Chart Preview */}
                <div className="chart-container">
                    <h3>Expense Distribution by Category</h3>
                    <div className="donut-chart">
                        {filteredExpenses.length > 0 ? (
                            <Doughnut 
                                data={prepareChartData(filteredExpenses)} 
                                options={chartOptions} 
                                ref={chartRef}
                            />
                        ) : (
                            <div className="no-data">No data available for chart</div>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                {filteredExpenses.length > 0 && (
                    <div className="summary-stats">
                        <h3>Summary</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-title">Total Expenses</span>
                                <span className="stat-value">
                                    ${filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-title">Average Expense</span>
                                <span className="stat-value">
                                    ${(filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / filteredExpenses.length).toFixed(2)}
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-title">Number of Expenses</span>
                                <span className="stat-value">{filteredExpenses.length}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expenses Table */}
                <div className="table-container">
                    <h3>Detailed Expenses</h3>
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
                                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                                        <td>{expense.category || 'Uncategorized'}</td>
                                        <td>${parseFloat(expense.amount).toFixed(2)}</td>
                                        <td>{expense.description || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-expense">No expenses available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Report;