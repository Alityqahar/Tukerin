export type Product = {
    id: string | number;
    title: string;
    description: string;
    price: number;
    image: string;
    seller: string;
    stock: number;
    trendingBadge?: string;
    category: string; 
    trending?: boolean; 
};

// CartItem extends Product with quantity
export type CartItem = Product & { quantity: number };