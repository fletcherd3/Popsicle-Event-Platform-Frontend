import axios from 'axios';

export const SERVER_URL = 'http://localhost:4941/api/v1';

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 2500,
    withCredentials: false
});

export const Api = {
    login: (body) => {
        return instance.post("/users/login", body);
    },
    register: (body) => {
        return instance.post("/users/register", body);
    },
    getUser: (userId) => {
        return instance.get("/users/" + userId, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    editUser: (body, userId) => {
        return instance.patch("/users/" + userId, body, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    uploadAvatar: (image, userId) => {
        return instance.put("/users/" + userId + "/image", image.file, {
            headers: {
                'X-Authorization': localStorage.getItem('token'),
                'Content-Type': image.file.type
            }
        });
    },
    deleteAvatar: (userId) => {
        return instance.delete("/users/" + userId + "/image", {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    getEvents: (params) => {
        return instance.get("/events", {params: params}).catch(error => {
            console.log(error);
        })
    },
    getEvent: (eventId) => {
        return instance.get("/events/" + eventId).catch(error => {
            console.log(error);
        })
    },
    editEvent: (body, eventId) => {
        return instance.patch("/events/" + eventId, body, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    getEventImage: (eventId) => {
        return instance.get("/events/" + eventId + "/images").catch(error => {
            console.log(error);
        });
    },
    getAttendees: (eventId) => {
        return instance.get("/events/" + eventId + "/attendees", {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        }).catch(error => {
            console.log(error);
        });
    },
    attendEvent: (eventId) => {
        return instance.post("/events/" + eventId + "/attendees", null, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    leaveEvent: (eventId) => {
        return instance.delete("/events/" + eventId + "/attendees", {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    createEvent: (body) => {
        return instance.post("/events", body, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    deleteEvent: (eventId) => {
        return instance.delete("/events/" + eventId, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    },
    uploadEventImage: (image, eventId) => {
        return instance.put("/events/" + eventId + "/image", image.file, {
            headers: {
                'X-Authorization': localStorage.getItem('token'),
                'Content-Type': image.file.type
            }
        });
    },
    changeAttendeeStatus: (eventId, userId, newStatus) => {
        return instance.patch("/events/" + eventId + "/attendees/" + userId, {status: newStatus}, {
            headers: {
                'X-Authorization': localStorage.getItem('token')
            }
        });
    }
};