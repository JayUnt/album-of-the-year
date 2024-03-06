//https://github.com/TheB1gFatPanda/fastify-typescript-starter/blob/main/src/app.ts

import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { initializeRoutes } from "./routes";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.register(initializeRoutes);

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
