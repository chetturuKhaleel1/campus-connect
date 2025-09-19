import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    joinLink: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create event
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      return alert("Fill all required fields!");
    }
    try {
      const res = await axios.post("/api/events", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents([res.data.event, ...events]);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        joinLink: "",
      });
    } catch (err) {
      console.error("Create event error:", err);
    }
  };

  // Toggle interest
  const toggleInterest = async (eventId) => {
    try {
      const res = await axios.post(
        `/api/events/interest/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(events.map((ev) => (ev._id === eventId ? res.data.event : ev)));
    } catch (err) {
      console.error("Toggle interest error:", err);
    }
  };

  // Separate upcoming & past events
  const today = new Date();
  const upcomingEvents = events
    .filter((ev) => new Date(ev.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastEvents = events
    .filter((ev) => new Date(ev.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Event Card
  const renderEventCard = (ev, isPast = false) => {
    const interestedCount = ev.interestedUsers?.length || 0;
    const isInterested = ev.interestedUsers?.includes(userId);

    return (
      <motion.div
        key={ev._id}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative border rounded-xl shadow-sm bg-white dark:bg-slate-800 p-6"
      >
        {/* Accent bar */}
        <div
          className={`absolute left-0 top-0 h-full w-1.5 ${
            isPast ? "bg-gray-400" : "bg-gradient-to-b from-indigo-500 to-purple-500"
          } rounded-l-xl`}
        ></div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {ev.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{ev.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {new Date(ev.date).toLocaleDateString()}{" "}
          {ev.location && `· ${ev.location}`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Created by {ev.createdBy?.student_name || "Anonymous"}
        </p>

        {ev.joinLink && (
          <a
            href={ev.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Join
          </a>
        )}

        {/* Interest button */}
        <button
          onClick={() => toggleInterest(ev._id)}
          className={`absolute top-5 right-5 flex items-center space-x-1 p-2 rounded-full transition ${
            isInterested
              ? "bg-yellow-100 text-yellow-500 shadow"
              : "text-gray-400 hover:text-gray-500"
          }`}
        >
          <Star size={20} />
          <span className="text-xs">{interestedCount}</span>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-5 dark:bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900 dark:text-white">
        🎉 Events
      </h1>

      {/* Create Event */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Create a New Event
        </h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow space-y-3">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-slate-700 dark:border-slate-600"
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-slate-700 dark:border-slate-600"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-slate-700 dark:border-slate-600"
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-slate-700 dark:border-slate-600"
          />
          <input
            type="text"
            placeholder="Join Link (optional)"
            value={newEvent.joinLink}
            onChange={(e) =>
              setNewEvent({ ...newEvent, joinLink: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-slate-700 dark:border-slate-600"
          />
          <button
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Create Event
          </button>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🚀 Upcoming Events
        </h2>
        <div className="space-y-6">
          {upcomingEvents.length ? (
            upcomingEvents.map((ev) => renderEventCard(ev))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming events.
            </p>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🕘 Past Events
        </h2>
        <div className="space-y-6">
          {pastEvents.length ? (
            pastEvents.map((ev) => renderEventCard(ev, true))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No past events.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
