import Avatar from '../models/Avatar';
import Deliveryman from '../models/Deliveryman';

class AvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatar = await Avatar.create({
      name,
      path,
    });

    const { id } = avatar;

    const deliveryman = await Deliveryman.findByPk(req.body.id);
    deliveryman.update({ avatar_id: id });

    return res.json(avatar);
  }
}

export default new AvatarController();
