import React, { useState, useEffect } from "react";

// API base URL - adjust if your backend is running elsewhere
const API_URL = "https://code-veda-backend.onrender.com";

function LocalAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null); // For editing

  // Form state, aligned with the new schema
  const [formData, setFormData] = useState({
    message: "",
    description: "",
    location: "",
    date: "",
  });

  // Fetch alerts from the API
  const fetchAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/local-alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlerts(data);
    } catch (e) {
      console.error("Failed to fetch alerts:", e);
      setError("Could not load local alerts. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open the modal for adding a new alert
  const handleAddAlert = () => {
    setCurrentAlert(null);
    setFormData({
      message: "",
      description: "",
      location: "",
      date: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing alert
  const handleEditAlert = (alert) => {
    setCurrentAlert(alert);
    setFormData({
      message: alert.message || "",
      description: alert.description || "",
      location: alert.location || "",
      date: alert.date ? new Date(alert.date).toISOString().split("T")[0] : "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle saving a new or edited alert
  const handleSaveAlert = async (e) => {
    e.preventDefault();
    setFormError(null);

    const alertData = { ...formData };

    // Description is optional, but message, date, and location are required by schema
    if (!alertData.message || !alertData.date || !alertData.location) {
      setFormError(
        "Please fill out all required fields (Message, Location, Date)."
      );
      return;
    }

    const url = currentAlert
      ? `${API_URL}/local-alerts/${currentAlert._id}`
      : `${API_URL}/local-alerts`;
    const method = currentAlert ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save alert.");
      }

      setIsModalOpen(false);
      fetchAlerts(); // Refresh the alert list
    } catch (err) {
      console.error("Save alert error:", err);
      setFormError(err.message);
    }
  };

  // Handle deleting an alert
  const handleDeleteAlert = async (alertId) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      try {
        const response = await fetch(`${API_URL}/local-alerts/${alertId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete alert.");
        }
        fetchAlerts(); // Refresh the list
      } catch (err) {
        console.error("Delete alert error:", err);
        setError("Could not delete the alert. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Local Alerts
          </h1>
          <button
            onClick={handleAddAlert}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            + Add New Alert
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 p-10 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Active Alerts
            </h2>
            <p className="text-gray-500 mt-2">
              Click "Add New Alert" to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6 flex items-start justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {alert.message}
                  </h3>
                  <p className="text-gray-600 mt-1">{alert.location}</p>
                  {alert.description && (
                    <p className="mt-3 text-gray-700">{alert.description}</p>
                  )}
                  <p className="mt-4 text-gray-500 text-sm">
                    Date of event: {new Date(alert.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEditAlert(alert)}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {currentAlert ? "Edit Alert" : "Add New Alert"}
            </h2>

            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date of Event
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocalAlerts;
