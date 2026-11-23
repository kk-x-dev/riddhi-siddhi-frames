export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes?: string[];
  price?: string;
  material?: string;
  inStock?: boolean;
}

export interface OrderFormData {
  customerName: string;
  mobile: string;
  selectedFrame: string;
  frameSize: string;
  quantity: number;
  cityPincode: string;
  address: string;
  notes: string;
}
