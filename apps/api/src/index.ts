//https://github.com/TheB1gFatPanda/fastify-typescript-starter/blob/main/src/app.ts

import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { initializeRoutes } from "./routes";


const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}
const server = fastify({
  // logger: envToLogger[environment] ?? true // defaults to true if no entry matches in the map
  logger: {
    level: 'warn',
    transport: {
      target: 'pino-pretty'
    },
  }
}).withTypeProvider<TypeBoxTypeProvider>();


// server.register(require('@fastify/postgres'), {
//   connectionString: 'postgres://postgres@localhost/postgres'
// })

server.register(require('fastify-sqlite'), {
  dbFile: './dev.db'
})



server.register(initializeRoutes);

server.get("/ping", async (request, reply) => {
  return "pong\n";
});


// server.get("/albums", async (request, reply) => {
//   return "pong\n";
// });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    // process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
