import express from "express";
import getBalance from "../middlewares/getBalance.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";

import accounts from "../accounts.mjs";

const router = express.Router();

// Retorna o valor total de uma conta
router.get("/balance", accountAlreadyExists, (request, response) => {
  const { account } = request;

  const balance = getBalance(account.statement);

  return response.json(balance);
});

// Retorna valor total (somando o balanço de todas as contas)
router.get("/balance/all", (request, response) => {
  if (accounts.length) {
    const balances = accounts.map((account) => getBalance(account.statement));
    let sum = balances.reduce((acc, balance) => {
      return acc + balance;
    });

    return response.json(sum);
  }

  return response.json(0);
});

export default router;
