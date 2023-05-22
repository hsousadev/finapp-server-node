import express from "express";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";
import getBalance from "../middlewares/getBalance.mjs";

const router = express.Router();

// Registra um saque no extrato do conta
router.post("/withdraw", accountAlreadyExists, (request, response) => {
  const { amount, description } = request.body;
  const { account } = request;

  const balance = getBalance(account.statement);

  if (balance < amount) {
    return response.status(400).send({ error: "Insufficient funds" });
  }

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "debit",
  };

  account.statement.push(statementOperation);

  return response.status(201).send();
});

export default router;
