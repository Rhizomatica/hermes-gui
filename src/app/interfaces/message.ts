export interface Message {
  id: number;
  name: string;
  orig: string;
  dest: any;
  text: string;
  file: string;
  fileid: string;
  mimetype: string;
  draft: boolean;
  secure: boolean;
  inbox: boolean;
  sent_at: string;
  created_at: string;
  updated_at: string;
}
