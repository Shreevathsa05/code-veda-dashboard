import React, { useState, useEffect } from "react";

// API base URL - adjust if your backend is running elsewhere
const API_URL = "https://code-veda-backend.onrender.com";

function Hiring() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null); // For editing

  // Form state, aligned with the final schema
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    lastDate: "",
    location: "",
    contactName: "",
    contactPhone: "",
    salary: "",
    imageUrl: "",
  });

  // Fetch jobs from the API
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/hire`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
      setError("Could not load job postings. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open the modal for adding a new job
  const handleAddJob = () => {
    setCurrentJob(null);
    setFormData({
      serviceType: "",
      description: "",
      lastDate: "",
      location: "",
      contactName: "",
      contactPhone: "",
      salary: "",
      imageUrl: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing job
  const handleEditJob = (job) => {
    setCurrentJob(job);
    setFormData({
      serviceType: job.serviceType || "",
      description: job.description || "",
      lastDate: job.lastDate
        ? new Date(job.lastDate).toISOString().split("T")[0]
        : "",
      location: job.location || "",
      contactName: job.contactName || "",
      contactPhone: job.contactPhone || "",
      salary: job.salary || "",
      imageUrl: job.imageUrl || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle saving a new or edited job
  const handleSaveJob = async (e) => {
    e.preventDefault();
    setFormError(null);

    // This is a placeholder ID. In a real app with user login,
    // you would get the ID from the authenticated user's state.
    const posterId = "60d5f2f5c7b9e10015f4e2a0"; // A valid MongoDB ObjectId format

    const jobData = {
      ...formData,
      poster: posterId, // Add the required poster ID
      salary: formData.salary ? Number(formData.salary) : undefined,
    };

    // Ensure lastDate is included, as it's required
    if (!jobData.lastDate) {
      setFormError("Application deadline is required.");
      return;
    }

    const url = currentJob
      ? `${API_URL}/hire/${currentJob._id}`
      : `${API_URL}/hire`;
    const method = currentJob ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save job.");
      }

      setIsModalOpen(false);
      fetchJobs(); // Refresh the job list
    } catch (err) {
      console.error("Save job error:", err);
      setFormError(err.message);
    }
  };

  // Handle deleting a job
  const handleDeleteJob = async (jobId) => {
    // Using a custom modal instead of window.confirm for better styling
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await fetch(`${API_URL}/hire/${jobId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete job.");
        }
        fetchJobs(); // Refresh the list
      } catch (err) {
        console.error("Delete job error:", err);
        setError("Could not delete the job posting. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Hiring Dashboard
          </h1>
          <button
            onClick={handleAddJob}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            + Add Job Posting
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
            <p className="text-xl text-gray-500">Loading job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 p-10 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Open Positions
            </h2>
            <p className="text-gray-500 mt-2">
              Click "Add Job Posting" to create a new entry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-xl font-bold text-indigo-600">
                    {job.serviceType}
                  </h3>
                  <p className="text-gray-600 mt-1">{job.location}</p>
                  <p className="mt-4 text-gray-700">{job.description}</p>
                  <p className="mt-2 text-gray-500 text-sm">
                    Salary: {job.salary ? `$${job.salary}` : "Not specified"}
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    Apply by: {new Date(job.lastDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
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
              {currentJob ? "Edit Job" : "Add New Job"}
            </h2>

            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Service Type / Job Title
                </label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
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
                  Description
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
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="lastDate"
                  value={formData.lastDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Salary (Optional)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1 text-gray-900"
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hiring;
