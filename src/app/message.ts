export interface Message {
  id: number;
  name: string;
  orig: string;
  dest: number;
  text: string;
  draft: boolean;
  sent_at: boolean;
}
