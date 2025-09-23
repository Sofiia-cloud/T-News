export interface User {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  bio?: string;
}

export interface Post {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  imageUrl?: string;
  createdAt: Date;
  likes: string[];
  likesCount: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
}
