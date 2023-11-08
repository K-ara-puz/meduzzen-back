export interface generalResponse<T> {
  status_code: number;
  detail: T;
  result: string;
}
