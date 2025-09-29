export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: RazorpayOrdersResponse | p | object | null | string;
  errors: string[];
}

