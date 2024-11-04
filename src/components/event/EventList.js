import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './eventList.css';

const EventManager = ({ userId, userRole }) => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date_time: '', duration: '', location: '' });
    const [joinedEvents, setJoinedEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/events');
            setEvents(response.data);
        } catch (error) {
            alert("Error fetching events: " + error.message);
        }
    };
    
    const handleJoin = async (eventId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/events/${eventId}/join/${userId}`);
            setJoinedEvents((prevJoinedEvents) => [...prevJoinedEvents, eventId]);
            alert("Successfully joined the event.");
        } catch (error) {
            alert("Error joining event: " + error.message);
        }
    };
    
    const handleLeave = async (eventId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/events/${eventId}/leave/${userId}`);
            setJoinedEvents((prevJoinedEvents) => prevJoinedEvents.filter(id => id !== eventId));
            alert("Successfully left the event.");
        } catch (error) {
            alert("Error leaving event: " + error.message);
        }
    };
    

    const handleCreateEvent = async () => {
        try {
        
            const response = await axios.post(`http://127.0.0.1:8000/events/?user_id=${userId}`, { 
                ...newEvent, 
                duration: parseInt(newEvent.duration),  
                organizer_id: userId 
            });
    
           
            if (response.status === 200) { 
                alert("Event created successfully");
                fetchEvents();
                setNewEvent({ title: '', date_time: '', duration: '', location: '' });
            } else {
                alert("Failed to create event: " + response.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event: " + (error.response?.data?.message || error.message));
        }
    };
    
    
    
    const handleCancelEvent = async (eventId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/events/${eventId}`, {
                data: { user_id: userId }
            });
            alert("Event deleted Successfully.");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div className="event-manager-container">
            

            {userRole === 'event_creator' && (
                
                <div className="create-event-section">
                <h1 className="header">Event Manager</h1>
                    <h2>Create Event</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Event Title"
                            className="input-field"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            required
                        />
                        <input
                            type="datetime-local"
                            className="input-field"
                            value={newEvent.date_time}
                            onChange={(e) => setNewEvent({ ...newEvent, date_time: e.target.value })}
                            required
                        />
                        <input
    type="number"  
    placeholder="Duration (minutes)"
    className="input-field"
    value={newEvent.duration}
    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
    required
/>

                        <input
                            type="text"
                            placeholder="Location"
                            className="input-field"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            required
                        />
                    </div>
                    <button className="create-event-button" onClick={handleCreateEvent}>Create Event</button>
                </div>
            )}

            <div className="events-list-section">
                <h2>Events List</h2>
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{event.date_time}</td>
                                <td>{event.duration} mins</td>
                                <td>{event.location}</td>
                                <td className="action-cell">
                                    {userRole === 'event_creator' && event.organizer_id === userId && (
                                        <button className="action-button cancel-button" onClick={() => handleCancelEvent(event.id)}>Cancel</button>
                                    )}
                                    {userRole === 'event_joiner' && (
                                        joinedEvents.includes(event.id) ? (
                                            <button className="action-button leave-button" onClick={() => handleLeave(event.id)}>Leave</button>
                                        ) : (
                                            <button className="action-button join-button" onClick={() => handleJoin(event.id)}>Join</button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventManager;
