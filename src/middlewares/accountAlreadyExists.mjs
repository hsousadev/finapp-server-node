import { prisma } from "../lib/prisma.mjs";

export async function accountAlreadyExists(request, response, next) {
  const { id } = request.headers;

  let account = await prisma.accounts.findUnique({
    where: {
      id: id,
    },
  });

  if (!account) {
    return response.status(404).send({ error: "account not found" });
  }

  request.account = account;

  return next();
}

export default accountAlreadyExists;
