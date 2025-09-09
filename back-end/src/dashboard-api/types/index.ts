/**
 * @swagger
 * components:
 *   schemas:
 *     ProductUrlInput:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: uri
 *           description: The URL of the product on the store's website.
 *         storeId:
 *           type: integer
 *           description: The ID of the store.
 *       required:
 *         - url
 *         - storeId
 *
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The store ID.
 *         name:
 *           type: string
 *           description: The name of the store.
 *
 *     ProductInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *
 *     StoreInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the store.
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     InsertProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         targetPrice:
 *           type: number
 *         urls:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUrlInput'
 *
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         targetPrice:
 *           type: number
 *         urls:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUrlInput'
 */

export interface ProductResponse {
  id: number;
  name: string;
  targetPrice: number;
  lowestPrice?: number;
  urls?: { url: string; storeId: number }[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         targetPrice:
 *           type: number
 *         lowestPrice:
 *           type: number
 *         urls:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUrlInput'
 *
 */

export interface ReportResponse {
  id: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  date: Date;
  product?: { name: string };
  store?: { name: string };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         productId:
 *           type: integer
 *         storeId:
 *           type: integer
 *         averagePrice:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *         product:
 *           $ref: '#/components/schemas/ProductInfo'
 *         store:
 *           $ref: '#/components/schemas/StoreInfo'
 *
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     LogResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         message:
 *           type: string
 *         severity:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         stack:
 *           type: string
 *         route:
 *           type: string
 *         method:
 *           type: string
 *         statusCode:
 *           type: integer
 */
