import { Link } from "react-router-dom"

const formatVnd = (price?: number | null) => {
    if (price == null) return ""
    return Number(price).toLocaleString("vi-VN") + " đ"
}

export function PropertyCardMessage({
    title,
    price,
    image,
    detailLink,
    isMe,
}: {
    title?: string | null
    price?: number | null
    image?: string | null
    detailLink: string
    isMe: boolean
}) {
    return (
        <div
            className={`w-full max-w-sm rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg
            ${isMe ? "bg-white/95 border border-white/30" : "bg-white border border-gray-200"}`}
        >
            {/* Property Image */}
            <div className="h-36 overflow-hidden bg-gray-100">
                <img
                    src={image || "/placeholder.svg"}
                    alt={title || "Bất động sản"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Property Details */}
            <div className="p-4">
                <h3 className={`text-lg font-semibold line-clamp-2 mb-2 ${isMe ? "text-gray-800" : "text-gray-900"}`}>
                    {title || "Bất động sản"}
                </h3>

                {price && (
                    <p className={`text-xl font-bold mb-3 ${isMe ? "text-blue-600" : "text-blue-700"}`}>
                        {formatVnd(price)}
                    </p>
                )}

                <Link
                    to={detailLink}
                    className={`inline-block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200
                    ${isMe
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    )
}