import { ClientPurchase } from './ClientPurchase';
export class ProductsSales {
    constructor(
        public productId: string,
        public productName: string,
        public productDescription: string,
        public clients: ClientPurchase[]
    ) { }
}
