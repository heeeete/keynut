import { ObjectId } from 'mongodb';

export interface ProductData {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  category: number;
  condition: number;
  description: string;
  price: number;
  images: {
    name: string;
    width: number;
    height: number;
  }[];
  bookmarked: ObjectId[];
  complain: { openChatUrl: string }[];
  openChatUrl: string;
  tags: string[];
  views: number;
  state: number;
  createdAt: string;
}
