import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Deliveryman from '../app/models/Deliveryman';
import Recipient from '../app/models/Recipient';
import Avatar from '../app/models/Avatar';
import Signature from '../app/models/Signature';

import Delivery from '../app/models/Delivery';
import DeliveryProblem from '../app/models/DeliveryProblem';

import databaseConfig from '../config/database';

const models = [
  User,
  Deliveryman,
  Recipient,
  Avatar,
  Signature,
  Delivery,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/fastfeet',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
