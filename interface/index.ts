export interface IProduct {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
