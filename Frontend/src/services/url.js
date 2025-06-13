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
        PERSONAL_INFORMATION: ((userId) => `api/user/${userId}`),
        SHOW_ROADMAP: ((userId) => `api/roadmap/user/${userId}`),
        SEND_NEW_CERT: ((userId) => `api/user/${userId}/certificates`),
        UPDATE_COURSE_NODE_STATUS: ((courseNodeId) => `api/nodes/${courseNodeId}/status`),
        DELETE_ROADMAP: ((roadmapId) => `api/roadmap/${roadmapId}/delete`),
        SEND_CHATBOT_MESSAGE: "api/chat",
        UPDATE_CUSTOM_PREFERENCE: "api/user/preferences",
    },

    AUTH: {
        LOGIN: "userservice/login",
        REGISTER: "userservice/register",
        PROFILE: "userservice/info",
    }
};