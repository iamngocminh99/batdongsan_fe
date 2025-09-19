import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    link?: string;
}

const API_URL = "http://localhost:8080/api/notifications";

export function useNotifications() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load danh sách ban đầu
    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const res = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(res.data);
            } catch (err) {
                console.error("Load notifications failed", err);
            }
        };
        fetchData();
    }, [token]);

    // WebSocket
    useEffect(() => {
        let active = true;

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            onConnect: () => {
                if (!active) return; // tránh subscribe lại khi unmount + remount
                console.log("Connected to WebSocket");

                client.subscribe("/topic/notifications", (message: IMessage) => {
                    const notification: Notification = JSON.parse(message.body);

                    setNotifications((prev) => [
                        { ...notification, read: notification.read ?? false },
                        ...prev,
                    ]);
                });
            },
        });

        client.activate();

        return () => {
            active = false;
            client.deactivate();
        };
    }, []);


    // Gọi API đánh dấu đã đọc
    const markAsRead = async (id: string) => {
        try {
            await axios.post(
                `${API_URL}/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Mark as read failed", err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, markAsRead, unreadCount };
}
