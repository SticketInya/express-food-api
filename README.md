# backend-node-task

Please use typescript, we included linting, typescript config and types to use in this project.

You can start the project with `yarn start:dev`.
You can check the lint and formatting of the project with `yarn lint`.

If you are using VSCode you can use these extensions:
- https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## Task 1 - The server

For the web serving part you could use either 
- [Koa](https://koajs.com/)
- [Express](https://expressjs.com/)
- [Fastify](https://www.fastify.io/)

Server should be getting its port from environment variable `PORT`, otherwise it should be served on port `3000`

## Task 2 - Request logging

Please include a middleware for logging or set it up if included within the frameworks to log all requests
- https://github.com/koajs/logger
- https://github.com/expressjs/morgan
- https://www.fastify.io/docs/latest/Reference/Logging/


## Task 3 - CRUD

Following endpoints shall be created (please use the typings as baseline when implementing this functionality, these could be found under `./src/interfaces.ts`):

- list food entries endpoint ( `GET /food` )
- get specific food entry endpoint ( `GET /food/:id` )
- create food entry endpoint ( `POST /food` )
- update food entry endpoint ( `PUT /food/:id` )
- delete food entry endpoint ( `DELETE /food/:id` )

These endpoints should follow the pattern told on the second backend lecture.

On unexpected errors the server should respond with `500` with body:
```json
{
  "error": "internal server error"
}
```
On non-implemented methods / endpoints the server should respond with `404` with body:
```json
{
  "error": "not found"
}
```

Data should be stored in-memory.

## Task 4 - Authentication

Following endpoint shall be created:

- login endpoint ( `POST /login` )

Server should be getting the valid `username` and `password` from `VALID_USERNAME` and `VALID_PASSWORD` environment variables respectively.

accepts `username` and `password` in the body in the following json format:
```json
{
  "username": "thenameoftheuser",
  "password": "password"
}
```
On valid login credentials returns `200` with JWT Token in the body with the following json format:
```json
{
  "token": "thesignedtoken"
}
```
On invalid credentials returns `401`:
```json
{
  "error": "invalid login credential"
}
```

Tips: You can use https://www.npmjs.com/package/jsonwebtoken or https://www.npmjs.com/package/jose to sign tokens

## Task 5 - Authorization
Protect all the endpoints created under [Task 3](#task-3---crud).


Header https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization should contain a valid JWT.
\
Where auth scheme should be `Bearer`.

On invalid, expired or not-provided token server should respond with 401.
\
If the token is valid and verified, the endpoints should work as before.

Tips: You can use authorization middelwares / utility libraries:
 - https://www.npmjs.com/package/express-jwt
 - https://www.npmjs.com/package/koa-jwt
 - https://github.com/fastify/fastify-jwt

## Task 6 - Data persistence (optional)

Until now, data was stored within the memory. This meant, that with each application restart the data has been lost.

Data should be stored in an external database so we don't loose data on server restart. This could be any type of external database of your choice.

Suggestions:
- redis - key-value store (https://www.npmjs.com/package/mongoose, https://www.npmjs.com/package/ioredis)
- mongodb - document db (https://www.npmjs.com/package/mongodb, https://www.npmjs.com/package/mongoose)
- postgresql - sql db (https://www.npmjs.com/package/pg)
