export interface CustomError {
  controller: string;
  error_code: number;
  error_message: string;
  stacktrace: string;
  station: string;
  created_at: Date;
}
