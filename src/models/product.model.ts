export interface Product {
  id: string;
  name: string;
  price: number;
  establishmentId: string;
  type?: "image" | "video";
}
