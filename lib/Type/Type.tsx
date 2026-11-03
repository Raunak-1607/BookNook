export interface BookType {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  image: string;
  description: string;
  userName: string;
  email: string;
  createdAt?: string | Date;
}
