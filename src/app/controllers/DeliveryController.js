import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Notification from '../schema/Notification';

import NotificationEmail from '../jobs/NotificationEmail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      // attributes: ['id', 'name', 'email', 'avatar_id']
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Delivery.create(
      req.body
    );

    // Criar Notificação para o Usuário
    await Notification.create({
      content: `Uma nova entrega (${product}) foi designada para você`,
      user: deliveryman_id,
    });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    await Queue.add(NotificationEmail.key, {
      name: deliveryman.name,
      email: deliveryman.email,
      product,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    const deliveryman_id_new = req.body.deliveryman_id;

    if (!delivery) {
      return res.status(400).json({ message: 'Entrega não localizada' });
    }

    // Criar Notificação para o Usuário caso mudar o entregador
    if (delivery.deliveryman_id !== deliveryman_id_new) {
      await Notification.create({
        content: `A entrega (${delivery.product}) foi removida da sua listagem`,
        user: delivery.deliveryman_id,
      });

      await Notification.create({
        content: `Uma nova entrega (${delivery.product}) foi designada para você`,
        user: deliveryman_id_new,
      });
    }

    const { recipient_id, deliveryman_id, product } = await delivery.update(
      req.body
    );

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.destroy({
      where: {
        id,
      },
    });

    const message = delivery
      ? 'Entrega apagada com sucesso.'
      : 'Entrega não localizada.';
    return res.json({ message });
  }
}

export default new DeliveryController();
