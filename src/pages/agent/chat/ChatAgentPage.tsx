import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    ArrowLeft,
    Send,
    MessageCircle,
    Search,
    Check,
    CheckCheck,
} from "lucide-react"

interface Partner {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
}

interface Message {
    id: string
    senderId: string
    senderName: string
    receiverId: string
    receiverName: string
    content: string
    sentAt: string
    readAt: string | null
}

const API_BASE = "http://localhost:8080/api/messages"

export default function ChatAgentPage() {

    // nhận dữ liệu owner từ chi tiết bất động sản
    const location = useLocation()
    const ownerFromState = location.state?.owner as Partner | undefined

    useEffect(() => {
        if (ownerFromState) {
            setSelectedPartner(ownerFromState)
            fetchConversation(ownerFromState.id)
        }
    }, [ownerFromState])

    const { token, user } = useAuth()
    const myId = user?.id

    const [partners, setPartners] = useState<Partner[]>([])
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load danh sách tôi nhắn cho ai và ai nhắn cho tôi
    useEffect(() => {
        if (!myId) return
        axios
            .get(`${API_BASE}/partners/${myId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPartners(res.data))
            .catch((err) => console.error("Không thể load partners", err))
    }, [myId, token])

    // Load conversation tôi và người đó
    const fetchConversation = (partnerId: string) => {
        if (!myId) return
        axios
            .get(
                `${API_BASE}/conversation?user1Id=${partnerId}&user2Id=${myId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => setMessages(res.data))
            .catch((err) => console.error("Không thể load hội thoại", err))
    }

    // Auto scroll xuống cuối khi có message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedPartner || !myId) return
        const payload = {
            senderId: myId,
            receiverId: selectedPartner.id,
            content: newMessage,
        }

        try {
            const res = await axios.post(`${API_BASE}/send`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const savedMsg: Message = {
                ...res.data,
                senderId: myId, // fix: đảm bảo tin nhắn mới luôn thuộc về tôi
            }

            setMessages((prev) => [...prev, savedMsg])
            setNewMessage("")
        } catch (err) {
            console.error("Lỗi gửi tin nhắn", err)
        }
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) return "Hôm nay"
        if (date.toDateString() === yesterday.toDateString()) return "Hôm qua"
        return date.toLocaleDateString("vi-VN")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <h1 className="text-xl font-bold text-gray-800">Tin nhắn</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Danh sách partner - Bên trái */}
                    <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-180px)] overflow-y-auto">
                        <div className="mb-4">
                            <Input
                                placeholder="Tìm kiếm..."
                                className="w-full"
                            />
                        </div>

                        {partners.length > 0 ? (
                            <div className="space-y-3">
                                {partners.map((p) => (
                                    <Card
                                        key={p.id}
                                        className={`cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 ${selectedPartner?.id === p.id
                                            ? "border-l-blue-500 bg-blue-50"
                                            : "border-l-transparent"
                                            }`}
                                        onClick={() => {
                                            setSelectedPartner(p)
                                            fetchConversation(p.id)
                                        }}
                                    >
                                        <CardContent className="p-3 flex items-center">
                                            <Avatar className="h-10 w-10 mr-3 border-2 border-blue-100">
                                                <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                                                    {p.firstName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-800 truncate">
                                                    {p.firstName} {p.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">{p.email}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    Chưa có cuộc trò chuyện
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Hãy bắt đầu trò chuyện với agent bất động sản
                                </p>
                                <Link to="/search">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300">
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm agent
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Giao diện chat - Bên phải */}
                    <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-sm flex flex-col h-[calc(100vh-180px)]">
                        {selectedPartner ? (
                            <>
                                {/* Chat header */}
                                <div className="border-b p-4 flex items-center">
                                    <Avatar className="h-10 w-10 mr-3 border-2 border-blue-200">
                                        <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                                            {selectedPartner.firstName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-bold text-gray-800">
                                            {selectedPartner.firstName} {selectedPartner.lastName}
                                        </h2>
                                        <p className="text-xs text-gray-500">Đang hoạt động</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-12">
                                            <div className="mb-4 p-3 bg-blue-100 rounded-full">
                                                <MessageCircle className="h-10 w-10 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bắt đầu trò chuyện</h3>
                                            <p className="text-gray-600 text-center">
                                                Gửi tin nhắn đầu tiên của bạn cho {selectedPartner.firstName}
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((m, i) => {
                                            const isMe = m.senderId === myId
                                            const showDate =
                                                i === 0 ||
                                                formatDate(messages[i - 1].sentAt) !== formatDate(m.sentAt)

                                            return (
                                                <div key={m.id}>
                                                    {showDate && (
                                                        <div className="text-center my-4">
                                                            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                                                                {formatDate(m.sentAt)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div className={`max-w-[80%]`}>
                                                            <div
                                                                className={`rounded-2xl px-4 py-3 ${isMe
                                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                                                    }`}
                                                            >
                                                                <p className="text-sm">{m.content}</p>
                                                            </div>
                                                            <div
                                                                className={`flex items-center space-x-1 mt-1 text-xs ${isMe ? "justify-end text-blue-100" : "justify-start text-gray-500"
                                                                    }`}
                                                            >
                                                                <span>{formatTime(m.sentAt)}</span>
                                                                {isMe && (
                                                                    <>
                                                                        {!m.readAt && <Check className="h-3 w-3" />}
                                                                        {m.readAt && (
                                                                            <CheckCheck className="h-3 w-3" />
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="border-t p-4">
                                    <div className="flex items-center space-x-3">
                                        <Input
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all duration-300"
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <div className="mb-6 p-4 bg-blue-100 rounded-full">
                                    <MessageCircle className="h-12 w-12 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">Chọn một cuộc trò chuyện</h2>
                                <p className="text-gray-600 max-w-md">
                                    Chọn một người từ danh sách bên trái để bắt đầu trò chuyện
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}