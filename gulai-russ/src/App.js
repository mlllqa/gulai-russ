import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; //штука позволяет делать несколько страниц
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ToursPage from "./pages/ToursPage";
import FaqPage from "./pages/FaqPage";
import Contact from "./pages/ContactsPage";
import { UserProvider } from "./context/UserContext";
import LoginForm from "./components/LoginForm";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
