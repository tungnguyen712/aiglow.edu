import { useState, useEffect, useRef } from "react";
import { Button, Skeleton } from "@/components/commons";
import { MicrophoneIcon, SentIcon, StopCircle, DeleteIcon } from "@/assets/icons";
import { useChatBot } from "@/context/ChatBotContext";
import { toast } from "react-toastify";
import { mainApi } from "@/services/api";
import { URLS } from "@/services/url";
import { useParams } from "react-router-dom";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const ChatBotWidget = () => {
  const { roomId } = useParams();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const { setUpdateRequired } = useChatBot();

  const chatBoxRef = useRef(null);

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: "user", text: message }]);
    setMessage("");
    try {
        setLoadingState(true);
        const chatResponse = await mainApi.post(URLS.CHAT.SEND_CHATBOT_MESSAGE, {
            text: message,
            roadmapId: roomId
        }, {
            headers: { "Content-Type": "application/json" }
        });
        if (chatResponse.data) {
          console.log("Chat Response: ", chatResponse);
          setChatHistory((prev) => [...prev, { sender: "bot", text: chatResponse.data }]);
          if (chatResponse.data === "I have updated your roadmap. Feel free to let me know if you need any other changes.") {
            setUpdateRequired(true);
          }
        }
    } catch (error) {
        console.error(error);
        toast.error("Somethings went wrong.");
    } finally {
        setLoadingState(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FAB Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform duration-300"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`origin-bottom-right transition-all duration-300 ease-in-out transform ${
          open
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[360px] h-[500px] border border-gray-400 dark:border-gray-500 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <span>🤖 Your AI Assistant</span>
            <button onClick={() => setOpen(false)}>
              <DeleteIcon
                size={23}
                className="text-white hover:text-red-400 transition-colors"
              />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
            ref={chatBoxRef}
          >
            {!loadingState?chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`text-sm max-w-[80%] px-3 py-2 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            )):(<Skeleton />)}
          </div>

          {/* Input Area */}
          <div className="px-4 pb-4">
            <div className="flex flex-row items-center rounded-3xl bg-white dark:bg-slate-800 px-4 py-2 shadow-[0_0_16px_rgba(0,0,0,0.3)] dark:shadow-[0_0_16px_rgba(255,255,255,0.1)]">
              <textarea
                className="flex w-full focus:outline-none py-2 bg-transparent text-black dark:text-white resize-none scrollbar-transparent"
                placeholder="Type your message here..."
                value={message}
                onChange={handleInput}
                rows={1}
                style={{ maxHeight: "96px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <div className="flex flex-row gap-x-2 pl-3 items-center">
                <Button
                  content={
                    <MicrophoneIcon
                      className={listening ? "animate-pulse text-red-500" : ""}
                    />
                  }
                  handleEvent={toggleListening}
                  className="text-dark dark:text-white hover:text-gray-600"
                />

                <Button
                  content={loadingState ? <StopCircle /> : <SentIcon />}
                  disabled={!message || listening || loadingState}
                  handleEvent={() => {
                    handleSendMessage();
                  }}
                  className="text-dark dark:text-white hover:text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ChatBotWidget;