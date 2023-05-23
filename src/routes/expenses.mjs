import express from "express";
import getExpenses from "../middlewares/getExpenses.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";

import { prisma } from "../lib/prisma.mjs";

const router = express.Router();

// Retorna os gastos de uma conta
router.get("/expenses", accountAlreadyExists, async (request, response) => {
  const statements = await prisma.statements.findMany();

  const expenses = getExpenses(statements);

  return response.json(expenses);
});


// Retorna gastos totais (somando os gastos de todas as contas)
router.get("/expenses/all", (request, response) => {
  const balances = accounts.map((account) => getExpenses(account.statement));
  let sum = balances.reduce((acc, balance) => {
    return acc + balance;
  });

  return response.json(sum);
});

export default router;
