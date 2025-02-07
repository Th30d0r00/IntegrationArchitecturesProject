export interface ProductSalesDatapoint {
    productId: string;
    productName: string;
    productDescription: string;
    clients: ClientPurchase[];
}

export interface ClientPurchase {
    customerName: string;
    rating: string;
    quantity: number;
    bonus: number;
}
