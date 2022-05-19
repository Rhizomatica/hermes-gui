import { GlobalConstants } from '../global-constants';

interface Scripts {
  name: string;
  src: string;
}  
export const Script: Scripts[] = [
  {name: 'uhrr', src: GlobalConstants.radioRemoteUrl + "/www/controls.js"},
];

