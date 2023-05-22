import express from 'express';

import accountAlreadyExists from '../middlewares/accountAlreadyExists.mjs';

const router = express.Router();

// Verificar o extrato de uma conta
router.get("/statement", accountAlreadyExists, (request, response) => {
  const { account } = request;

  return response.json(account.statement);
});

// Pesquisar registros em uma data no extrato
router.get("/statement/date", accountAlreadyExists, (request, response) => {
  const { account } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = account.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return response.json(statement);
});

export default router;