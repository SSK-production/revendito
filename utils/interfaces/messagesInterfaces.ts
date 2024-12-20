export interface messaging {
  id: Int32Array;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
  read: boolean;
}
