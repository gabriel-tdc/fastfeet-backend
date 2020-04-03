import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import Notification from '../schema/Notification';

import CancelationEmail from '../jobs/CancelationEmail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async get(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.id,
      },
    });
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos camposs' });
    }

    const data = {
      delivery_id: req.params.id,
      description: req.body.description,
    };

    console.log(data);

    const deliveryProblem = await DeliveryProblem.create(data);

    return res.json({ deliveryProblem });
  }

  async cancel(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id);

    if (!problem) {
      return res.status(400).json({ error: 'Nenhum problema encontrado.' });
    }

    const { delivery_id } = problem;

    const delivery = await Delivery.findByPk(delivery_id);
    const { product } = delivery;

    if (delivery.canceled_at) {
      // return res.status(400).json({ error: 'Entrega já cancelada.' });
    }

    const now = new Date();

    const { canceled_at } = await delivery.update({
      canceled_at: now,
    });

    // Criar Notificação para o Usuário caso mudar o entregador
    await Notification.create({
      content: `A entrega do produto ${delivery.product} foi cancelada`,
      user: delivery.deliveryman_id,
    });

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);

    await Queue.add(CancelationEmail.key, {
      name: deliveryman.name,
      email: deliveryman.email,
      product,
    });

    return res.json({ canceled_at });
  }
}

export default new DeliveryProblemController();
