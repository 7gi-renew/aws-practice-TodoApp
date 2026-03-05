import { serve } from "@hono/node-server";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";

const app = new Hono();

const prisma = new PrismaClient();

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const todos: Todo[] = [];

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/", async (c) => {
  return c.text("Hello Hono!");
});

app.get("/todos", async (c) => {
  const todos = await prisma.todo.findMany();
  return c.json({ todos });
});

app.post("/todos", async (c) => {
  const { title } = await c.req.json();
  const todo: Todo = await prisma.todo.create({
    data: {
      title,
      completed: false,
    },
  });

  return c.json({ todo });
});

app.put("/todos/:id", async (c) => {
  const { id } = c.req.param();
  const { completed } = await c.req.json();

  const todo = await prisma.todo.update({
    where: {
      id: Number(id),
    },
    data: {
      completed,
    },
  });

  return c.json({ todo });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
