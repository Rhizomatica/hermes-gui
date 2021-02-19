export interface Message {
  id: number;
  name: string;
  orig: string;
  dest: string;
  text: string;
  file: string;
  image: string;
  audio: string;
  draft: boolean;
  secure: boolean;
  inbox: boolean;
  sent_at: string;
  created_at: string;
  updated_at: string;
}
