import type { WardrobeProduct } from "@/components/sections/accounts/WardrobeProductCard";
import type { PastBox } from "@/components/sections/accounts/PastBoxesContent";

const IMG = "/images/individual_Collectionlanding/image 814.png";

export const mockWardrobeProducts: WardrobeProduct[] = [
  { id: "w1", image: IMG, brand: "ZIMMERMANN", productName: "Luminosity Linen Dress" },
  { id: "w2", image: IMG, brand: "ANITA DONGRE", productName: "Garden Story Kurta Set" },
  { id: "w3", image: IMG, brand: "LABEL RITU KUMAR", productName: "Embroidered Silk Blouse" },
  { id: "w4", image: IMG, brand: "SABYASACHI", productName: "Bengal Heritage Saree" },
];

export const mockPastBoxes: PastBox[] = [
  {
    id: "b1",
    date: "April 15, 2026",
    orderNumber: "Order #SS2345",
    products: [
      { id: "b1p1", image: IMG, brand: "ZIMMERMANN", productName: "Luminosity Linen Dress", kept: true },
      { id: "b1p2", image: IMG, brand: "ANITA DONGRE", productName: "Garden Story Kurta Set", kept: false },
      { id: "b1p3", image: IMG, brand: "LABEL RITU KUMAR", productName: "Embroidered Silk Blouse", kept: false },
      { id: "b1p4", image: IMG, brand: "SABYASACHI", productName: "Bengal Heritage Saree", kept: true },
      { id: "b1p5", image: IMG, brand: "MANISH MALHOTRA", productName: "Sequin Evening Gown", kept: false },
    ],
  },
  {
    id: "b2",
    date: "March 10, 2026",
    orderNumber: "Order #SS2344",
    products: [
      { id: "b2p1", image: IMG, brand: "TARUN TAHILIANI", productName: "Chiffon Drape Gown", kept: false },
      { id: "b2p2", image: IMG, brand: "ROHIT BAL", productName: "Floral Anarkali Set", kept: true },
      { id: "b2p3", image: IMG, brand: "RITU KUMAR", productName: "Mirror Work Lehenga", kept: false },
      { id: "b2p4", image: IMG, brand: "GAURAV GUPTA", productName: "Structured Draped Top", kept: false },
      { id: "b2p5", image: IMG, brand: "ANAMIKA KHANNA", productName: "Indigo Print Co-ord Set", kept: true },
    ],
  },
];

export const mockReviews = [
  {
    id: "r1",
    brand: "ZIMMERMANN",
    productName: "Luminosity Linen Dress",
    productImage: IMG,
    rating: 5,
    tags: "Perfect fit · Loved the fabric · Would rent again",
    reviewText:
      "Absolutely stunning dress — the linen drapes beautifully and the fit was true to size. Got so many compliments at the event. Will definitely be renting this again.",
    photos: [IMG, IMG],
  },
  {
    id: "r2",
    brand: "SABYASACHI",
    productName: "Bengal Heritage Saree",
    productImage: IMG,
    rating: 4,
    tags: "Rich fabric · Great condition · Arrived on time",
    reviewText:
      "The saree was in excellent condition and the fabric quality is outstanding. Slight delay in delivery but the Style Supply team sorted it quickly. Very happy overall.",
    photos: [IMG],
  },
];
