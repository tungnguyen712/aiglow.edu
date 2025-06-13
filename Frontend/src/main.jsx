import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import {ThemeProvider, SidebarProvider, MultiStepsFormContextProvider, DBFromContextProvider, ChatBotProvider} from "./context";
import { CertificateContextProvider } from "@/context/CertificateContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ThemeProvider>
            <GoogleOAuthProvider clientId={clientId}>
                <SidebarProvider>
                    <ChatBotProvider>
                        <MultiStepsFormContextProvider>
                            <DBFromContextProvider>
                                <CertificateContextProvider>
                                    <App />
                                    <ToastContainer />
                                </CertificateContextProvider>
                            </DBFromContextProvider>
                        </MultiStepsFormContextProvider>
                    </ChatBotProvider>
                </SidebarProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    </BrowserRouter>
);
