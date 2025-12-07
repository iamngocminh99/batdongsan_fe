"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, SendHorizonal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";


interface Message {
    sender: "user" | "ai";
    text: string;
}

export default function ChatAiPage() {
    const { token, user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "ai",
            text: "Xin chào 👋! Tôi là trợ lý AI của bất động sản Ngọc Minh. Bạn muốn mình tư vấn gì nào?",
        },
    ]);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(
                `http://localhost:8080/api/chat`,
                {
                    userId: user?.id,
                    message: input,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const reply = res.data?.objectJson?.reply || "Xin lỗi, tôi chưa hiểu ý bạn 😅";

            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: reply },
            ]);
        } catch (error) {
            console.error("Chat API Error:", error);
            toast.error("Lỗi khi gửi tin nhắn đến AI");
            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "⚠️ Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {/* Nút chat nhảy nhảy */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                animate={{
                    y: [0, -6, 0],
                    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
                className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
                <MessageCircle className="h-6 w-6" />
            </motion.button>

            {/* Hộp chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
                    >
                        <Card className="shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-primary text-white p-3">
                                <CardTitle className="text-sm font-semibold flex justify-between items-center">
                                    🤖 Trợ lý tư vấn
                                    <span
                                        className="cursor-pointer text-xs opacity-75 hover:opacity-100"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ✕
                                    </span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                <ScrollArea className="h-64 p-3 space-y-2">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`px-3 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-line ${msg.sender === "user"
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Đang soạn trả lời...
                                            </div>
                                        </div>
                                    )}

                                    <div ref={scrollRef} />
                                </ScrollArea>

                                <div className="flex items-center border-t p-2 gap-2">
                                    <Input
                                        placeholder="Nhập tin nhắn..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        disabled={loading}
                                        className="text-sm"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={sendMessage}
                                        disabled={loading}
                                        className="bg-primary text-white"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <SendHorizonal className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
