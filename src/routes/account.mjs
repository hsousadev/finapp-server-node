import express from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.mjs";

import banksLogo from "../bankLogos.mjs";
import accountAlreadyExists from "../middlewares/accountAlreadyExists.mjs";
import getBalance from "../middlewares/getBalance.mjs";

const router = express.Router();

// Criar uma conta
router.post("/account", async (request, response) => {
  const { name, imgUrl } = request.body;

  let logoImg = imgUrl;

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

  if (logoImg === "") {
    banksLogo.some((bank) => {
      if (bank.name === name.toLowerCase()) {
        logoImg = bank.img;
      }
    });
  }

  await prisma.accounts.create({
    data: {
      id: uuidv4(),
      name,
      logoImg: logoImg,
      created_at: new Date(),
    },
  });

  return response.status(201).send("Account successfully created!");
});

// Alterar uma conta
router.put("/account", accountAlreadyExists, async (request, response) => {
  const { name, imgUrl } = request.body;
  const { account } = request;

  let logoImg = imgUrl;

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
    orderBy: {
      created_at: "desc",
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
