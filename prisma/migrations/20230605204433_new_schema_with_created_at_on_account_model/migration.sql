-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logoImg" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Statements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "created_at" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Statements_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
