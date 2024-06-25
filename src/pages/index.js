import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: userInput,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setUserInput("");
        setIsTyping(true);

        try {
            const response = await axios.post("/api/groq", {
                messages: [...messages, newMessage],
            });

            const botMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: response.data,
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <div className="flex items-center justify-between">
                <Image
                    src={"/srhlogo.png"}
                    alt="SRH Logo"
                    width={50}
                    height={50}
                />
                <h1 className="text-2xl font-bold py-5 mx-auto">
                    SRH Live Agent
                </h1>
                <div className="w-12 h-12"></div>
            </div>
            <div className="flex-1 p-4 bg-white rounded shadow-lg overflow-y-auto">
                <div id="chat" className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start space-x-2 ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {message.sender === "bot" && (
                                <Image
                                    src={"/agent.jpeg"}
                                    alt="Agent"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                            )}
                            <div
                                className={`p-2 rounded max-w-xs ${
                                    message.sender === "user"
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center space-x-2">
                            <Image
                                src={"/agent.jpeg"}
                                alt="Agent"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <div className="p-2 bg-gray-300 text-black rounded max-w-xs">
                                <div className="typing-dots">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    id="user-input"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l focus:outline-none"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-orange-500 text-white rounded-r hover:bg-orange-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
