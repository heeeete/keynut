export interface ProductData {
  _id: string;
  userId: string;
  title: string;
  category: number;
  condition: 1 | 2 | 3 | 4 | 5;
  description: string;
  price: number;
  images: {
    name: string;
    width: number;
    height: number;
  }[];
  bookmarked: string[];
  complain: { category: string; text: string }[];
  openChatUrl: string;
  tags: string[];
  views: number;
  state: number;
  createdAt: string;
}
