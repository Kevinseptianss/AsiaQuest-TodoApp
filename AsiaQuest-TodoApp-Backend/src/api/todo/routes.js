const routes = (handler) => [
  {
    method: 'POST',
    path: '/todo',
    handler: handler.postTodoHandler,
    options: {
      auth: 'todo_app',
    },
  },
  {
    method: 'GET',
    path: '/todo',
    handler: handler.getTodoHandler,
    options: {
      auth: 'todo_app',
    },
  },
  {
    method: 'PUT',
    path: '/todo/{id}',
    handler: handler.putTodoByIdHandler,
    options: {
      auth: 'todo_app',
    },
  },
  {
    method: 'DELETE',
    path: '/todo/{id}',
    handler: handler.deleteTodoByIdHandler,
    options: {
      auth: 'todo_app',
    },
  },
];

module.exports = routes;
