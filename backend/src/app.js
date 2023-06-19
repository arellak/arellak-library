// @ts-nocheck
import path from "node:path";
import crypto from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import {QuickDB} from "quick.db";
import fs from "fs";
// import util from "util";
// import pipeline from "stream";
import pump from "pump";
import {config} from "../config/config.js";

// const pump = util.promisify(pipeline);

const usersDb = new QuickDB({
  filePath: path.resolve("./data/users.sqlite")
});

const fileDb = new QuickDB({
  filePath: path.resolve("./data/files.sqlite")
});

const fastify = Fastify({ logger: true });

await fastify.register(multipart, {
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
    fieldSize: 1024 * 1024 * 500, // 500MB
  }
});
await fastify.register(cors, {
  origin: "*"
});

fastify.route({
  method: "POST",
  url: "/login",
  schema: {
    querystring: {
      email: { type: "string" },
      password: { type: "string" }
  },
  response: {
    200: {
      type: "object",
      properties: {
        session: { type: "string" },
        message: { type: "string" }
      }
    }
  }
},
  handler: async (request, reply) => {
    const email = request.body?.email;
    const password = request.body?.password;

    if(!email || !password) {
      return reply.code(400).send({ message: "Missing email or password" });
    }
    else{
      const user = await usersDb.get(`users.${email}`);
      if(!user) {
        return reply.code(400).send({ message: "User not found" });
      }
      else{
        if(user.password !== password) {
          return reply.code(400).send({ message: "Invalid password" });
        }
        else{
          return reply.code(200).send({ message: "Logged in", session: user.session });
        }
      }
    }
  }
});

fastify.route({
  method: "POST",
  url: "/register",
  schema: {
    querystring: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        session: { type: "string" }
      }
    }
  }
},
  handler: async (request, reply) => {
    if(config.server.register === false) {
      return reply.code(403).send({ message: "Register is disabled" });
    }
    else{
      const name = request.body?.name;
      const email = request.body?.email;
      const password = request.body?.password;

      if(!email || !password || !name) {
        return reply.code(400).send({ message: "Missing name, email or password" });
      }
      else{
        const session = crypto.randomBytes(64).toString("hex");
        const user = await usersDb.get(`users.${email}`);
        if(user) {
          return reply.code(400).send({ message: "User already exists" });
        }
        else{
          await usersDb.set(`users.${email}`, { email: email, password: password, name: name, createdAt: Date.now(), session: session });
          await usersDb.push(`users.validSessions`, { session: session });
          return reply.code(200).send({ message: "User created" , session: session });
        }
      }
    }
  }
});

fastify.route({
  method: "POST",
  url: "/validateSession",
  schema: {
    querystring: {
      session: { type: "string" }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        statusCode: { type: "number" }
      }
    }
  }
},
  handler: async (request, reply) => {
    const session = request.body?.session;

    if(!session) {
      return reply.code(400).send({ message: "Missing session token" });
    }
    else{
      const user = await usersDb.get(`users.validSessions`).then((sessions) => {
        return sessions.find((sessionObject) => sessionObject.session === session);
      });
      if(!user) {
        return reply.code(400).send({ message: "User not found", statusCode: 400 });
      }
      else{
        if(user.session !== session) {
          return reply.code(400).send({ message: "Invalid session", statusCode: 400 });
        }
        else{
          return reply.code(200).send({ message: "Session valid", statusCode: 200 });
        }
      }
    }
  }
});

fastify.post("/fileUpload", async (request, reply) => {
  const parts = request.parts();
  const id = crypto.randomBytes(16).toString("hex");
  for await (const part of parts){
    if(part.type === "file"){
      pump(part.file, fs.createWriteStream(path.resolve(`./data/user/${part.filename}`)));
      fileDb.push(
        "uploads.media." + request.query?.session,
        {
          id: id,
          name: part.filename,
          createdAt: Date.now(),
          path: path.resolve(`./data/user/${part.filename}`)
        }
      );
    }
  }

  return reply.code(200).send({ message: "File uploaded", statusCode: 200, id: id });
});

fastify.route({
  method: "POST",
  url: "/getFiles",
  schema: {
    querystring: {
      session: { type: "string" }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        files: { type: "array" }
      }
    }
  }
},
  handler: async (request, reply) => {
    const session = request.body?.session;
    // check if session is valid
    const user = await usersDb.get(`users.validSessions`).then((sessions) => {
      return sessions.find((sessionObject) => sessionObject.session === session);
    });
    
    if(!user) {
      return reply.code(400).send({ message: "User/Session not found", statusCode: 400 });
    }
  }
});


const start = async () => {
  try {
    await fastify.listen({ port: config.server.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
