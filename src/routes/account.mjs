import express from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.mjs";

import banksLogo from "../bankLogos.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";
import getBalance from "../middlewares/getBalance.mjs";
import isImageURL from "../middlewares/isImageURL.mjs";

const router = express.Router();

// Criar uma conta
router.post("/account", async (request, response) => {
  const { name } = request.body;

  if (/^\s*$/.test(name)) {
    return response.status(400).send("Name is empty or contains only spaces");
  }

  const nameAlreadyExists = await prisma.accounts.findMany({
    where: {
      name: name,
    },
  });

  if (nameAlreadyExists.length > 0) {
    return response
      .status(400)
      .send("An account with that name already exists");
  }

  let logoImg = "";

  banksLogo.some((bank) => {
    if (bank.name === name.toLowerCase()) {
      logoImg = bank.img;
    }
  });

  await prisma.accounts.create({
    data: {
      id: uuidv4(),
      name,
      logoImg,
    },
  });

  return response.status(201).send("Account successfully created!");
});

// Alterar uma conta
router.put("/account", accountAlreadyExists, async (request, response) => {
  const { name, logoImg } = request.body;
  const { account } = request;

  if (!isImageURL(logoImg)) {
    return response.status(404).send("The string is not a valid image URL.");
  }

  await prisma.accounts.update({
    where: { id: account.id },
    data: {
      name,
      logoImg,
    },
  });

  return response.status(201).send("Account updated successfully!");
});

// Retornar todas as contas
router.get("/accounts", async (request, response) => {
  const allAccounts = await prisma.accounts.findMany({
    include: {
      statements: true,
    },
  });

  const allAccountsWithBalance = [];

  allAccounts.some((account) => {
    const accountBalance = getBalance(account.statements);
    const newAccount = {
      data: account,
      balance: accountBalance,
    };

    allAccountsWithBalance.push(newAccount);
  });

  return response.json(allAccountsWithBalance);
});

// Retornar uma conta
router.get("/account", accountAlreadyExists, async (request, response) => {
  const { account } = request;

  const singleAccount = await prisma.accounts.findUnique({
    where: {
      id: account.id,
    },
    include: {
      statements: true,
    },
  });

  const balance = getBalance(singleAccount.statements);

  const accountWithBalance = {
    data: singleAccount,
    balance,
  };

  return response.json(accountWithBalance);
});

// Deletar uma conta
router.delete("/account", accountAlreadyExists, async (request, response) => {
  const { account } = request;

  await prisma.accounts.delete({
    where: {
      id: account.id,
    },
  });

  return response.status(201).send("Account deleted successfully!");
});

export default router;
