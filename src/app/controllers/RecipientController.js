import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipients from '../models/Recipient';

class RecipientDelivery {
  async index(req, res) {
    const search = req.query.q;
    const where = search && {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    };

    const recipients = await Recipients.findAll({
      order: [['id', 'DESC']],
      where,
    });

    return res.json(recipients);
  }

  async get(req, res) {
    const deliveryMan = await Recipients.findOne({
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
      order: [['id', 'DESC']],
      where: {
        id: req.params.id,
      },
    });
    return res.json(deliveryMan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipients.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    const recipient = await Recipients.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ message: 'Destinatário não encontrado' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const recipient = await Recipients.destroy({
      where: {
        id,
      },
    });

    const message = recipient
      ? 'Destinatário apagado com sucesso.'
      : 'Destinatário não localizado.';
    return res.json({ message });
  }
}

export default new RecipientDelivery();
