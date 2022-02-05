export interface IImage {
  png?: string;
  webp?: string;
}

export interface IUser {
  image: IImage;
  username: string;
}

export interface ICommentWithoutReply {
  id: number;
  content: string;
  createdAt: string;
  replyingTo?: IUser['username'] | null;
  score: number;
  user: IUser;
}

export interface IComment extends ICommentWithoutReply {
  replies?: ICommentWithoutReply[];
}

export interface IUpdatedFields {
  content?: string;
  score?: number;
}
