import axios from 'axios';

export const SERVER_URL = 'http://localhost:4941/api/v1';

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 2500,
    withCredentials: false
});

export const Api = {
    login: (body) => {
        return instance.post("/users/login", body).catch(error => {
            console.log(error);
        })
    },
    register: (body) => {
        return instance.post("/users/register", body);
    },
    getEvents: (params) => {
        return instance.get("/events", {params: params}).catch(error => {
            console.log(error);
        })
    },
    getEventImage: (eventId) => {
        return instance.get("/events/" + eventId + "/images").catch(error => {
            console.log(error);
        });
    },
    uploadAvatar: (image, user) => {
        return instance.put("/users/" + user.id + "/image", image.file, {
            headers: {
                'X-Authorization': user.token,
                'Content-Type': image.file.type
            }
        });
    }
};