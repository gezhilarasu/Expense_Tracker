import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar"; // Import Sidebar
import { Bar } from "react-chartjs-2"; // Import Chart.js bar chart component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Import necessary chart components
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNavOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-icon")
      ) {
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

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  // Fetch budgets and calculate totals
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetch(`http://localhost:5000/api/budget/user-budgets/${userId}`)
        .then((res) => res.json())
        .then((data) => setBudgets(data))
        .catch((err) => console.error("Error fetching budgets:", err));
    }
  }, []);

  const totalBudgets = budgets.length;
  const totalBudgetAmount = budgets.reduce((total, budget) => total + budget.amount, 0);
  const totalRemainingAmount = budgets.reduce((total, budget) => total + budget.availableAmount, 0);
  const totalSpentAmount = totalBudgetAmount - totalRemainingAmount;

  // Chart data for overall budget
  const chartData = {
    labels: ["Total Budget", "Total Remaining", "Total Spent"],
    datasets: [
      {
        label: "Amount in $",
        data: [totalBudgetAmount, totalRemainingAmount, totalSpentAmount],
        backgroundColor: ["#28a745", "#007bff", "#dc3545"], // Green for Total Budget, Blue for Remaining, Red for Spent
        borderColor: ["#28a745", "#007bff", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Expense Spend vs Remaining Budget",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="menu-icon" onClick={toggleNav}>
            ☰
          </div>
          <div>DashBoard</div>
        </header>

        {/* Budget Overview Cards */}
        <section className="budget-overview">
          <div className="green-card">
            <h3>Total Budgets</h3>
            <p>{totalBudgets}</p>
          </div>

          <div className="green-card">
            <h3>Total Budget Amount</h3>
            <p>₹ {totalBudgetAmount.toFixed(2)}</p>
          </div>

          <div className="green-card">
            <h3>Total Remaining Amount</h3>
            <p>₹ {totalRemainingAmount.toFixed(2)}</p>
          </div>
        </section>

        {/* Expense Spend vs Remaining Budget Chart (Overall) */}
        <section className="chart-section">
          <Bar data={chartData} options={chartOptions} />
        </section>

        {/* Individual Budget Charts */}
        <section className="individual-budgets">
          {budgets.map((budget, index) => {
            const spentAmount = budget.amount - budget.availableAmount;

            // Data for individual budget
            const individualChartData = {
              labels: ["Total Budget", "Remaining", "Spent"],
              datasets: [
                {
                  label: "Amount in ₹",
                  data: [budget.amount, budget.availableAmount, spentAmount],
                  backgroundColor: ["#28a745", "#007bff", "#dc3545"], // Green for Total Budget, Blue for Remaining, Red for Spent
                  borderColor: ["#28a745", "#007bff", "#dc3545"],
                  borderWidth: 1,
                },
              ],
            };

            return (
              <div key={index} className="budget-chart-container">
                <h4>Budget: {budget.category || `Budget ₹{index + 1}`}</h4>
                <Bar data={individualChartData} options={chartOptions} />
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
