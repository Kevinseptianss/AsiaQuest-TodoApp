// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();

const Jwt = require("@hapi/jwt");

const Hapi = require("@hapi/hapi");
const ClientError = require("./exceptions/ClientError");

//Todo
const todo = require("./api/todo");
const TodoService = require("./services/TodoService");
const TodoValidator = require("./validator");

//Users
const users = require("./api/users");
const UsersServices = require("./services/UsersServices");
const UserValidator = require("./validator/users");

//authentications
const authentications = require("./api/authentications");
const AuthenticationsServices = require("./services/AuthenticationsServices");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
  const todoService = new TodoService();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("todo_app", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: todo,
      options: {
        service: todoService,
        validator: TodoValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
