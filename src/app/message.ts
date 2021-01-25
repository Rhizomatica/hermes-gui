export interface Message {
  id: number;
  name: string;
  orig: string;
  dest: string;
  text: string;
  file: string;
  draft: boolean;
  //crypt: boolean;
  sent_at: string;

}
