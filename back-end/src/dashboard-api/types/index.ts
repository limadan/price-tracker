export interface InsertProductRequest {
  name: string;
  targetPrice: number;
  urls: { url: string; storeId: number }[];
}

export interface UpdateProductRequest {
  name?: string;
  targetPrice?: number;
  urls?: { url: string; storeId: number }[];
}

export interface ProductResponse {
  id: number;
  name: string;
  targetPrice: number;
  lowestPrice?: number;
  urls?: { url: string; storeId: number }[];
}

export interface ReportResponse {
  id: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  date: Date;
  product?: { name: string };
  store?: { name: string };
}

export interface LogResponse {
  id: number;
  message: string;
  severity: string;
  timestamp: Date;
  stack: string;
  route?: string;
  method?: string;
  statusCode?: number;
}
