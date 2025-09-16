export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface Post {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  createdAt: Date;
}
