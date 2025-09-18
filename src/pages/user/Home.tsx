import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Home,
    Search,
    Heart,
    MessageCircle,
    User,
    MapPin,
    Star,
    Bath,
    Bed,
    Square,
    TrendingUp,
    Award,
    Shield,
    Clock,
} from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}


            {/* Hero Section */}
            <section className="bg-gradient-to-br from-card to-background py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
                        Tìm ngôi nhà mơ ước của bạn
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Khám phá hàng nghìn bất động sản chất lượng cao tại Việt Nam với NgocMinh Property
                    </p>

                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input placeholder="Tìm kiếm theo địa điểm, dự án..." className="pl-10 h-12" />
                            </div>
                            <Link to="/search">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Tìm kiếm
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            {["Quận 1", "Quận 7", "Thủ Đức", "Bình Thạnh"].map((q) => (
                                <Badge
                                    key={q}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                >
                                    {q}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">Bất động sản nổi bật</h3>
                            <p className="text-muted-foreground">Những dự án được quan tâm nhất hiện tại</p>
                        </div>
                        <Link to="/search">
                            <Button variant="outline">Xem tất cả</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                id: 1,
                                title: "Vinhomes Central Park",
                                location: "Quận Bình Thạnh, TP.HCM",
                                price: "8.5 tỷ",
                                area: 85,
                                bedrooms: 2,
                                bathrooms: 2,
                                rating: 4.8,
                                image: "/luxury-apartment-vietnam-central-park.jpg",
                                featured: true,
                                trending: true,
                            },
                            {
                                id: 2,
                                title: "The Manor Mỹ Đình",
                                location: "Quận Nam Từ Liêm, Hà Nội",
                                price: "12.0 tỷ",
                                area: 120,
                                bedrooms: 3,
                                bathrooms: 3,
                                rating: 4.6,
                                image: "/modern-apartment-hanoi-manor.jpg",
                                featured: true,
                                trending: false,
                            },
                            {
                                id: 3,
                                title: "Masteri Thảo Điền",
                                location: "Quận 2, TP.HCM",
                                price: "6.8 tỷ",
                                area: 75,
                                bedrooms: 2,
                                bathrooms: 2,
                                rating: 4.7,
                                image: "/masteri-apartment-thao-dien.jpg",
                                featured: true,
                                trending: true,
                            },
                        ].map((property) => (
                            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="relative">
                                    <img
                                        src={property.image || "/placeholder.svg"}
                                        alt={property.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {property.featured && <Badge className="bg-accent">Nổi bật</Badge>}
                                        {property.trending && (
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                Hot
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">
                                        <Link to={`/property/${property.id}`} className="hover:text-accent">
                                            {property.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="flex items-center text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {property.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-accent">{property.price}</span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{property.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Bed className="h-4 w-4 mr-1" />
                                            {property.bedrooms} phòng ngủ
                                        </div>
                                        <div className="flex items-center">
                                            <Bath className="h-4 w-4 mr-1" />
                                            {property.bathrooms} phòng tắm
                                        </div>
                                        <div className="flex items-center">
                                            <Square className="h-4 w-4 mr-1" />
                                            {property.area}m²
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-foreground mb-4">Tại sao chọn PropertyHub?</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Chúng tôi cam kết mang đến trải nghiệm tìm kiếm bất động sản tốt nhất
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center p-6">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                <Shield className="h-6 w-6 text-accent" />
                            </div>
                            <h4 className="font-semibold mb-2">Uy tín đảm bảo</h4>
                            <p className="text-sm text-muted-foreground">Tất cả thông tin được xác minh và đảm bảo chính xác</p>
                        </Card>

                        <Card className="text-center p-6">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                <Award className="h-6 w-6 text-accent" />
                            </div>
                            <h4 className="font-semibold mb-2">Chất lượng cao</h4>
                            <p className="text-sm text-muted-foreground">Chỉ những bất động sản chất lượng cao được chọn lọc</p>
                        </Card>

                        <Card className="text-center p-6">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                <Clock className="h-6 w-6 text-accent" />
                            </div>
                            <h4 className="font-semibold mb-2">Hỗ trợ 24/7</h4>
                            <p className="text-sm text-muted-foreground">Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ</p>
                        </Card>

                        <Card className="text-center p-6">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                <TrendingUp className="h-6 w-6 text-accent" />
                            </div>
                            <h4 className="font-semibold mb-2">Cập nhật liên tục</h4>
                            <p className="text-sm text-muted-foreground">Thông tin thị trường và giá cả được cập nhật thường xuyên</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
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
        </div>
    )
}
