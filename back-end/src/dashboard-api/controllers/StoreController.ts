import { Store } from '../../database/models';
import { Logger } from '../../utils/Logger';
import { Request, Response } from 'express';

export class StoreController {
  static async getStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await Store.findAll();
      res.json(stores);
    } catch (error) {
      Logger.error(
        'Error retrieving stores',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  static async addStore(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Store name is required' });
        return;
      }
      const existingStore = await Store.findOne({ where: { name } });
      if (existingStore) {
        res.status(400).json({ error: 'Store with this name already exists' });
        return;
      }
      const newStore = await Store.create({ name });
      Logger.info(`Store added: ${name}`);
      res.status(201).json(newStore);
    } catch (error) {
      Logger.error(
        'Error adding store',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
}
