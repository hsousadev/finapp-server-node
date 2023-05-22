function getExpenses(statement) {
  let expenses = 0;

  statement.some((register) => {
    if (register.type == "debit") {
      expenses += register.amount;
    }
  });

  return expenses;
}

export default getExpenses;
