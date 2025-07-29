const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    first_name: {
      type: 'varchar',
      length: 100,
    },
    last_name: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      unique: true,
      length: 255,
    },
    username: {
      type: 'varchar',
      unique: true,
      length: 255,
    },
    password: {
      type: 'varchar',
      length: 255,
    },
    refresh_token: {
      type: 'text',
      nullable: true,
    },
    level: {
      type: 'enum',
      enum: ['0', '1', '2', '3'], 
      default: '0',
    },
    token_version: {
      type: 'int',
      default: 0,
    },
  },
});
