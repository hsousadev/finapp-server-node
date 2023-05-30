import express from "express";
import { prisma } from "../lib/prisma.mjs";

import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";

const router = express.Router();

// Retorna o extrato geral de todas as contas
router.get("/statement/all", async (request, response) => {
  const statements = await prisma.statements.findMany({
    include: {
      Account: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return response.json(statements);
});

// Verificar todo o extrato de uma conta
router.get("/statement", accountAlreadyExists, async (request, response) => {
  const { account } = request;

  const statements = await prisma.statements.findMany({
    where: { accountId: account.id },
  });

  return response.json(statements);
});

router.get(
  "/statement/date",
  accountAlreadyExists,
  async (request, response) => {
    const { account } = request;
    const { date } = request.query;

    const statements = await prisma.statements.findMany({
      where: { accountId: account.id },
    });

    const statement = statements.filter(
      (statement) =>
        new Date(statement.created_at).toDateString() ===
        new Date(date).toDateString()
    );

    return response.json(statement);
  }
);

// Retorna um único registro de extrato de uma conta
router.get(
  "/statement/:id",
  accountAlreadyExists,
  async (request, response) => {
    const { id } = request.query;

    const statements = await prisma.statements.findUnique({
      where: {
        id: id,
      },
      include: {
        Account: true,
      },
    });

    return response.json(statements);
  }
);

// Deleta um único registro de extrato de uma conta
router.delete(
  "/statement/:id",
  accountAlreadyExists,
  async (request, response) => {
    const { id } = request.query;

    const statements = await prisma.statements.delete({
      where: {
        id: id,
      },
      include: {
        Account: true,
      },
    });

    return response.json(statements);
  }
);

// Pesquisar registros em uma data no extrato GERAL
router.get("/statement/date/all", async (request, response) => {
  const { date } = request.query;

  const statements = await prisma.statements.findMany({
    where: {
      created_at: date,
    },
  });

  return response.json(statements);
});

export default router;
