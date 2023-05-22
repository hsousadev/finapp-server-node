import express from "express";
import getExpenses from "../middlewares/getExpenses.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";

const router = express.Router();

// Retorna os gastos de uma conta
router.get("/expenses", accountAlreadyExists, (request, response) => {
  const { account } = request;

  const expenses = getExpenses(account.statement);

  return response.json(expenses);
});

// Retorna gastos totais (somando os gastos de todas as contas)
router.get("/expenses-all", (request, response) => {
  const balances = accounts.map((account) => getExpenses(account.statement));
  let sum = balances.reduce((acc, balance) => {
    return acc + balance;
  });

  return response.json(sum);
});

export default router;
