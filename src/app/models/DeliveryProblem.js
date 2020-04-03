import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.Deliveries, {
  //     foreignKey: 'delivery_id',
  //     as: 'problem',
  //   });
  // }
}

console.log('@DeliveryProblem.js - Precisa ajustar o foreignKey');

export default DeliveryProblem;
