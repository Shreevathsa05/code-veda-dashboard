import React, { useState, useEffect } from "react";

// API base URL - adjust if your backend is running elsewhere
const API_URL = "https://code-veda-backend.onrender.com";

function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // For editing

  // Form state aligned with the CommunityEvents schema
  const [formData, setFormData] = useState({
    title: "",
    eventType: "",
    description: "",
    imageUrl: "",
    date: "",
    location: "",
  });

  // Fetch upcoming events from the API
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (e) {
      console.error("Failed to fetch events:", e);
      setError("Could not load events. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open the modal for adding a new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setFormData({
      title: "",
      eventType: "",
      description: "",
      imageUrl: "",
      date: "",
      location: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title || "",
      eventType: event.eventType || "",
      description: event.description || "",
      imageUrl: event.imageUrl || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      location: event.location || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle saving a new or edited event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Schema requires title, description, date, location, and organizer
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.location
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const eventData = {
      ...formData,
      // The schema requires an 'organizer' ObjectId.
      // In a real app, this would be the ID of the logged-in user.
      // We'll use a placeholder value for now.
      organizer: "60d7bbf96e7e8b2e2c5e8b1c",
    };

    const url = currentEvent
      ? `${API_URL}/events/${currentEvent._id}`
      : `${API_URL}/events`;
    const method = currentEvent ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event.");
      }

      setIsModalOpen(false);
      fetchEvents(); // Refresh the event list
    } catch (err) {
      console.error("Save event error:", err);
      setFormError(err.message);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete event.");
        }
        fetchEvents(); // Refresh the list
      } catch (err) {
        console.error("Delete event error:", err);
        setError("Could not delete the event. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Community Events
          </h1>
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            + Add New Event
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center bg-white border border-gray-200 p-10 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Upcoming Events
            </h2>
            <p className="text-gray-500 mt-2">
              Click "Add New Event" to create one.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <img
                  src={
                    event.imageUrl ||
                    "https://placehold.co/600x400/E2E8F0/4A5568?text=Event"
                  }
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  {event.eventType && (
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                      {event.eventType}
                    </p>
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    <span className="font-semibold">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm">{event.location}</p>
                  <p className="mt-4 text-gray-700 flex-grow">
                    {event.description}
                  </p>
                  <div className="flex justify-end gap-3 pt-4 mt-auto">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {currentEvent ? "Edit Event" : "Add New Event"}
            </h2>

            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Event Type (e.g., Workshop, Meetup)
                </label>
                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
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
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
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
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
                  required
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
                  className="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
