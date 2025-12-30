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
import { BottomNavigation } from "../component/BottomNavigation"
import { PropertyCardMessage } from "@/pages/agent/component/PropertyCardMessage"

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

    propertyId?: string | null
    propertyTitle?: string | null
    propertyPrice?: number | null
    propertyImage?: string | null
}

const API_BASE = "http://localhost:8080/api/messages"

export default function ChatPage() {

    const { token, user } = useAuth()
    const myId = user?.id

    const routeLocation = useLocation() as {
        state?: { owner?: Partner; propertyId?: string; shareKey?: string }
    }

    const ownerFromState = routeLocation.state?.owner
    const propertyIdFromState = routeLocation.state?.propertyId
    const shareKey = routeLocation.state?.shareKey

    const autoSentRef = useRef(false)

    const sentKey = shareKey
        ? `sent_share_${shareKey}`
        : propertyIdFromState
            ? `sent_property_${propertyIdFromState}_${ownerFromState?.id}`
            : null

    const [activePropertyId, setActivePropertyId] = useState<string | null>(() => {
        if (!propertyIdFromState || !sentKey) return null
        if (sessionStorage.getItem(sentKey)) return null
        return propertyIdFromState
    })


    useEffect(() => {
        if (ownerFromState && myId && token) {
            setSelectedPartner(ownerFromState)
            fetchConversation(ownerFromState.id)
        }
    }, [ownerFromState, myId, token])

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

    useEffect(() => {
        if (!ownerFromState || !myId || !token) return
        if (!activePropertyId) return
        if (!selectedPartner || selectedPartner.id !== ownerFromState.id) return
        if (autoSentRef.current) return

            ; (async () => {
                try {
                    autoSentRef.current = true

                    const res = await axios.post(
                        `${API_BASE}/send`,
                        {
                            senderId: myId,
                            receiverId: ownerFromState.id,
                            content: "",
                            propertyId: activePropertyId,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )

                    // hiển thị lên UI
                    setMessages((prev) => [...prev, res.data])

                    if (sentKey) sessionStorage.setItem(sentKey, "true")

                    setActivePropertyId(null)
                } catch (e) {
                    autoSentRef.current = false
                }
            })()
    }, [ownerFromState, selectedPartner, activePropertyId, myId, token, sentKey])




    // Load conversation tôi và người đó
    const fetchConversation = async (partnerId: string) => {
        if (!myId) return []
        try {
            const res = await axios.get(
                `${API_BASE}/conversation?user1Id=${partnerId}&user2Id=${myId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMessages(res.data)
            return res.data as Message[]
        } catch (err) {
            console.error("Không thể load hội thoại", err)
            return []
        }
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
            propertyId: null
        }

        try {
            const res = await axios.post(`${API_BASE}/send`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const savedMsg: Message = {
                ...res.data,
                senderId: myId, // fix: đảm bảo tin nhắn mới luôn thuộc về tôi
                content: newMessage,
                //fix Invalid Date
                sentAt: res.data.sentAt || new Date().toISOString(),
                readAt: res.data.readAt || null,
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
                    {selectedPartner ? (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPartner(null)}
                                className="mr-3 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-10 w-10 mr-3 border-2 border-blue-200">
                                <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                                    {selectedPartner.firstName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="font-bold text-gray-800">
                                    {selectedPartner.firstName} {selectedPartner.lastName}
                                </h1>
                                <p className="text-xs text-gray-500">Đang hoạt động</p>
                            </div>
                        </>
                    ) : (
                        <h1 className="text-xl font-bold text-gray-800">Tin nhắn</h1>
                    )}
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {!selectedPartner ? (
                    // Danh sách partner
                    <div className="space-y-4">
                        {partners.length > 0 ? (
                            partners.map((p) => (
                                <Card
                                    key={p.id}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
                                    onClick={() => {
                                        setSelectedPartner(p)
                                        fetchConversation(p.id)
                                    }}
                                >
                                    <CardContent className="p-4 flex items-center">
                                        <Avatar className="h-12 w-12 mr-4 border-2 border-blue-100">
                                            <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                                                {p.firstName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">
                                                {p.firstName} {p.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">{p.email}</p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Bắt đầu trò chuyện
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    <MessageCircle className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Chưa có cuộc trò chuyện
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Hãy bắt đầu trò chuyện với agent bất động sản
                                </p>
                                {/* Nút "Tìm agent" được giữ nguyên */}
                                <Link to="/search">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300">
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm agent
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    // Giao diện chat
                    <div className="flex flex-col h-[calc(100vh-200px)]">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-6 mb-4 p-4 bg-white rounded-xl shadow-sm">
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
                                                        {m.propertyId ? (
                                                            <div className="space-y-2">
                                                                <PropertyCardMessage
                                                                    title={m.propertyTitle}
                                                                    price={m.propertyPrice}
                                                                    image={m.propertyImage}
                                                                    detailLink={`/property/${m.propertyId}`}
                                                                    isMe={isMe}
                                                                />
                                                                {!!m.content && <p className="text-sm">{m.content}</p>}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm">{m.content}</p>
                                                        )}


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

                        {/* Input - Giữ nguyên nút gửi */}
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm">
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {/* Nút gửi được giữ nguyên */}
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all duration-300"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <BottomNavigation />
        </div>
    )
}