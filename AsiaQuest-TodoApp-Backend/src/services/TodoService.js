/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class TodoService {
  constructor() {
    this._pool = new Pool();
  }

  async addTodo({ title }) {
    const taskOrder = await this.getTaskOrder();
    const query = {
      text: "INSERT INTO todoapp (title, checked, task_order) VALUES($1, $2, $3) RETURNING id",
      values: [title, false, taskOrder],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getTaskOrder() {
    const query = {
      text: "SELECT id FROM todoapp",
    };
    const result = await this._pool.query(query);
    return result.rows.length + 1;
  }

  async getTodo() {
    const result = await this._pool.query(
      "SELECT * FROM todoapp ORDER BY task_order"
    );
    return result.rows;
  }

  async editTodo(id, { title, checked, task_order }) {
    const query = {
      text: "UPDATE todoapp SET title = $1, checked = $2, task_order = $3 WHERE id = $4 RETURNING id",
      values: [title, checked, task_order, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui todo list. Id tidak ditemukan"
      );
    }
  }

  async deleteTodoById(id) {
    const query = {
      text: "DELETE FROM todoapp WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Todo list gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = TodoService;
