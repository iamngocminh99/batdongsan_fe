import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Heart,
    MapPin,
    Star,
    Bath,
    Bed,
    Square,
    Search,
    Share2,
    Grid,
    List,
    BookmarkPlus,
    Clock,
    Trash2,
} from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"

const API_URL = "http://localhost:8080/api/favorites"

interface PropertyImage {
    id: string
    url: string
}

interface Property {
    id: string
    title: string
    location?: string
    price: number
    saleType: string
    status: string
    bedrooms: number
    bathrooms: number
    floorAreaSqft: number
    propertyImages?: PropertyImage[]
}

interface Favorite {
    id: string
    property: Property
    addedAt: string
}

export default function FavoritesPage() {
    const { user, token } = useAuth()
    const navigate = useNavigate()

    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    useEffect(() => {
        if (user) {
            fetchFavorites()
        }
    }, [user])

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API_URL}/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setFavorites(res.data)
        } catch (e) {
            toast.error("Không thể tải danh sách yêu thích")
        }
    }

    const removeFavorite = async (propertyId: string) => {
        if (!user) return;
        try {
            await axios.delete(`${API_URL}/${user.id}/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            toast.success("Đã bỏ khỏi yêu thích")
            fetchFavorites()
        } catch {
            toast.error("Lỗi khi bỏ yêu thích")
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-xl font-bold">Yêu thích</h1>
                    </div>
                    <div className="flex border border-border rounded-md">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-r-none"
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="rounded-l-none"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <Tabs defaultValue="properties">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
                        <TabsTrigger value="properties" className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>Bất động sản ({favorites.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="searches" disabled className="flex items-center space-x-2">
                            <BookmarkPlus className="h-4 w-4" />
                            <span>Tìm kiếm đã lưu</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Favorite Properties Tab */}
                    <TabsContent value="properties" className="mt-6">
                        {favorites.length > 0 ? (
                            <div
                                className={
                                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                                }
                            >
                                {favorites.map((fav) => {
                                    const property = fav.property
                                    return (
                                        <Card
                                            key={fav.id}
                                            className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-row" : " "
                                                }`}
                                        >
                                            {/* Ảnh */}
                                            <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : " "}`}>
                                                {property.propertyImages?.[0] ? (
                                                    <img
                                                        src={property.propertyImages[0].url}
                                                        alt={property.title}
                                                        className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
                                                    />
                                                ) : (
                                                    <div className={`bg-gray-200 flex items-center justify-center text-sm text-gray-500 
    ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}>
                                                        No Image
                                                    </div>
                                                )}

                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="rounded-full p-2"
                                                        onClick={() => removeFavorite(property.id)}
                                                    >
                                                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                                    </Button>
                                                    <Button size="sm" variant="secondary" className="rounded-full p-2">
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Nội dung */}
                                            <div className="flex-1">
                                                <CardHeader className={viewMode === "list" ? "pb-2" : " "}>
                                                    <CardTitle className="text-lg line-clamp-2">
                                                        <Link to={`/property/${property.id}`} className="hover:text-accent">
                                                            {property.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center text-muted-foreground">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {property.location || "Đang cập nhật"}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className={viewMode === "list" ? "pt-0" : " "}>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-2xl font-bold text-accent">
                                                            {property.price.toLocaleString()} VNĐ
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-4 w-4 text-yellow-400" />
                                                            <span className="text-sm">-</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
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
                                                            {property.floorAreaSqft} m²
                                                        </div>
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">Đã lưu: {formatDate(fav.addedAt)}</div>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Heart className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Chưa có bất động sản yêu thích</h3>
                                <p className="text-muted-foreground mb-4">Hãy khám phá và lưu những bất động sản bạn quan tâm</p>
                                <Button onClick={() => navigate("/search")}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Tìm kiếm ngay
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
