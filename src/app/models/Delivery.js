import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });

    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipients',
    });

    this.belongsTo(models.Signature, {
      foreignKey: 'signature_id',
      as: 'signatures',
    });
  }

  // static associate(models) {
  //   this.belongsTo(models.Signature, {
  //     foreignKey: 'signature_id',
  //     as: 'signature',
  //   });
  // }
  // static associate(models) {
  //   this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' });
  // }
}

export default Delivery;
