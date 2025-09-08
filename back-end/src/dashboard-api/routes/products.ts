import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();

// POST /api/products - Insert new product
router.post('/', ProductController.insertProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', ProductController.deleteProduct);

// PUT /api/products/:id - Update product
router.put('/:id', ProductController.updateProduct);

// GET /api/products - Get all products
router.get('/', ProductController.getProducts);

export { router as productRoutes };
