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
    pgm.createTable("jobs", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        title: {
            type: "TEXT",
            notNull: true,
        },
        description: {
            type: "TEXT",
        },
        company_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "companies(id)",
            onDelete: "CASCADE",
        },
        category_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "categories(id)",
            onDelete: "CASCADE",
        },
        created_at: {
            type: "TIMESTAMP",
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};
exports.down = (pgm) => {};
