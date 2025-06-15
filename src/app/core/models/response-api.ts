export interface APIResponse<T = object> {
  date: Date;
  status: boolean;
  detail: string;
  data: T;
}
