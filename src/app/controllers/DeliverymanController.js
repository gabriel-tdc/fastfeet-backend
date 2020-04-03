import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Avatar from '../models/Avatar';

class DeliverymanController {
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

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: [['id', 'DESC']],
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      where,
    });

    return res.json(deliverymans);
  }

  async get(req, res) {
    const deliveryMan = await Deliveryman.findOne({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: [['id', 'DESC']],
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
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
      email: Yup.string()
        .required()
        .email()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    // Validar se o e-mail já está cadastrado
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
      // email: Yup.string().required().email().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Erro no preenchimento dos campos' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se digitou email, e se o email é diferente do que já foi cadastrado
    let { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });

      // Validar se o e-mail já está cadastrado
      if (deliverymanExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }
    } else {
      email = deliveryman.email;
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.destroy({
      where: {
        id,
      },
    });

    const message = deliveryman
      ? 'Entregador apagado com sucesso.'
      : 'Entregador não localizado.';
    return res.json({ message });
  }
}

export default new DeliverymanController();
