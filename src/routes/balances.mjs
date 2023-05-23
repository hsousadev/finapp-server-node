import express from "express";
import getBalance from "../middlewares/getBalance.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";

import { prisma } from "../lib/prisma.mjs";

const router = express.Router();

// Retorna o valor total de uma conta
router.get("/balance", accountAlreadyExists, async (request, response) => {
  const { account } = request;
  const statements = await prisma.statements.findMany({
    where: { accountId: account.id },
  });

  const balance = getBalance(statements);

  return response.json(balance);
});

// Retorna valor total (somando o balanço de todas as contas)
router.get("/balance/all", async (request, response) => {
  const statements = await prisma.statements.findMany();

  if (statements.length > 0) {
    const balance = getBalance(statements);
    return response.json(balance);
  }

  return response.json(0);
});

export default router;
