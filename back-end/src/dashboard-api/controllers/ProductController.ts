import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  Product,
  ProductUrl,
  Store,
  PriceHistory,
} from '../../database/models';
import {
  InsertProductRequest,
  UpdateProductRequest,
  ProductResponse,
} from '../types';
import { Logger } from '../../utils/Logger';

export class ProductController {
  static async insertProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, targetPrice, urls }: InsertProductRequest = req.body;

      if (!name || !urls || urls.length === 0) {
        res.status(400).json({ error: 'Name and URLs are required' });
        return;
      }

      if (urls.length > 5) {
        res
          .status(400)
          .json({ error: 'A maximum of 5 URLs can be provided per product' });
        return;
      }

      const storeIds = [...new Set(urls.map((u) => u.storeId))];
      const stores = await Store.findAll({ where: { id: storeIds } });

      if (stores.length !== storeIds.length) {
        res.status(400).json({ error: 'One or more stores do not exist' });
        return;
      }

      const allProducts = await ProductUrl.findAll();

      if (allProducts.length === 15) {
        res.status(400).json({
          error:
            'The maximum number of products (15) has been reached. Please delete some products before adding new ones.',
        });
        return;
      }

      const product = await Product.create({ name, targetPrice });

      const productUrls = urls.map((u) => ({
        productId: product.id!,
        storeId: u.storeId,
        url: u.url,
      }));
      await ProductUrl.bulkCreate(productUrls);

      Logger.info(`Product inserted: ${name}`);

      res.status(201).json({
        message: 'Product inserted successfully',
        productId: product.id,
      });
    } catch (error) {
      Logger.error(
        'Error inserting product',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const urls = await ProductUrl.findAll({
        where: { productId },
        attributes: ['id'],
      });
      const urlIds = urls.map((u) => u.id);
      await PriceHistory.destroy({
        where: {
          productUrlId: { [Op.in]: urlIds },
        },
      });
      await ProductUrl.destroy({ where: { productId } });
      await product.destroy();

      Logger.info(`Product deleted: ${productId}`);

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      Logger.error(
        'Error deleting product',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, targetPrice, urls }: UpdateProductRequest = req.body;

      const productId = parseInt(id);
      if (isNaN(productId)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      if (name !== undefined) product.name = name;
      if (targetPrice !== undefined) product.targetPrice = targetPrice;
      await product.save();

      if (!urls) {
        Logger.info(`Product updated: ${productId}`);
        res.status(200).json({ message: 'Product updated successfully' });
        return;
      }

      if (urls.length >= 5) {
        res.status(400).json({ error: 'At least one URL is required' });
        return;
      }
      const storeIds = [...new Set(urls.map((u) => u.storeId))];
      const stores = await Store.findAll({ where: { id: storeIds } });

      if (stores.length !== storeIds.length) {
        res.status(400).json({ error: 'One or more stores do not exist' });
        return;
      }

      await ProductUrl.destroy({ where: { productId } });

      const productUrls = urls.map((u) => ({
        productId,
        storeId: u.storeId,
        url: u.url,
      }));
      await ProductUrl.bulkCreate(productUrls);

      Logger.info(`Product updated: ${productId}`);

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      Logger.error(
        'Error updating product',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: ProductUrl,
            as: 'productUrls',
            include: [
              {
                model: PriceHistory,
                as: 'priceHistories',
              },
            ],
          },
        ],
      });

      const response: ProductResponse[] = products.map((p) => {
        let lowestPrice: number | undefined;
        if (p.productUrls) {
          const prices: number[] = [];
          p.productUrls.forEach((pu: any) => {
            if (pu.priceHistories) {
              pu.priceHistories.forEach((ph: any) =>
                prices.push(parseFloat(ph.price.toString()))
              );
            }
          });
          if (prices.length > 0) {
            lowestPrice = Math.min(...prices);
          }
        }

        return {
          id: p.id!,
          name: p.name,
          targetPrice: p.targetPrice || 0,
          lowestPrice,
        };
      });

      res.json(response);
    } catch (error) {
      Logger.error(
        'Error retrieving products',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
