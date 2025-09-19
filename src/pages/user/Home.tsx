import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Search,
    Heart,
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
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { BottomNavigation } from "./component/BottomNavigation"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
    const [properties, setProperties] = useState<any[]>([])
    const { user, token } = useAuth()
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

    const toggleFavorite = async (propertyId: string) => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để lưu yêu thích")
            return
        }

        // trùng là đã yêu thích
        const isFavorite = favorites.includes(propertyId)

        try {
            if (isFavorite) {
                // Nếu đã yêu thích -> gọi DELETE
                await axios.delete(`http://localhost:8080/api/favorites/${user.id}/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                toast.success("Đã bỏ yêu thích")
                setFavorites(favorites.filter(id => id !== propertyId))
            } else {
                // Nếu chưa yêu thích -> gọi POST
                await axios.post(
                    `http://localhost:8080/api/favorites/${user.id}/${propertyId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                toast.success("Đã thêm vào yêu thích")
                setFavorites([...favorites, propertyId])
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        }
    }


    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/properties", {
                params: { page: 0, size: 3 },
                headers: { Authorization: `Bearer ${token}` },
            })
            setProperties(res.data.content)
        } catch {
            toast.error("Không thể tải danh sách property")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("")

    const handleSearch = () => {
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
    }
    const handleFavorite = async (propertyId: string) => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để lưu yêu thích")
            return
        }

        try {
            await axios.post(
                `http://localhost:8080/api/favorites/${user.id}/${propertyId}`,
                {}, // body rỗng
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("Đã thêm vào yêu thích")
        } catch (error) {
            toast.error("Không thể thêm vào yêu thích")
        }
    }


    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-card to-background py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
                        Tìm ngôi nhà mơ ước của bạn
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Khám phá hàng nghìn bất động sản chất lượng cao tại Việt Nam với NgocMinh Property
                    </p>

                    <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm theo địa điểm, dự án..."
                                className="pl-10 h-12"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />

                        </div>
                        <Button size="lg" className="w-full sm:w-auto" onClick={handleSearch}>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-3xl font-bold text-foreground mb-2">Bất động sản mới</h3>
                            <p className="text-muted-foreground">Những dự án mới nhất hiện tại</p>
                        </div>
                        <Link to="/search">
                            <Button variant="outline">Xem tất cả</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="relative">
                                    <img
                                        src={property.imageUrl || "/placeholder.svg"}
                                        alt={property.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="rounded-full p-2"
                                            onClick={() => toggleFavorite(property.id)}
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""
                                                    }`}
                                            />
                                        </Button>


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
                                        {property.fullAddress || "Đang cập nhật"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-accent">{property.price}</span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">4.5</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Bed className="h-4 w-4 mr-1" />
                                            {property.bedrooms} PN
                                        </div>
                                        <div className="flex items-center">
                                            <Bath className="h-4 w-4 mr-1" />
                                            {property.bathrooms} PT
                                        </div>
                                        <div className="flex items-center">
                                            <Square className="h-4 w-4 mr-1" />
                                            {property.floorAreaSqft || 0} m²
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us + Bottom Nav giữ nguyên */}
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
            <BottomNavigation />
        </div>
    )
}
