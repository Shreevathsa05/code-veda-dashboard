import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hiring from "./Pages/Hiring"; // Make sure this path is correct
import LocalAlerts from "./Pages/LocalAlerts";
import Events from "./Pages/Events";

// A simple component for your home page (at the "/" route)
function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Your Application
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        This is the home page. Use the navigation to go to the hiring dashboard.
      </p>
      <Link
        to="/hiring"
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        View Job Postings (temp, redirects to /hiring)
      </Link>
    </div>
  );
}

// Main App component that defines the routes
function App() {
  return (
    <Router>
      {/* You can place a persistent navigation bar here if you want */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 font-bold">
                MyApp
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/hiring"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Hiring
                </Link>
                <Link
                  to="/alerts"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Local Alerts
                </Link>
                <Link
                  to="/events"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* The <Routes> component will render the correct <Route> based on the current URL */}
        <Routes>
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/alerts" element={<LocalAlerts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
