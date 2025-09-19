import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    User,
    Heart,
    Search,
    MessageCircle,
    Home,
    Edit,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Award,
    Shield,
    Bell,
    Lock,
    LogOut,
    Camera,
    Eye,
    BookmarkPlus,
    CreditCard,
    HelpCircle,
} from "lucide-react"

// Mock user data
const mockUser = {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    avatar: "/user-avatar.jpg",
    location: "Quận 1, TP.HCM",
    joinDate: "2023-06-15",
    verified: true,
    membershipLevel: "Premium",
    stats: {
        favoriteProperties: 12,
        savedSearches: 5,
        viewedProperties: 89,
        contactedAgents: 8,
    },
    preferences: {
        notifications: {
            email: true,
            push: true,
            sms: false,
        },
        privacy: {
            showProfile: true,
            showActivity: false,
        },
    },
}

export default function ProfilePage() {
    const [user] = useState(mockUser)
    const [activeTab, setActiveTab] = useState("overview")

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-xl font-bold text-foreground">Tài khoản</h1>
                        </div>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                        <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8">
                                            <Camera className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-2">
                                            <h2 className="text-2xl font-bold">{user.name}</h2>
                                            <div className="flex items-center justify-center md:justify-start space-x-2 mt-1 md:mt-0">
                                                {user.verified && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                        <Shield className="h-3 w-3 mr-1" />
                                                        Đã xác minh
                                                    </Badge>
                                                )}
                                                <Badge className="bg-accent">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    {user.membershipLevel}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-muted-foreground">
                                            <div className="flex items-center justify-center md:justify-start">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start">
                                                <Phone className="h-4 w-4 mr-2" />
                                                {user.phone}
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {user.location}
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Tham gia từ {formatDate(user.joinDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="text-center p-4">
                                <div className="text-2xl font-bold text-accent mb-1">{user.stats.favoriteProperties}</div>
                                <div className="text-sm text-muted-foreground">Yêu thích</div>
                            </Card>
                            <Card className="text-center p-4">
                                <div className="text-2xl font-bold text-accent mb-1">{user.stats.savedSearches}</div>
                                <div className="text-sm text-muted-foreground">Tìm kiếm đã lưu</div>
                            </Card>
                            <Card className="text-center p-4">
                                <div className="text-2xl font-bold text-accent mb-1">{user.stats.viewedProperties}</div>
                                <div className="text-sm text-muted-foreground">Đã xem</div>
                            </Card>
                            <Card className="text-center p-4">
                                <div className="text-2xl font-bold text-accent mb-1">{user.stats.contactedAgents}</div>
                                <div className="text-sm text-muted-foreground">Agent đã liên hệ</div>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thao tác nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link to="/favorites">
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                        <Heart className="h-4 w-4 mr-2" />
                                        Xem bất động sản yêu thích
                                    </Button>
                                </Link>
                                <Link to="/search">
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm kiếm bất động sản
                                    </Button>
                                </Link>
                                <Link to="/chat">
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Chat với agent
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Lịch sử xem
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings */}
                    <TabsContent value="settings" className="mt-6 space-y-6">
                        {/* Cài đặt tài khoản */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cài đặt tài khoản</CardTitle>
                                <CardDescription>Quản lý thông tin cá nhân và bảo mật</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa thông tin cá nhân
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Đổi mật khẩu
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Xác minh danh tính
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Phương thức thanh toán
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Thông báo */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông báo</CardTitle>
                                <CardDescription>Tùy chỉnh cách bạn nhận thông báo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>Email</span>
                                    </div>
                                    <Button variant={user.preferences.notifications.email ? "default" : "outline"} size="sm">
                                        {user.preferences.notifications.email ? "Bật" : "Tắt"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Bell className="h-4 w-4" />
                                        <span>Push notification</span>
                                    </div>
                                    <Button variant={user.preferences.notifications.push ? "default" : "outline"} size="sm">
                                        {user.preferences.notifications.push ? "Bật" : "Tắt"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4" />
                                        <span>SMS</span>
                                    </div>
                                    <Button variant={user.preferences.notifications.sms ? "default" : "outline"} size="sm">
                                        {user.preferences.notifications.sms ? "Bật" : "Tắt"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quyền riêng tư</CardTitle>
                                <CardDescription>Kiểm soát thông tin được chia sẻ</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Hiển thị hồ sơ công khai</div>
                                        <div className="text-sm text-muted-foreground">Cho phép agent xem hồ sơ của bạn</div>
                                    </div>
                                    <Button variant={user.preferences.privacy.showProfile ? "default" : "outline"} size="sm">
                                        {user.preferences.privacy.showProfile ? "Bật" : "Tắt"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Hiển thị hoạt động</div>
                                        <div className="text-sm text-muted-foreground">Cho phép xem lịch sử hoạt động</div>
                                    </div>
                                    <Button variant={user.preferences.privacy.showActivity ? "default" : "outline"} size="sm">
                                        {user.preferences.privacy.showActivity ? "Bật" : "Tắt"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hỗ trợ */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hỗ trợ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Trung tâm trợ giúp
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Liên hệ hỗ trợ
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Đăng xuất */}
                        <Card>
                            <CardContent className="pt-6">
                                <Button variant="destructive" className="w-full">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Đăng xuất
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity */}
                    <TabsContent value="activity" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hoạt động gần đây</CardTitle>
                                <CardDescription>Theo dõi các hoạt động của bạn trên PropertyHub</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        {
                                            action: "Đã lưu bất động sản",
                                            detail: "Vinhomes Central Park",
                                            time: "2 giờ trước",
                                            icon: Heart,
                                        },
                                        {
                                            action: "Đã xem chi tiết",
                                            detail: "Masteri Thảo Điền",
                                            time: "5 giờ trước",
                                            icon: Eye,
                                        },
                                        {
                                            action: "Đã lưu tìm kiếm",
                                            detail: "Căn hộ Quận 1 dưới 10 tỷ",
                                            time: "1 ngày trước",
                                            icon: BookmarkPlus,
                                        },
                                        {
                                            action: "Đã liên hệ agent",
                                            detail: "Nguyễn Thị Lan",
                                            time: "2 ngày trước",
                                            icon: MessageCircle,
                                        },
                                    ].map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                                            <div className="flex-shrink-0">
                                                <activity.icon className="h-5 w-5 text-accent" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{activity.action}</div>
                                                <div className="text-sm text-muted-foreground">{activity.detail}</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">{activity.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
                <div className="flex items-center justify-around py-2">
                    <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
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
                    <Link to="/profile" className="flex flex-col items-center p-2 text-accent">
                        <User className="h-6 w-6" />
                        <span className="text-xs mt-1">Tài khoản</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
