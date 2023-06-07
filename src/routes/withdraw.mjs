import express from "express";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";
import getBalance from "../middlewares/getBalance.mjs";

import { prisma } from "../lib/prisma.mjs";

const router = express.Router();

// Registra um saque no extrato de uma conta
router.post("/withdraw", accountAlreadyExists, async (request, response) => {
  const { amount, description, date } = request.body;
  let { account } = request;

  const statements = await prisma.statements.findMany();

  const balance = getBalance(statements);

  if (balance < amount) {
    return response.status(400).send({ error: "Insufficient funds" });
  }

  const statementOperation = {
    description,
    amount,
    created_at: date,
    type: "debit",
  };

  account = await prisma.statements.create({
    data: {
      accountId: account.id,
      ...statementOperation,
    },
  });

  return response.status(201).send("Operation created successfully");
});

export default router;
