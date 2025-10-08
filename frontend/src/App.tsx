import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PopupProvider } from "./context/PopupProvider";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import EditExpensePage from "./pages/EditExpensePage";
import SavingsPage from "./pages/SavingsPage";
import AddSavingGoalPage from "./pages/AddSavingGoalPage";
import EditSavingGoalPage from "./pages/EditSavingGoalPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PopupProvider>
            <Routes>
              <Route path="/ds" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
              <Route path="/expenses/add" element={<PrivateRoute><AddExpensePage /></PrivateRoute>} />
              <Route path="/expenses/edit/:id" element={<PrivateRoute><EditExpensePage /></PrivateRoute>} />
              <Route path="/savings" element={<PrivateRoute><SavingsPage /></PrivateRoute>} />
              <Route path="/savings/add" element={<PrivateRoute><AddSavingGoalPage /></PrivateRoute>} />
              <Route path="/savings/edit/:id" element={<PrivateRoute><EditSavingGoalPage /></PrivateRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PopupProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
