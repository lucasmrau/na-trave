import { Context, Next } from 'koa';
import { prisma } from './prisma';


export async function checksExistsUserAccount(ctx: Context, next: Next) {
  const body = ctx.request.body
  const email = body && body.email as string;
  const username = body && body.username as string;

  const emailExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if(emailExists || usernameExists) {
    ctx.body = "User already exists"
    ctx.status = 409

    return
  }

  return next()
}

export async function checksExistsGameId(ctx: Context, next: Next) {
  const body = ctx.request.body
  const gameId = body && body.gameId as string

  const existGameId = await prisma.game.findUnique({
    where: {
      id: gameId
    }
  })

  if(!existGameId) {
    ctx.body = "GameId or UserId does not exists"
    ctx.status = 400
    return
  }

  return next()
}