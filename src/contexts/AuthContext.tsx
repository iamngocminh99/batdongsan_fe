import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { decodeToken } from "../utils/jwt";

type User = {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    email: string | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
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
            const decoded = decodeToken(savedToken);
            if (decoded && decoded.role) {
                setToken(savedToken);
                setUser({ email: decoded.sub, role: decoded.role, id: decoded.id });
                setEmail(decoded.sub);
            }
        }
        setLoading(false);
    }, []);

    const login = (jwtToken: string) => {
        localStorage.setItem("token", jwtToken);
        const decoded = decodeToken(jwtToken);
        if (decoded && decoded.role) {
            setUser({ email: decoded.sub, role: decoded.role, id: decoded.id });
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

    return (
        <AuthContext.Provider value={{ user, token, email, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
