import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
    Home,
    Search,
    MapPin,
    Star,
    Bath,
    Bed,
    Square,
    Heart,
    ArrowLeft,
    SlidersHorizontal,
    Grid,
    List,
    MessageCircle,
    User,
} from "lucide-react"
import { SaveSearchDialog } from "./SaveSearchDialogProps"

const mockProperties = [
    {
        id: 1,
        title: "Căn hộ cao cấp Vinhomes Central Park",
        location: "Quận Bình Thạnh, TP.HCM",
        price: 8500000000,
        area: 85,
        bedrooms: 2,
        bathrooms: 2,
        rating: 4.8,
        image: "/luxury-apartment-vietnam.jpg",
        type: "apartment",
        featured: true,
    },
    {
        id: 2,
        title: "Nhà phố hiện đại Thủ Đức",
        location: "Thành phố Thủ Đức, TP.HCM",
        price: 12000000000,
        area: 120,
        bedrooms: 3,
        bathrooms: 3,
        rating: 4.6,
        image: "/modern-townhouse-vietnam.jpg",
        type: "house",
        featured: false,
    },
    // ... (các item còn lại giữ nguyên)
]

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [priceRange, setPriceRange] = useState([0, 50000000000])
    const [propertyType, setPropertyType] = useState("all")
    const [location, setLocation] = useState("all")
    const [bedrooms, setBedrooms] = useState("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)
    const [favorites, setFavorites] = useState<number[]>([])

    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} tỷ`
        }
        return `${(price / 1000000).toFixed(0)} triệu`
    }

    const toggleFavorite = (propertyId: number) => {
        setFavorites((prev) =>
            prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
        )
    }

    const handleSaveSearch = (name: string) => {
        const searchCriteria = {
            query: searchQuery,
            propertyType,
            location,
            priceRange,
            bedrooms,
        }
        console.log("Saving search:", name, searchCriteria)
    }

    const filteredProperties = mockProperties.filter((property) => {
        const matchesSearch =
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
        const matchesType = propertyType === "all" || property.type === propertyType
        const matchesBedrooms = bedrooms === "all" || property.bedrooms.toString() === bedrooms

        return matchesSearch && matchesPrice && matchesType && matchesBedrooms
    })

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
                            <h1 className="text-xl font-bold text-foreground">Tìm kiếm</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <SaveSearchDialog
                                searchCriteria={{
                                    query: searchQuery,
                                    propertyType,
                                    location,
                                    priceRange,
                                    bedrooms,
                                }}
                                onSave={handleSaveSearch}
                            />
                            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Bộ lọc
                            </Button>
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
                    </div>
                </div>
            </header>

            {/* Search input, filters, results ... */}
            <div className="container mx-auto px-4 py-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo tên dự án, địa điểm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Loại bất động sản</Label>
                                    <Select value={propertyType} onValueChange={setPropertyType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="apartment">Căn hộ</SelectItem>
                                            <SelectItem value="house">Nhà phố</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                            <SelectItem value="penthouse">Penthouse</SelectItem>
                                            <SelectItem value="commercial">Thương mại</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Khu vực</Label>
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="q1">Quận 1</SelectItem>
                                            <SelectItem value="q2">Quận 2</SelectItem>
                                            <SelectItem value="q3">Quận 3</SelectItem>
                                            <SelectItem value="q7">Quận 7</SelectItem>
                                            <SelectItem value="binh-thanh">Bình Thạnh</SelectItem>
                                            <SelectItem value="thu-duc">Thủ Đức</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Số phòng ngủ</Label>
                                    <Select value={bedrooms} onValueChange={setBedrooms}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="1">1 phòng</SelectItem>
                                            <SelectItem value="2">2 phòng</SelectItem>
                                            <SelectItem value="3">3 phòng</SelectItem>
                                            <SelectItem value="4">4+ phòng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                                </Label>
                                <Slider
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    max={50000000000}
                                    min={0}
                                    step={500000000}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold">Tìm thấy {filteredProperties.length} bất động sản</h2>
                        <p className="text-sm text-muted-foreground">Kết quả tìm kiếm phù hợp với tiêu chí của bạn</p>
                    </div>
                </div>

                {/* Property Grid/List */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredProperties.map((property) => (
                        <Card
                            key={property.id}
                            className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-row" : ""
                                }`}
                        >
                            <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                                <img
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.title}
                                    className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
                                />
                                <div className="absolute top-2 right-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="rounded-full p-2"
                                        onClick={() => toggleFavorite(property.id)}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""}`}
                                        />
                                    </Button>
                                </div>
                                {property.featured && <Badge className="absolute top-2 left-2 bg-accent">Nổi bật</Badge>}
                            </div>

                            <div className="flex-1">
                                <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
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

                                <CardContent className={viewMode === "list" ? "pt-0" : ""}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-accent">{formatPrice(property.price)}</span>
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
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-muted-foreground mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                        <Button
                            onClick={() => {
                                setSearchQuery("")
                                setPropertyType("all")
                                setLocation("all")
                                setBedrooms("all")
                                setPriceRange([0, 50000000000])
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
                <div className="flex items-center justify-around py-2">
                    <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground hover:text-accent">
                        <Home className="h-6 w-6" />
                        <span className="text-xs mt-1">Trang chủ</span>
                    </Link>
                    <Link to="/search" className="flex flex-col items-center p-2 text-accent">
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
