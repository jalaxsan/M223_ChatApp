import { Timestamp } from '@angular/fire/firestore';
import { ProfileUser } from './user-profile';

// Chat model
export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate?: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];
  chatPic?: string;
  chatName?: string;
}

// Message model
export interface Message {
  text: string;
  senderId: string;
  sentDate: Date & Timestamp;
}
