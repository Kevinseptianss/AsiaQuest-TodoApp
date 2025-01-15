/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('todoapp', {
      id: {
        type: 'SERIAL',
        primaryKey: true,
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      checked: {
        type: 'BOOLEAN',
        notNull: true,
      },
      task_order: {
        type: 'INT',
        notNull: true,
      }
    });

    pgm.createTable('users', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.createTable('authentications', {
        token: {
            type: 'TEXT',
            notNull: true,
        },
    });
  };
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('todoapp');
    pgm.dropTable('users');
    pgm.dropTable('authentications');
};
