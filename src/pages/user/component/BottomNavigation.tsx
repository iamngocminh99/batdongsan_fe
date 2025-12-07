import { Heart, Home, MessageCircle, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import ChatAiPage from "../ChatAiPage";

export function BottomNavigation() {
    const baseClasses =
        "flex flex-col items-center p-2 text-muted-foreground hover:text-green-500 transition-colors";

    const iconClasses = "h-6 w-6 transition-transform duration-200 group-hover:scale-110";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
            <div className="flex items-center justify-around py-2">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `group ${baseClasses} ${isActive ? "text-green-600" : ""}`
                    }
                >
                    <Home className={iconClasses} />
                    <span className="text-xs mt-1">Trang chủ</span>
                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        `group ${baseClasses} ${isActive ? "text-green-600" : ""}`
                    }
                >
                    <Search className={iconClasses} />
                    <span className="text-xs mt-1">Tìm kiếm</span>
                </NavLink>

                <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                        `group ${baseClasses} ${isActive ? "text-green-600" : ""}`
                    }
                >
                    <Heart className={iconClasses} />
                    <span className="text-xs mt-1">Yêu thích</span>
                </NavLink>

                <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                        `group ${baseClasses} ${isActive ? "text-green-600" : ""}`
                    }
                >
                    <MessageCircle className={iconClasses} />
                    <span className="text-xs mt-1">Chat</span>
                </NavLink>

                {/* <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `group ${baseClasses} ${isActive ? "text-green-600" : ""}`
                    }
                >
                    <User className={iconClasses} />
                    <span className="text-xs mt-1">Tài khoản</span>
                </NavLink> */}

                <ChatAiPage />
            </div>
        </nav>
    );
}
