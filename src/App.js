import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Filter,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentView, setCurrentView] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Pocket Money",
    "Other",
  ];

  // Sample data for demo
  useEffect(() => {
    const sampleTransactions = [
      {
        id: 1,
        type: "expense",
        amount: 45.99,
        category: "Food & Dining",
        description: "Lunch at restaurant",
        date: "2024-09-15",
      },
      {
        id: 2,
        type: "income",
        amount: 3000,
        category: "Salary",
        description: "Monthly salary",
        date: "2024-09-01",
      },
      {
        id: 3,
        type: "expense",
        amount: 120,
        category: "Transportation",
        description: "Gas and parking",
        date: "2024-09-18",
      },
      {
        id: 4,
        type: "expense",
        amount: 89.5,
        category: "Shopping",
        description: "Groceries",
        date: "2024-09-17",
      },
      {
        id: 5,
        type: "income",
        amount: 500,
        category: "Freelance",
        description: "Web development project",
        date: "2024-09-10",
      },
    ];
    setTransactions(sampleTransactions);
  }, []);

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;

    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTransaction.id ? newTransaction : t))
      );
      setEditingTransaction(null);
    } else {
      setTransactions((prev) => [...prev, newTransaction]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData(transaction);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesMonth = t.date.startsWith(selectedMonth);
    const matchesCategory =
      selectedCategory === "all" || t.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = expenseCategories
    .map((category) => {
      const amount = filteredTransactions
        .filter((t) => t.type === "expense" && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: category, value: amount };
    })
    .filter((item) => item.value > 0);

  const monthlyData = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expenses: 0 };
    }
    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expenses += t.amount;
    }
  });

  const chartData = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
    "#EC4899",
  ];

  const allCategories = [...new Set(transactions.map((t) => t.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="text-green-600" />
              Personal Finance Tracker
            </h1>
            <p className="text-gray-600 mt-2">
              Track your income and expenses with detailed analytics
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView("overview")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setCurrentView("transactions")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "transactions"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setCurrentView("analytics")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "analytics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Analytics
              </button>
            </div>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingTransaction(null);
                resetForm();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Month:
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {currentView === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="text-green-600" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="text-red-600" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p
                      className={`text-2xl font-bold ${
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{balance.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign
                    className={balance >= 0 ? "text-green-600" : "text-red-600"}
                    size={32}
                  />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h2>
              <div className="space-y-3">
                {filteredTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                        <span className="font-medium">
                          {transaction.description}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Transactions View */}
        {currentView === "transactions" && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                All Transactions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                        <span className="font-medium">
                          {transaction.description}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart size={20} />
                  Expenses by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) =>
                        `${entry.name}: ₹${entry.value.toFixed(2)}`
                      }
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹${value.toFixed(2)}`, "Amount"]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value.toFixed(2)}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Income" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expensesByCategory.map((category, index) => (
                  <div key={category.name} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-lg font-semibold text-red-600">
                          ₹{category.value.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Transaction Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTransaction
                    ? "Edit Transaction"
                    : "Add New Transaction"}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value,
                        category: "",
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {(formData.type === "expense"
                      ? expenseCategories
                      : incomeCategories
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTransaction ? "Update" : "Add"} Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTransaction(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
