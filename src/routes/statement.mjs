import express from 'express';
import { prisma } from "../lib/prisma.mjs";

import accountAlreadyExists from '../middlewares/accountAlreadyExists.mjs';

const router = express.Router();

// Verificar o extrato de uma conta
router.get("/statement", accountAlreadyExists, async (request, response) => {
  const { account } = request;

  const statements = await prisma.statements.findMany({
    where: { accountId: account.id },
  });

  return response.json(statements);
});

// Pesquisar registros em uma data no extrato
router.get("/statement/date", accountAlreadyExists, async (request, response) => {
  const { account } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statements = await prisma.statements.findMany({
    where: { accountId: account.id },
  });

  const statement = statements.filter(
    (statement) =>
      new Date(statement.created_at).toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return response.json(statement);
});

export default router;