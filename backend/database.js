// ==================== DATABASE STRUCTURE ====================

// Danh mục sản phẩm
const categories = [
    {
        id: 1,
        name: "Transformers",
        slug: "transformers",
        description: "Mô hình Transformers cao cấp từ các thương hiệu nổi tiếng",
        image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=600&fit=crop",
        icon: "🤖"
    },
    {
        id: 2,
        name: "Marvel",
        slug: "marvel",
        description: "Mô hình siêu anh hùng Marvel chính hãng",
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop",
        icon: "🦸"
    },
    {
        id: 3,
        name: "DC Comics",
        slug: "dc-comics",
        description: "Mô hình DC Comics - Batman, Superman và nhiều hơn nữa",
        image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/299/021/products/455026.jpg?v=1716451215497",
        icon: "🦇"
    },
    {
        id: 4,
        name: "Gundam",
        slug: "gundam",
        description: "Mô hình lắp ráp Gundam từ Nhật Bản",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop",
        icon: "🚀"
    },
    {
        id: 5,
        name: "Action Figure",
        slug: "action-figure",
        description: "Các mô hình action figure cao cấp",
        image: "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=800&h=600&fit=crop",
        icon: "🎭"
    },
    {
        id: 6,
        name: "Blind Box",
        slug: "blind-box",
        description: "Blind box và art toys độc đáo",
        image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop",
        icon: "🎁"
    }
];

// Thương hiệu
const brands = [
    { id: 1, name: "Threezero", logo: "https://via.placeholder.com/150x50/333/fff?text=Threezero" },
    { id: 2, name: "Yolopark", logo: "https://via.placeholder.com/150x50/333/fff?text=Yolopark" },
    { id: 3, name: "Hot Toys", logo: "https://via.placeholder.com/150x50/333/fff?text=Hot+Toys" },
    { id: 4, name: "Bandai", logo: "https://via.placeholder.com/150x50/333/fff?text=Bandai" },
    { id: 5, name: "ZD Toys", logo: "https://via.placeholder.com/150x50/333/fff?text=ZD+Toys" },
    { id: 6, name: "Blokees", logo: "https://via.placeholder.com/150x50/333/fff?text=Blokees" }
];

// Sản phẩm chi tiết
const products = [
    {
        id: 1,
        name: "Threezero DLX Optimus Prime - Transformers Rise of the Beasts",
        slug: "threezero-dlx-optimus-prime-rotb",
        categoryId: 1,
        brandId: 1,
        price: 5200000,
        oldPrice: 5800000,
        stock: 15,
        rating: 4.8,
        reviewCount: 124,
        badge: "HOT",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Optimus Prime cao cấp từ bộ phim Transformers: Rise of the Beasts. Sản phẩm được làm từ chất liệu ABS và Die-cast cao cấp, với khả năng biến hình hoàn hảo.",
        specifications: {
            "Thương hiệu": "Threezero",
            "Dòng sản phẩm": "DLX Series",
            "Chiều cao": "~25cm",
            "Chất liệu": "ABS, Die-cast, PVC",
            "Khớp cử động": "30+ điểm khớp",
            "Phụ kiện": "Vũ khí, bàn tay thay thế, hiệu ứng",
            "Xuất xứ": "Trung Quốc (Licensed)",
            "Năm phát hành": "2024"
        },
        features: [
            "Thiết kế chi tiết cao, sát với phim",
            "Khả năng biến hình hoàn hảo",
            "Chất liệu Die-cast cao cấp",
            "Hơn 30 điểm khớp cử động",
            "Đèn LED tại mắt và ngực",
            "Nhiều phụ kiện đi kèm"
        ],
        tags: ["transformers", "optimus-prime", "threezero", "dlx", "hot"]
    },
    {
        id: 2,
        name: "Hot Toys Iron Man Mark 85 - Avengers Endgame",
        slug: "hot-toys-iron-man-mark-85",
        categoryId: 2,
        brandId: 3,
        price: 12500000,
        oldPrice: null,
        stock: 8,
        rating: 4.9,
        reviewCount: 256,
        badge: "NEW",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Iron Man Mark 85 tỷ lệ 1/6 từ Hot Toys, tái hiện bộ giáp cuối cùng của Tony Stark trong Avengers: Endgame. Sản phẩm cao cấp với chi tiết hoàn hảo và hệ thống đèn LED.",
        specifications: {
            "Thương hiệu": "Hot Toys",
            "Dòng sản phẩm": "Movie Masterpiece Series",
            "Tỷ lệ": "1/6",
            "Chiều cao": "~32cm",
            "Chất liệu": "Die-cast, Plastic",
            "Khớp cử động": "40+ điểm khớp",
            "Phụ kiện": "Nano Gauntlet, hiệu ứng năng lượng, bàn tay thay thế",
            "Xuất xứ": "Hong Kong",
            "Năm phát hành": "2024"
        },
        features: [
            "Tỷ lệ 1/6 cao cấp",
            "Hệ thống đèn LED tại Arc Reactor và mắt",
            "Chất liệu Die-cast cao cấp",
            "Hơn 40 điểm khớp",
            "Nano Gauntlet với 6 viên đá vô cực",
            "Nhiều hiệu ứng năng lượng đi kèm",
            "Đế trưng bày cao cấp"
        ],
        tags: ["marvel", "iron-man", "hot-toys", "avengers", "endgame", "new"]
    },
    {
        id: 3,
        name: "Yolopark AMK Bumblebee - Transformers Movie",
        slug: "yolopark-amk-bumblebee",
        categoryId: 1,
        brandId: 2,
        price: 850000,
        oldPrice: 1200000,
        stock: 45,
        rating: 4.6,
        reviewCount: 89,
        badge: "-29%",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=800&h=800&fit=crop"
        ],
        description: "Mô hình lắp ráp Bumblebee từ Yolopark AMK series. Sản phẩm không cần keo dán, dễ lắp ráp với hướng dẫn chi tiết. Thiết kế đẹp mắt và có thể biến hình.",
        specifications: {
            "Thương hiệu": "Yolopark",
            "Dòng sản phẩm": "AMK Series",
            "Chiều cao": "~18cm",
            "Chất liệu": "ABS Plastic",
            "Số chi tiết": "~200 pieces",
            "Độ khó": "Trung bình",
            "Phụ kiện": "Vũ khí, sticker",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2023"
        },
        features: [
            "Không cần keo dán",
            "Hướng dẫn lắp ráp chi tiết",
            "Có thể biến hình",
            "Thiết kế đẹp mắt",
            "Giá cả phải chăng",
            "Phù hợp cho người mới bắt đầu"
        ],
        tags: ["transformers", "bumblebee", "yolopark", "model-kit", "sale"]
    },
    {
        id: 4,
        name: "Bandai RG Gundam Unicorn - 1/144 Scale",
        slug: "bandai-rg-gundam-unicorn",
        categoryId: 4,
        brandId: 4,
        price: 1350000,
        oldPrice: null,
        stock: 32,
        rating: 4.9,
        reviewCount: 178,
        badge: "BEST SELLER",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Gunpla Real Grade Unicorn Gundam tỷ lệ 1/144 từ Bandai. Sản phẩm có khung nội tại chi tiết, có thể chuyển đổi giữa chế độ Unicorn và Destroy.",
        specifications: {
            "Thương hiệu": "Bandai",
            "Dòng sản phẩm": "Real Grade (RG)",
            "Tỷ lệ": "1/144",
            "Chiều cao": "~16cm",
            "Chất liệu": "PS Plastic",
            "Số chi tiết": "~300 pieces",
            "Độ khó": "Trung bình - Cao",
            "Phụ kiện": "Beam Magnum, Shield, Beam Sabers",
            "Xuất xứ": "Nhật Bản",
            "Năm phát hành": "2023"
        },
        features: [
            "Khung nội tại chi tiết",
            "Chuyển đổi Unicorn/Destroy mode",
            "Psycho-Frame có thể phát sáng",
            "Chi tiết panel line sắc nét",
            "Nhiều vũ khí đi kèm",
            "Chất lượng Bandai cao cấp"
        ],
        tags: ["gundam", "bandai", "rg", "unicorn", "best-seller"]
    },
    {
        id: 5,
        name: "ZD Toys Iron Man Mark 7 - The Avengers",
        slug: "zd-toys-iron-man-mark-7",
        categoryId: 2,
        brandId: 5,
        price: 680000,
        oldPrice: 850000,
        stock: 28,
        rating: 4.5,
        reviewCount: 67,
        badge: "-20%",
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Iron Man Mark 7 tỷ lệ 1/10 từ ZD Toys. Sản phẩm có khớp cử động linh hoạt, nhiều phụ kiện và giá cả phải chăng.",
        specifications: {
            "Thương hiệu": "ZD Toys",
            "Dòng sản phẩm": "1/10 Scale Series",
            "Tỷ lệ": "1/10",
            "Chiều cao": "~18cm",
            "Chất liệu": "ABS, PVC",
            "Khớp cử động": "25+ điểm khớp",
            "Phụ kiện": "Bàn tay thay thế, hiệu ứng",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2023"
        },
        features: [
            "Giá cả phải chăng",
            "Khớp cử động tốt",
            "Nhiều phụ kiện",
            "Thiết kế đẹp mắt",
            "Phù hợp cho người mới",
            "Dễ tạo dáng"
        ],
        tags: ["marvel", "iron-man", "zd-toys", "affordable", "sale"]
    },
    {
        id: 6,
        name: "Blokees Transformers Megatron DOTM",
        slug: "blokees-megatron-dotm",
        categoryId: 1,
        brandId: 6,
        price: 420000,
        oldPrice: null,
        stock: 56,
        rating: 4.4,
        reviewCount: 45,
        badge: null,
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=800&h=800&fit=crop"
        ],
        description: "Mô hình lắp ráp Megatron từ Dark of the Moon. Sản phẩm dạng block building, dễ lắp ráp và có giá tốt.",
        specifications: {
            "Thương hiệu": "Blokees",
            "Dòng sản phẩm": "Building Block Series",
            "Chiều cao": "~15cm",
            "Chất liệu": "ABS Plastic",
            "Số chi tiết": "~180 pieces",
            "Độ khó": "Dễ",
            "Phụ kiện": "Vũ khí",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2023"
        },
        features: [
            "Dễ lắp ráp",
            "Giá rẻ",
            "Phù hợp trẻ em",
            "Thiết kế đơn giản",
            "Chất lượng tốt",
            "Nhiều màu sắc"
        ],
        tags: ["transformers", "megatron", "blokees", "building-block", "affordable"]
    },
    {
        id: 7,
        name: "Hot Toys Spider-Man Advanced Suit",
        slug: "hot-toys-spiderman-advanced",
        categoryId: 2,
        brandId: 3,
        price: 11800000,
        oldPrice: null,
        stock: 12,
        rating: 4.9,
        reviewCount: 203,
        badge: "HOT",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Spider-Man Advanced Suit tỷ lệ 1/6 từ Hot Toys. Chi tiết hoàn hảo với bộ đồ có texture thực tế và nhiều phụ kiện đi kèm.",
        specifications: {
            "Thương hiệu": "Hot Toys",
            "Dòng sản phẩm": "Video Game Masterpiece",
            "Tỷ lệ": "1/6",
            "Chiều cao": "~30cm",
            "Chất liệu": "PVC, Fabric",
            "Khớp cử động": "30+ điểm khớp",
            "Phụ kiện": "Web effects, hands, base",
            "Xuất xứ": "Hong Kong",
            "Năm phát hành": "2024"
        },
        features: [
            "Bộ đồ vải cao cấp",
            "Nhiều bàn tay thay thế",
            "Hiệu ứng mạng nhện",
            "Khớp cử động linh hoạt",
            "Đế trưng bày đẹp",
            "Chi tiết sắc nét"
        ],
        tags: ["marvel", "spiderman", "hot-toys", "video-game", "hot"]
    },
    {
        id: 8,
        name: "Threezero DLX Starscream - Transformers ROTB",
        slug: "threezero-dlx-starscream",
        categoryId: 1,
        brandId: 1,
        price: 4800000,
        oldPrice: 5500000,
        stock: 18,
        rating: 4.7,
        reviewCount: 92,
        badge: "-13%",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Starscream cao cấp từ Threezero DLX series. Có khả năng biến hình và nhiều vũ khí đi kèm.",
        specifications: {
            "Thương hiệu": "Threezero",
            "Dòng sản phẩm": "DLX Series",
            "Chiều cao": "~23cm",
            "Chất liệu": "ABS, Die-cast",
            "Khớp cử động": "28+ điểm khớp",
            "Phụ kiện": "Weapons, effects",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2024"
        },
        features: [
            "Biến hình hoàn hảo",
            "Die-cast cao cấp",
            "Nhiều vũ khí",
            "Khớp cử động tốt",
            "Sơn phủ đẹp",
            "Chi tiết cao"
        ],
        tags: ["transformers", "starscream", "threezero", "dlx", "sale"]
    },
    {
        id: 9,
        name: "Bandai MG Gundam Strike Freedom - 1/100",
        slug: "bandai-mg-strike-freedom",
        categoryId: 4,
        brandId: 4,
        price: 2100000,
        oldPrice: null,
        stock: 25,
        rating: 4.8,
        reviewCount: 156,
        badge: "BEST SELLER",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&h=800&fit=crop"
        ],
        description: "Master Grade Strike Freedom Gundam tỷ lệ 1/100. Mô hình có khung nội tại chi tiết và nhiều vũ khí.",
        specifications: {
            "Thương hiệu": "Bandai",
            "Dòng sản phẩm": "Master Grade (MG)",
            "Tỷ lệ": "1/100",
            "Chiều cao": "~20cm",
            "Chất liệu": "PS Plastic",
            "Số chi tiết": "~400 pieces",
            "Độ khó": "Cao",
            "Phụ kiện": "Beam Rifles, Wings, Effects",
            "Xuất xứ": "Nhật Bản",
            "Năm phát hành": "2023"
        },
        features: [
            "Khung nội tại chi tiết",
            "Cánh có thể mở",
            "Nhiều vũ khí",
            "Chất lượng Bandai",
            "Có thể tạo dáng đẹp",
            "Panel line sắc nét"
        ],
        tags: ["gundam", "bandai", "mg", "strike-freedom", "best-seller"]
    },
    {
        id: 10,
        name: "ZD Toys Captain America - Avengers",
        slug: "zd-toys-captain-america",
        categoryId: 2,
        brandId: 5,
        price: 720000,
        oldPrice: 900000,
        stock: 34,
        rating: 4.5,
        reviewCount: 78,
        badge: "-20%",
        featured: false,
        images: [
            "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Captain America tỷ lệ 1/10 từ ZD Toys. Đi kèm khiên và nhiều phụ kiện.",
        specifications: {
            "Thương hiệu": "ZD Toys",
            "Dòng sản phẩm": "1/10 Scale",
            "Tỷ lệ": "1/10",
            "Chiều cao": "~18cm",
            "Chất liệu": "ABS, PVC",
            "Khớp cử động": "25+ điểm",
            "Phụ kiện": "Shield, hands",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2023"
        },
        features: [
            "Giá phải chăng",
            "Khiên đẹp",
            "Khớp tốt",
            "Dễ tạo dáng",
            "Chất lượng ổn",
            "Phù hợp người mới"
        ],
        tags: ["marvel", "captain-america", "zd-toys", "affordable", "sale"]
    },
    {
        id: 11,
        name: "Yolopark AMK Optimus Prime G1",
        slug: "yolopark-amk-optimus-g1",
        categoryId: 1,
        brandId: 2,
        price: 950000,
        oldPrice: null,
        stock: 40,
        rating: 4.7,
        reviewCount: 112,
        badge: "NEW",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825232-1e0b1d3b3f6f?w=800&h=800&fit=crop"
        ],
        description: "Mô hình lắp ráp Optimus Prime phiên bản G1 classic. Thiết kế retro đẹp mắt.",
        specifications: {
            "Thương hiệu": "Yolopark",
            "Dòng sản phẩm": "AMK Series",
            "Chiều cao": "~20cm",
            "Chất liệu": "ABS Plastic",
            "Số chi tiết": "~250 pieces",
            "Độ khó": "Trung bình",
            "Phụ kiện": "Weapons, Matrix",
            "Xuất xứ": "Trung Quốc",
            "Năm phát hành": "2024"
        },
        features: [
            "Thiết kế G1 classic",
            "Dễ lắp ráp",
            "Có thể biến hình",
            "Giá tốt",
            "Chất lượng cao",
            "Màu sắc đẹp"
        ],
        tags: ["transformers", "optimus-prime", "yolopark", "g1", "new"]
    },
    {
        id: 12,
        name: "Hot Toys Batman Dark Knight",
        slug: "hot-toys-batman-dark-knight",
        categoryId: 3,
        brandId: 3,
        price: 13500000,
        oldPrice: null,
        stock: 6,
        rating: 5.0,
        reviewCount: 189,
        badge: "HOT",
        featured: true,
        images: [
            "https://images.unsplash.com/photo-1608889476518-738c9b1dcb90?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825271-fc0db00e5e1f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800&h=800&fit=crop"
        ],
        description: "Mô hình Batman từ The Dark Knight tỷ lệ 1/6. Đỉnh cao của Hot Toys với chi tiết hoàn hảo.",
        specifications: {
            "Thương hiệu": "Hot Toys",
            "Dòng sản phẩm": "Movie Masterpiece",
            "Tỷ lệ": "1/6",
            "Chiều cao": "~32cm",
            "Chất liệu": "PVC, Fabric, Rubber",
            "Khớp cử động": "30+ điểm",
            "Phụ kiện": "Cape, Batarangs, Grapple Gun",
            "Xuất xứ": "Hong Kong",
            "Năm phát hành": "2024"
        },
        features: [
            "Bộ đồ vải cao cấp",
            "Cape có dây",
            "Nhiều vũ khí",
            "Đầu điêu khắc sắc nét",
            "Chất lượng đỉnh cao",
            "Đế trưng bày đẹp"
        ],
        tags: ["dc", "batman", "hot-toys", "dark-knight", "hot"]
    }
];

// Đánh giá sản phẩm
const reviews = [
    {
        id: 1,
        productId: 1,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sản phẩm tuyệt vời! Chất lượng cao, đóng gói cẩn thận. Rất đáng tiền!",
        date: "2024-01-15",
        helpful: 24
    },
    {
        id: 2,
        productId: 1,
        userName: "Trần Thị B",
        rating: 4,
        comment: "Mô hình đẹp, chi tiết tốt. Giá hơi cao nhưng xứng đáng.",
        date: "2024-01-10",
        helpful: 12
    },
    {
        id: 3,
        productId: 2,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Hot Toys không bao giờ làm tôi thất vọng. Chất lượng đỉnh cao!",
        date: "2024-01-20",
        helpful: 45
    }
];

// Giỏ hàng (lưu trong localStorage)
let cart = [];

// Đơn hàng mẫu
const orders = [];

// ==================== HELPER FUNCTIONS ====================

// Lấy sản phẩm theo ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Lấy sản phẩm theo slug
function getProductBySlug(slug) {
    return products.find(p => p.slug === slug);
}

// Lấy sản phẩm theo danh mục
function getProductsByCategory(categoryId) {
    return products.filter(p => p.categoryId === categoryId);
}

// Lấy sản phẩm nổi bật
function getFeaturedProducts() {
    return products.filter(p => p.featured);
}

// Lấy sản phẩm giảm giá
function getSaleProducts() {
    return products.filter(p => p.oldPrice !== null);
}

// Lấy sản phẩm mới
function getNewProducts() {
    return products.filter(p => p.badge === "NEW");
}

// Lấy danh mục theo slug
function getCategoryBySlug(slug) {
    return categories.find(c => c.slug === slug);
}

// Tìm kiếm sản phẩm
function searchProducts(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword) ||
        p.tags.some(tag => tag.includes(lowerKeyword))
    );
}

// Format giá
function formatPrice(price) {
    return '₩' + price.toLocaleString('ko-KR');
}

// Tính phần trăm giảm giá
function getDiscountPercent(price, oldPrice) {
    if (!oldPrice) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// ==================== CART FUNCTIONS ====================

// Load giỏ hàng từ localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    return cart;
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Thêm vào giỏ hàng
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    return true;
}

// Xóa khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
}

// Cập nhật số lượng
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

// Lấy tổng giá trị giỏ hàng
function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Lấy số lượng sản phẩm trong giỏ
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    cart = [];
    saveCart();
}

// ==================== EXPORT ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        categories,
        brands,
        products,
        reviews,
        getProductById,
        getProductBySlug,
        getProductsByCategory,
        getFeaturedProducts,
        getSaleProducts,
        getNewProducts,
        getCategoryBySlug,
        searchProducts,
        formatPrice,
        getDiscountPercent,
        loadCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartTotal,
        getCartCount,
        clearCart
    };
}