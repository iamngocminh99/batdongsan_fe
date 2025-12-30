import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-hot-toast"
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Star,
    Bath,
    Bed,
    Square,
    Car,
    Wifi,
    Dumbbell,
    ShoppingCart,
    GraduationCap,
    Hospital,
    Phone,
    MessageCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Home,
    Search,
    User,
    ExternalLink,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"



export interface UserResponse {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    role: string
}

interface PropertyDetail {
    id: string
    title: string | null
    description: string | null
    price: number | null
    bedrooms: number
    bathrooms: number
    livingRooms: number
    totalRooms: number
    street: string | null
    area: string | null
    fullAddress: string | null
    latitude: number | null
    longitude: number | null
    status: string | null
    floorAreaSqft: number | null
    landAreaSqft: number | null
    thumbnail: string | null
    propertyType: string | null
    saleType: string | null
    priceType: string | null
    user: UserResponse | null
    imageUrls: string[]
    direction: string | null
}

export default function PropertyDetailPage() {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>()
    const { token, user } = useAuth()
    const [propertyDetail, setPropertyDetail] = useState<PropertyDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/api/favorites/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => {
                setFavorites(res.data.map((fav: any) => fav.property.id))
            })
        }
    }, [user])



    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/properties/${id}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setPropertyDetail(res.data)
            } catch (error) {
                console.error("Lỗi khi gọi API chi tiết:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchProperty()
    }, [id, token])

    // if (isLoading) return <p className="text-center py-10">Đang tải dữ liệu...</p>
    // if (!propertyDetail) return <p className="text-center py-10">Không tìm thấy bất động sản</p>

    console.log("Property ID:", id)
    console.log("propertyDetail:", propertyDetail)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const formatPrice = (price?: number) => {
        if (!price) return "0"
        return price.toLocaleString("vi-VN")
    }

    const nextImage = () => {
        const length = propertyDetail?.imageUrls?.length ?? 0;
        if (length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % length);
    };


    const prevImage = () => {
        const length = propertyDetail?.imageUrls?.length ?? 0;
        if (length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + length) % length);
    };

    const isFavorite = favorites.includes(propertyDetail?.id ?? "")

    const toggleFavorite = async () => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để lưu yêu thích")
            return
        }

        const propertyId = propertyDetail?.id

        const isFavorite = favorites.includes(propertyId ?? "")
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:8080/api/favorites/${user.id}/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                toast.success("Đã bỏ yêu thích")
                setFavorites(favorites.filter(id => id !== propertyId))
            } else {
                await axios.post(
                    `http://localhost:8080/api/favorites/${user.id}/${propertyId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                toast.success("Đã thêm vào yêu thích")
                setFavorites([...favorites, propertyId ?? ""])
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        }
    }

    const handleChatWithOwner = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/properties/${id}/owner`)
            const owner = res.data

            navigate("/chat", { state: { owner, propertyId: id } })
        } catch (err) {
            console.error("Không thể lấy owner:", err)
        }
    }



    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/search">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-lg font-semibold text-foreground line-clamp-1">Chi tiết bất động sản</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className={`cursor-pointer rounded-full p-2 transition-all duration-300 
                                ${isFavorite ? "text-red-500" : "text-gray-600"} 
                                hover:bg-red-100 hover:text-red-500`}
                                onClick={toggleFavorite}
                            >
                                <Heart
                                    className="h-5 w-5"
                                    fill={isFavorite ? "currentColor" : "none"}
                                    stroke="currentColor"
                                />
                            </Button>

                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Image Gallery */}
                <div className="relative mb-6">
                    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                        <img
                            src={propertyDetail?.imageUrls[0] || "/placeholder.svg"}
                            alt="Property"
                            className="w-full h-full object-cover"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            {currentImageIndex + 1} / {propertyDetail?.imageUrls.length}
                        </div>
                    </div>

                    {/* Image thumbnails */}
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                        {propertyDetail?.imageUrls.map((image: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${index === currentImageIndex ? "border-accent" : "border-transparent"
                                    }`}
                            >
                                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{propertyDetail?.title}</CardTitle>
                                        <CardDescription className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {propertyDetail?.fullAddress}
                                        </CardDescription>
                                    </div>
                                    {/* <div className="text-right">
                                        <div className="text-3xl font-bold text-accent">{formatPrice(propertyDetail?.price)}</div>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                                            <span className="text-sm">{property.rating}</span>
                                            <span className="text-sm text-muted-foreground">({property.reviews} đánh giá)</span>
                                        </div>
                                    </div> */}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Bed className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{propertyDetail?.bedrooms}</div>
                                        <div className="text-sm text-muted-foreground">Phòng ngủ</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Bath className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{propertyDetail?.bathrooms}</div>
                                        <div className="text-sm text-muted-foreground">Phòng tắm</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Square className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{propertyDetail?.area}m²</div>
                                        <div className="text-sm text-muted-foreground">Diện tích</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Home className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{propertyDetail?.propertyType}</div>
                                        <div className="text-sm text-muted-foreground">Loại hình</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                                        {formatPrice(propertyDetail?.price || undefined)} đ
                                    </span>
                                    <div>
                                        <span className="text-muted-foreground">Trạng thái:</span>
                                        <Badge variant="secondary" className="ml-2">
                                            {propertyDetail?.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Vĩ độ:</span>
                                        <span className="ml-2 font-medium">{propertyDetail?.latitude}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Kinh độ:</span>
                                        <span className="ml-2 font-medium">{propertyDetail?.longitude}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Hướng:</span>
                                        <span className="ml-2 font-medium">{propertyDetail?.direction}</span>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Mô tả chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{propertyDetail?.description}</p>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Đặc điểm nổi bật</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {property.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Amenities */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Tiện ích</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {property.amenities.map((amenity: any, index: number) => (
                                        <div key={index} className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                                            <amenity.icon className="h-6 w-6 text-accent mb-2" />
                                            <span className="text-sm">{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Nearby Places */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Tiện ích xung quanh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {property.nearbyPlaces.map((place: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <place.icon className="h-5 w-5 text-accent" />
                                                <span>{place.name}</span>
                                            </div>
                                            <Badge variant="outline">{place.distance}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Map */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Vị trí
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const link = propertyDetail?.latitude && propertyDetail?.longitude
                                                ? `https://www.google.com/maps/search/?api=1&query=${propertyDetail.latitude},${propertyDetail.longitude}`
                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyDetail?.fullAddress || "")}`
                                            window.open(link, "_blank")
                                        }}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Mở Google Maps
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                                    <iframe
                                        src={
                                            propertyDetail?.latitude && propertyDetail?.longitude
                                                ? `https://www.google.com/maps?q=${propertyDetail.latitude},${propertyDetail.longitude}&z=16&output=embed`
                                                : `https://www.google.com/maps?q=${encodeURIComponent(propertyDetail?.fullAddress || "")}&z=15&output=embed`
                                        }
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="rounded-lg"
                                    />

                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4 inline mr-1" />
                                    {propertyDetail?.fullAddress}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Agent Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Liên hệ tư vấn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-3 mb-4">
                                    {/* <Avatar>
                                        <AvatarImage src={property.agent.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar> */}
                                    <div>
                                        <div className="font-semibold">{`${propertyDetail?.user?.firstName ?? ""} ${propertyDetail?.user?.lastName ?? ""}`}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {propertyDetail?.user?.email}
                                        </div>
                                        {/* <div className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{property.agent.rating}</span>
                                            <span className="text-xs text-muted-foreground">({property.agent.reviews})</span>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {propertyDetail?.user?.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent" onClick={handleChatWithOwner}>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Nhắn tin
                                    </Button>
                                    {/* <Button variant="outline" className="w-full bg-transparent">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Đặt lịch xem
                                    </Button> */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Thao tác nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Lưu vào yêu thích
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Chia sẻ
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Xem trên bản đồ
                                </Button>
                            </CardContent>
                        </Card> */}

                        {/* Price Calculator */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Tính toán chi phí</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Giá bán:</span>
                                        <span className="font-semibold">{formatPrice(property.price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí môi giới (2%):</span>
                                        <span>{formatPrice(property.price * 0.02)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Thuế TNCN (2%):</span>
                                        <span>{formatPrice(property.price * 0.02)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Tổng chi phí:</span>
                                        <span className="text-accent">{formatPrice(property.price * 1.04)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
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
                    <Link to="/profile" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                        <User className="h-6 w-6" />
                        <span className="text-xs mt-1">Tài khoản</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
