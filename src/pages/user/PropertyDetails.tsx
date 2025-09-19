import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";

// Mock property data
const getPropertyData = (id: string | undefined) => {
    const properties = {
        "1": {
            id: 1,
            title: "Vinhomes Central Park - Căn hộ cao cấp view sông",
            location: "208 Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM",
            price: 8500000000,
            area: 85,
            bedrooms: 2,
            bathrooms: 2,
            rating: 4.8,
            reviews: 124,
            type: "Căn hộ",
            status: "Sẵn sàng ở",
            yearBuilt: 2018,
            floor: "Tầng 25/40",
            direction: "Đông Nam",
            legalStatus: "Sổ hồng riêng",
            images: [
                "/luxury-apartment-vietnam-central-park.jpg",
                "/modern-apartment-living-room.jpg",
                "/luxury-apartment-bedroom.jpg",
                "/modern-apartment-kitchen.jpg",
                "/luxury-apartment-bathroom.jpg",
                "/apartment-balcony-view.jpg",
            ],
            description: `Căn hộ cao cấp tại Vinhomes Central Park với view sông Sài Gòn tuyệt đẹp. 
      Thiết kế hiện đại, đầy đủ nội thất cao cấp. Vị trí đắc địa ngay trung tâm thành phố, 
      giao thông thuận tiện, đầy đủ tiện ích xung quanh.`,
            features: [
                "Nội thất cao cấp đầy đủ",
                "View sông Sài Gòn",
                "Hệ thống điều hòa trung tâm",
                "Bếp hiện đại với đầy đủ thiết bị",
                "Phòng tắm cao cấp",
                "Ban công rộng rãi",
                "Hệ thống an ninh 24/7",
                "Thang máy tốc độ cao",
            ],
            amenities: [
                { icon: Dumbbell, name: "Phòng gym" },
                { icon: Car, name: "Bãi đỗ xe" },
                { icon: Wifi, name: "WiFi miễn phí" },
                { icon: ShoppingCart, name: "Trung tâm thương mại" },
            ],
            nearbyPlaces: [
                { icon: Hospital, name: "Bệnh viện Chợ Rẫy", distance: "2.5km" },
                { icon: GraduationCap, name: "Đại học Kinh tế", distance: "1.8km" },
                { icon: ShoppingCart, name: "Landmark 81", distance: "500m" },
            ],
            agent: {
                name: "Nguyễn Văn An",
                avatar: "/agent-avatar-1.jpg",
                rating: 4.9,
                reviews: 89,
                phone: "0901234567",
                experience: "5 năm kinh nghiệm",
            },
            coordinates: {
                lat: 10.7941,
                lng: 106.7219,
            },
        },
    };

    return properties[id as keyof typeof properties] || properties["1"];
};

export default function PropertyDetails() {
    const { id } = useParams();
    const property = getPropertyData(id);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} tỷ`;
        }
        return `${(price / 1000000).toFixed(0)} triệu`;
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

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
                            <h1 className="text-lg font-semibold text-foreground line-clamp-1">
                                Chi tiết bất động sản
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
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
                            src={property.images[currentImageIndex] || "/placeholder.svg"}
                            alt={property.title}
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
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>

                    {/* Image thumbnails */}
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                        {property.images.map((image, index) => (
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
                                        <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                                        <CardDescription className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {property.location}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-accent">{formatPrice(property.price)}</div>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{property.rating}</span>
                                            <span className="text-sm text-muted-foreground">({property.reviews} đánh giá)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Bed className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{property.bedrooms}</div>
                                        <div className="text-sm text-muted-foreground">Phòng ngủ</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Bath className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{property.bathrooms}</div>
                                        <div className="text-sm text-muted-foreground">Phòng tắm</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Square className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{property.area}m²</div>
                                        <div className="text-sm text-muted-foreground">Diện tích</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <Home className="h-6 w-6 mx-auto mb-2 text-accent" />
                                        <div className="font-semibold">{property.type}</div>
                                        <div className="text-sm text-muted-foreground">Loại hình</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Trạng thái:</span>
                                        <Badge variant="secondary" className="ml-2">
                                            {property.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Năm xây dựng:</span>
                                        <span className="ml-2 font-medium">{property.yearBuilt}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Tầng:</span>
                                        <span className="ml-2 font-medium">{property.floor}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Hướng:</span>
                                        <span className="ml-2 font-medium">{property.direction}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">Pháp lý:</span>
                                        <span className="ml-2 font-medium">{property.legalStatus}</span>
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
                                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Đặc điểm nổi bật</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {property.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tiện ích</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {property.amenities.map((amenity, index) => (
                                        <div key={index} className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                                            <amenity.icon className="h-6 w-6 text-accent mb-2" />
                                            <span className="text-sm">{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Nearby Places */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tiện ích xung quanh</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {property.nearbyPlaces.map((place, index) => (
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
                        </Card>

                        {/* Map */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Vị trí
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Mở Google Maps
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                                    <iframe
                                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6306852203937!2d${property.coordinates.lng}!3d${property.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ3JzM4LjgiTiAxMDbCsDQzJzE4LjgiRQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="rounded-lg"
                                    ></iframe>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4 inline mr-1" />
                                    {property.location}
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
                                    <Avatar>
                                        <AvatarImage src={property.agent.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{property.agent.name}</div>
                                        <div className="text-sm text-muted-foreground">{property.agent.experience}</div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs">{property.agent.rating}</span>
                                            <span className="text-xs text-muted-foreground">({property.agent.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {property.agent.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Nhắn tin
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Đặt lịch xem
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
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
                        </Card>

                        {/* Price Calculator */}
                        <Card>
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
                        </Card>
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

    );
}
