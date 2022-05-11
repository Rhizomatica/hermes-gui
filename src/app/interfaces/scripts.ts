interface Scripts {
  name: string;
  src: string;
}  
export const ScriptStore: Scripts[] = [
  {name: 'utils', src: '../components/utils/utils.ts'}
];

// https://stackoverflow.com/questions/34489916/how-to-load-external-scripts-dynamically-in-angular