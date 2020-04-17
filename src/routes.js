import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import DeliverymanController from './app/controllers/DeliverymanController';
import RecipientController from './app/controllers/RecipientController';
import OrderController from './app/controllers/OrderController';
import AvatarController from './app/controllers/AvatarController';

import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Deliveries User
routes.get('/deliveryman/:id/deliveries', OrderController.index);
routes.put(
  '/delivery/:id/status',
  upload.single('file'),
  OrderController.update
);

// Problemas nas Entregas
routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.get);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.cancel);

routes.get('/deliveryman/:id', DeliverymanController.get);
routes.get('/delivery/:id', DeliveryController.get);

// Usuários devem estar autenticados
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Deliveryman routes
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
routes.post('/avatar', upload.single('file'), AvatarController.store);

// Recipients routes
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.get);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Deliveries Admin
routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

export default routes;
