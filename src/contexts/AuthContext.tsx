import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { decodeToken } from "../utils/jwt";

type User = {
    id: string;
    email: string;
    planName: string;
    planEndDate: string;
    planStartDate?: string;
    maxProperties?: number;
    role: "USER" | "ADMIN" | "AGENT";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    email: string | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUserFromServer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);

            const decoded = decodeToken(savedToken);

            if (decoded?.id) {
                fetch(`http://localhost:8080/api/users/${decoded.id}`, {
                    headers: { Authorization: `Bearer ${savedToken}` },
                })
                    .then(async res => {
                        if (!res.ok) throw new Error("Fetch user fail");
                        const data = await res.json();
                        setUser({
                            id: data.id,
                            email: data.email,
                            role: data.role,
                            planName: data.agent?.planName ?? decoded.planName,
                            planStartDate: data.agent?.planStartDate,
                            planEndDate: data.agent?.planEndDate ?? decoded.planEndDate,
                            maxProperties: data.agent?.maxProperties,
                        });
                        setEmail(data.email);
                        console.log("User loaded from API:", data);
                    })
                    .catch(err => {
                        console.error("Load user fail:", err);
                        // Token có thể hết hạn → logout
                        localStorage.removeItem("token");
                        setToken(null);
                        setUser(null);
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);


    const login = (jwtToken: string) => {
        localStorage.setItem("token", jwtToken);
        const decoded = decodeToken(jwtToken);
        if (decoded && decoded.role) {
            setUser({
                email: decoded.sub,
                role: decoded.role,
                id: decoded.id,
                planName: decoded.planName,
                planEndDate: decoded.planEndDate,
                planStartDate: decoded.planStartDate,
                maxProperties: decoded.maxProperties
            });
            setEmail(decoded.sub);
        }
        setToken(jwtToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setEmail(null);
    };

    const refreshUserFromServer = async () => {
        if (!token || !user?.id) {
            console.warn("Không có token hoặc userId");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Không thể tải thông tin user");
            const data = await res.json();

            const updatedUser = {
                id: data.id,
                email: data.email,
                role: data.role,
                planName: data.agent?.planName ?? user.planName,
                planStartDate: data.agent?.planStartDate ?? user.planStartDate,
                planEndDate: data.agent?.planEndDate ?? user.planEndDate,
                maxProperties: data.agent?.maxProperties ?? user.maxProperties,
            };

            console.log("🔁 Refresh user → ", updatedUser);
            setUser(updatedUser);
        } catch (err) {
            console.error("Lỗi khi load user sau thanh toán:", err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, email, loading, login, logout, refreshUserFromServer }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}

