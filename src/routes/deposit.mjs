import express from "express";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs"

const router = express.Router();

// Registra um depósito no extrato de uma conta
router.post("/deposit", accountAlreadyExists, (request, response) => {
  const { description, amount } = request.body;

  const { account } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  account.statement.push(statementOperation);

  return response.status(201).send();
});

export default router;

