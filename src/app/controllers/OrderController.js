import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Signature from '../models/Signature';

class OrderController {
  async index(req, res) {
    const { delivered } = req.query;

    const where =
      delivered === 'true'
        ? {
            deliveryman_id: req.params.id,
            canceled_at: null,
            end_date: {
              [Op.ne]: null,
            },
          }
        : {
            deliveryman_id: req.params.id,
            canceled_at: null,
            end_date: null,
          };

    const delivery = await Delivery.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipients',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
      ],
      where,
    });
    return res.json(delivery);
  }

  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    let signature_id = null;

    if (req.file) {
      const { originalname: name, filename: path } = req.file;

      const { id } = await Signature.create({
        name,
        path,
      });

      signature_id = id;
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não localizada.' });
    }

    // Limite de 5 entregas por dia
    const day = parseISO(req.body.start_date);

    const deliveryOfDay = await Delivery.count({
      where: {
        start_date: {
          [Op.between]: [startOfDay(day), endOfDay(day)],
        },
        deliveryman_id: delivery.deliveryman_id,
      },
    });

    if (deliveryOfDay >= 5) {
      return res
        .status(400)
        .json({ error: 'Número máximo de entregas do dia excedido.' });
    }

    const { start_date, end_date } = req.body;

    const updatedDelivery = await delivery.update({
      start_date,
      end_date,
      signature_id,
    });

    return res.json(updatedDelivery);
  }
}

export default new OrderController();
