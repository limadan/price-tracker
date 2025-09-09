import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';

const router = Router();

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Retrieve a list of stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: A list of stores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *   post:
 *     summary: Add a new store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 */

// GET /api/stores
router.get('/', StoreController.getStores);

// POST /api/stores
router.post('/', StoreController.addStore);

export { router as storeRoutes };
