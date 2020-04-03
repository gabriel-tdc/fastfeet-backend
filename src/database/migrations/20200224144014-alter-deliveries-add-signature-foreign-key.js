module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'signature_id', {
      type: Sequelize.INTEGER,
      references: { model: 'signatures', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'signature_id', {
      type: Sequelize.INTEGER,
    });
  },
};
