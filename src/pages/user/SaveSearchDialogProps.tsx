import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookmarkPlus, Check } from "lucide-react"

interface SaveSearchDialogProps {
    searchCriteria: {
        query?: string
        propertyType?: string
        location?: string
        priceRange?: number[]
        bedrooms?: string
    }
    onSave?: (name: string) => void
}

export function SaveSearchDialog({ searchCriteria, onSave }: SaveSearchDialogProps) {
    const [open, setOpen] = useState(false)
    const [searchName, setSearchName] = useState("")
    const [isSaved, setIsSaved] = useState(false)

    const handleSave = () => {
        if (searchName.trim()) {
            onSave?.(searchName)
            setIsSaved(true)
            setTimeout(() => {
                setOpen(false)
                setIsSaved(false)
                setSearchName("")
            }, 1500)
        }
    }

    const generateDefaultName = () => {
        const parts = []
        if (searchCriteria.propertyType && searchCriteria.propertyType !== "all") {
            parts.push(searchCriteria.propertyType)
        }
        if (searchCriteria.location && searchCriteria.location !== "all") {
            parts.push(searchCriteria.location)
        }
        if (searchCriteria.priceRange) {
            const [min, max] = searchCriteria.priceRange
            if (max < 50000000000) {
                parts.push(`dưới ${(max / 1000000000).toFixed(1)} tỷ`)
            }
        }
        return parts.join(" ") || "Tìm kiếm của tôi"
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Lưu tìm kiếm
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lưu tìm kiếm</DialogTitle>
                    <DialogDescription>
                        Đặt tên cho tìm kiếm này để theo dõi các bất động sản mới phù hợp.
                    </DialogDescription>
                </DialogHeader>

                {!isSaved ? (
                    <>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="search-name">Tên tìm kiếm</Label>
                                <Input
                                    id="search-name"
                                    placeholder={generateDefaultName()}
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tiêu chí tìm kiếm</Label>
                                <div className="flex flex-wrap gap-2">
                                    {searchCriteria.query && (
                                        <div className="px-2 py-1 bg-muted rounded text-sm">
                                            "{searchCriteria.query}"
                                        </div>
                                    )}
                                    {searchCriteria.propertyType && searchCriteria.propertyType !== "all" && (
                                        <div className="px-2 py-1 bg-muted rounded text-sm">
                                            {searchCriteria.propertyType}
                                        </div>
                                    )}
                                    {searchCriteria.location && searchCriteria.location !== "all" && (
                                        <div className="px-2 py-1 bg-muted rounded text-sm">
                                            {searchCriteria.location}
                                        </div>
                                    )}
                                    {searchCriteria.bedrooms && searchCriteria.bedrooms !== "all" && (
                                        <div className="px-2 py-1 bg-muted rounded text-sm">
                                            {searchCriteria.bedrooms} phòng ngủ
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSave} disabled={!searchName.trim()}>
                                Lưu tìm kiếm
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Đã lưu thành công!</h3>
                        <p className="text-muted-foreground">
                            Tìm kiếm "{searchName}" đã được lưu vào danh sách của bạn.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
