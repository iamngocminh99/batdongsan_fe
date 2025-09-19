import { Heart, Home, MessageCircle, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export function BottomNavigation() {
    return <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
            <Link to="/" className="flex flex-col items-center p-2 text-accent">
                <Home className="h-6 w-6" />
                <span className="text-xs mt-1">Trang chủ</span>
            </Link>
            <Link to="/search" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                <Search className="h-6 w-6" />
                <span className="text-xs mt-1">Tìm kiếm</span>
            </Link>
            <Link to="/favorites" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                <Heart className="h-6 w-6" />
                <span className="text-xs mt-1">Yêu thích</span>
            </Link>
            <Link to="/chat" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">Chat</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Tài khoản</span>
            </Link>
        </div>
    </nav>
}