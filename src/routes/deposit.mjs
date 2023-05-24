import express from "express";
import { prisma } from "../lib/prisma.mjs";

import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Registra um depósito no extrato de uma conta
router.post("/deposit", accountAlreadyExists, async (request, response) => {
  const { description, amount, date } = request.body;
  let { account } = request;

  const statementOperation = {
    id: uuidv4(),
    description,
    amount,
    created_at: date,
    type: "credit",
  };

  account = await prisma.statements.create({
    data: {
      accountId: account.id,
      ...statementOperation,
    },
  });

  return response.status(201).send("Operation created successfully!");
});

export default router;
