import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

class OrderController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        // end_date: null,
      },
    });
    return res.json(delivery);
  }

  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (req.file) {
      const { originalname: name, filename: path } = req.file;

      const signature = await Signature.create({
        name,
        path,
      });

      console.log(signature);
      // Salvar a signature ID
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
      },
    });

    if (deliveryOfDay >= 5) {
      return res
        .status(400)
        .json({ error: 'Número máximo de entregas do dia excedido.' });
    }

    const { canceled_at, start_date, end_date } = await delivery.update(
      req.body
    );

    return res.json({
      canceled_at,
      start_date,
      end_date,
    });
  }
}

export default new OrderController();
