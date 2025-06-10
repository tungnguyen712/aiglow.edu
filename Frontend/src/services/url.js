export const URLS = {
    MAIN_URL: import.meta.env.VITE_MAIN_API_URL,
    AUTH_URL: import.meta.env.VITE_AUTH_API_URL,

    CHAT: {
        LIST_ROOM: ((userId) => `chatroom/${userId}`),
        CREATE_ROOM: "chatroom/create",
        SHOW_ROOM: ((roomId) => `/nlptosqlservice/connect_chat/${roomId}`),
        SEND_MESSAGE: "nlptosqlservice/query",
        SAVE_AND_CLOSE: "nlptosqlservice/save_close",
        CREATE_DATA: "chatroom/prepare-for-python",
        PREPARE_DATA: "nlptosqlservice/data",
        CONNECT: "nlptosqlservice/connectchatroom",
        SEND_GOAL: "api/goal",
        SHOW_SKILLS: ((goalId) => `api/skills?goalId=${goalId}`),
        SEND_ROADMAP_REQ: "api/roadmap/create/manu",
        SEND_ROADMAP_REQ_AUTO: "api/roadmap/create/auto",
    },

    AUTH: {
        LOGIN: "userservice/login",
        REGISTER: "userservice/register",
        PROFILE: "userservice/info",
    }
};