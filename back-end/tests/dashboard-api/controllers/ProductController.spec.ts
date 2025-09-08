import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  Product,
  ProductUrl,
  Store,
  PriceHistory,
} from '../../../src/database/models';
import { ProductController } from '../../../src/dashboard-api/controllers/ProductController';
import { Logger } from '../../../src/utils/Logger';

jest.mock('../../../src/database/models', () => ({
  Product: {
    create: jest.fn(),
    save: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  ProductUrl: {
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
  Store: {
    findAll: jest.fn(),
  },
  PriceHistory: {
    destroy: jest.fn(),
  },
}));

jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockRequest = (query = {}, params = {}, body = {}) =>
  ({
    query,
    params,
    body,
    method: 'TEST',
    path: '/test',
  } as unknown as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('ProductController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  describe('insertProduct', () => {
    const validBodyWithURL = {
      name: 'New Product',
      targetPrice: 99.99,
      urls: [{ storeId: 1, url: 'http://example.com/product' }],
    };

    const validBodyWithoutURL = {
      name: 'New Product',
      targetPrice: 99.99,
    };

    it('should insert a product successfully', async () => {
      req = mockRequest({}, {}, validBodyWithURL);
      (Store.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue([]);

      // Mock the created product to have an ID
      (Product.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...validBodyWithURL,
      });

      await ProductController.insertProduct(req, res);

      expect(Product.create).toHaveBeenCalledWith({
        name: validBodyWithURL.name,
        targetPrice: validBodyWithURL.targetPrice,
      });
      expect(ProductUrl.bulkCreate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product inserted successfully',
        productId: 1,
      });
      expect(Logger.info).toHaveBeenCalledWith(
        `Product inserted: ${validBodyWithURL.name}`
      );

      (Product.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...validBodyWithoutURL,
      });
      await ProductController.insertProduct(req, res);

      expect(Product.create).toHaveBeenCalledWith({
        name: validBodyWithoutURL.name,
        targetPrice: validBodyWithoutURL.targetPrice,
      });
      expect(ProductUrl.bulkCreate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product inserted successfully',
        productId: 1,
      });
      expect(Logger.info).toHaveBeenCalledWith(
        `Product inserted: ${validBodyWithoutURL.name}`
      );
    });

    it('should return 400 if name or URLs are missing', async () => {
      req = mockRequest({}, {}, { targetPrice: 100 });
      await ProductController.insertProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name and URLs are required',
      });
    });

    it('should return 400 if more than 5 URLs are provided', async () => {
      const urls = Array(6).fill({
        storeId: 1,
        url: 'http://a.com',
      });
      req = mockRequest({}, {}, { name: 'Too many URLs', urls });
      await ProductController.insertProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'A maximum of 5 URLs can be provided per product',
      });
    });

    it('should return 400 if a store does not exist', async () => {
      req = mockRequest({}, {}, validBodyWithURL);
      (Store.findAll as jest.Mock).mockResolvedValue([]);
      await ProductController.insertProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'One or more stores do not exist',
      });
    });

    it('should return 400 if the product limit is reached', async () => {
      req = mockRequest({}, {}, validBodyWithURL);
      (Store.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(Array(15));
      await ProductController.insertProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          'The maximum number of products (15) has been reached. Please delete some products before adding new ones.',
      });
    });

    it('should handle internal server errors', async () => {
      req = mockRequest({}, {}, validBodyWithURL);
      const error = new Error('DB error');
      (Store.findAll as jest.Mock).mockRejectedValue(error);
      await ProductController.insertProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      req = mockRequest({}, { id: '1' });
      const mockProduct = { id: 1, destroy: jest.fn() };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue([{ id: 10 }]);

      await ProductController.deleteProduct(req, res);

      expect(PriceHistory.destroy).toHaveBeenCalledWith({
        where: { productUrlId: { [Op.in]: [10] } },
      });
      expect(ProductUrl.destroy).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product deleted successfully',
      });
      expect(Logger.info).toHaveBeenCalledWith('Product deleted: 1');
    });

    it('should return 400 for an invalid product ID', async () => {
      req = mockRequest({}, { id: 'abc' });
      await ProductController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid product ID' });
    });

    it('should return 404 if the product is not found', async () => {
      req = mockRequest({}, { id: '999' });
      (Product.findByPk as jest.Mock).mockResolvedValue(null);
      await ProductController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle internal server errors', async () => {
      req = mockRequest({}, { id: '1' });
      const error = new Error('DB error');
      (Product.findByPk as jest.Mock).mockRejectedValue(error);
      await ProductController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('updateProduct', () => {
    const updateBodyWithURL = {
      name: 'Updated Product',
      targetPrice: 150,
      urls: [{ storeId: 1, url: 'http://new.url' }],
    };

    const updateBodyWithoutURL = {
      name: 'Updated Product',
      targetPrice: 150,
    };

    it.each([
      {
        description: 'with URLs',
        body: updateBodyWithURL,
        shouldCallBulkCreate: true,
      },
      {
        description: 'without URLs',
        body: updateBodyWithoutURL,
        shouldCallBulkCreate: false,
      },
    ])(
      'should update a product successfully $description',
      async ({ body, shouldCallBulkCreate }) => {
        const req = mockRequest({}, { id: '1' }, body);
        const res = mockResponse();

        (Product.findByPk as jest.Mock).mockResolvedValue({
          save: jest.fn(),
        });
        (Store.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);

        await ProductController.updateProduct(req, res);

        if (shouldCallBulkCreate) {
          expect(ProductUrl.bulkCreate).toHaveBeenCalled();
        } else {
          expect(ProductUrl.bulkCreate).not.toHaveBeenCalled();
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Product updated successfully',
        });
        expect(Logger.info).toHaveBeenCalledWith(`Product updated: 1`);
      }
    );

    it('should return 404 if product not found', async () => {
      req = mockRequest({}, { id: '999' }, updateBodyWithURL);
      (Product.findByPk as jest.Mock).mockResolvedValue(null);
      await ProductController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle internal server errors', async () => {
      req = mockRequest({}, { id: '1' }, updateBodyWithURL);
      const error = new Error('DB error');
      (Product.findByPk as jest.Mock).mockRejectedValue(error);
      await ProductController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('getProducts', () => {
    it('should retrieve all products and calculate lowest price', async () => {
      req = mockRequest();
      const mockProducts = [
        {
          id: 1,
          name: 'Product A',
          targetPrice: 100,
          productUrls: [
            {
              priceHistories: [{ price: 95.5 }, { price: 98.0 }],
            },
          ],
        },
        {
          id: 2,
          name: 'Product B',
          targetPrice: 200,
          productUrls: [],
        },
      ];
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      await ProductController.getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: 'Product A',
          targetPrice: 100,
          lowestPrice: 95.5,
        },
        {
          id: 2,
          name: 'Product B',
          targetPrice: 200,
          lowestPrice: undefined,
        },
      ]);
    });

    it('should handle internal server errors', async () => {
      req = mockRequest();
      const error = new Error('DB error');
      (Product.findAll as jest.Mock).mockRejectedValue(error);
      await ProductController.getProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
