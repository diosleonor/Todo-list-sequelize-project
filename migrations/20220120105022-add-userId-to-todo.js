'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos', 'UserId', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model:'Users',
        key: 'id'}
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'UserId');
  }
};
