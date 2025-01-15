/* eslint-disable no-underscore-dangle */
class TodoHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postTodoHandler = this.postTodoHandler.bind(this);
    this.getTodoHandler = this.getTodoHandler.bind(this);
    this.putTodoByIdHandler = this.putTodoByIdHandler.bind(this);
    this.deleteTodoByIdHandler = this.deleteTodoByIdHandler.bind(this);
  }

  async postTodoHandler(request, h) {
    this._validator.validateTodoPayload(request.payload);
    const { title } = request.payload;

    const todoId = await this._service.addTodo({ title });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        todoId,
      },
    });
    response.code(201);
    return response;
  }

  async getTodoHandler() {
    const todos = await this._service.getTodo();
    return {
      status: 'success',
      data: {
        todos,
      },
    };
  }

  async putTodoByIdHandler(request) {
    const { id } = request.params;

    await this._service.editTodo(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteTodoByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteTodoById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = TodoHandler;
