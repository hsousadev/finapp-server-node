import express from "express";

import account from "./routes/account.mjs";
import statement from "./routes/statement.mjs";
import deposit from "./routes/deposit.mjs";
import withdraw from "./routes/withdraw.mjs";
import balances from "./routes/balances.mjs";
import expenses from "./routes/expenses.mjs";

const app = express();

app.use(express.json());
app.listen(3333, () => {
  console.log("🚀 Server is listening on port 3333");
});

app.use("/", account);
app.use("/", deposit);
app.use("/", statement);
app.use("/", withdraw);
app.use("/", balances);
app.use("/", expenses);
