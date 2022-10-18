import Router from '@koa/router';
import { addDays, formatISO } from 'date-fns'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { checksExistsGameId, checksExistsUserAccount } from './middlewares';
import { prisma } from './prisma';

export const router = new Router();

type User = {
  username: string;
  name: string;
  email: string;
  password: string;
}

router.post('/signup', checksExistsUserAccount, async ctx => {
  const body = ctx.request.body
  const saltRounds = 10
  
  if(!body) {
    ctx.status = 400
    return
  }

  const password = await bcrypt.hash(body.password as string, saltRounds)
  
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        name: body.name,
        email: body.email,
        password,
      } as User,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      }   
    })

    const accessToken = jwt.sign({
      sub: user.id,
    }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    })

    ctx.body = {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user.id,
      },
      accessToken
    }
    
    ctx.status = 201

  } catch (error) {
    ctx.body = error
    ctx.status = 500
  }
})

router.post('/hunch', checksExistsGameId, async ctx => {
  const [type, token] = ctx.headers.authorization ? ctx.headers.authorization.split(' ') : ''

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string)
    const body = ctx.request.body

    if(!body) {
      ctx.status = 400
      return
    }

    const homeTeamScore = body.homeTeamScore as number
    const awayTeamScore = body.awayTeamScore as number

    const gameId = body.gameId as string
    const userId = data.sub as string

    const existsHunch = await prisma.hunch.findFirst({
      where: {
        gameId,
        userId
      }
    })

    try {
      const hunch = await prisma.hunch.upsert({
        where: {
          id: existsHunch ? existsHunch.id : '',
        },
        create: {
          awayTeamScore,
          homeTeamScore,
          userId,
          gameId
        },
        update: {
          awayTeamScore,
          homeTeamScore,
        }
      })

      ctx.body = hunch
      ctx.status = 200

    } catch (error) {
      console.log(error)
      ctx.body = error
      ctx.status = 500
    }
  } catch (error) {
    ctx.status = 401
  }
  
})

router.get('/hunches/:username', async ctx => {
  const username = ctx.params.username

  try {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if(!user) {
      ctx.body = "User does not exists"
      ctx.status = 404
      return
    }

    const hunches = await prisma.hunch.findMany({
      where: {
        userId: user.id
      }
    })

    ctx.body = {
      name: user.name,
      hunches
    }
    ctx.status = 200

  } catch (error) {
    ctx.body = error
    ctx.status = 500
  }
});

router.get('/games', async ctx => {
  const currentDate = ctx.request.query.gameTime as string
  
  const currentDateExist = currentDate ? {
    gameTime: {
      gte: currentDate,
      lt: formatISO(addDays(new Date(currentDate), 1))
    }
  } : {}

  try {
    const games = await prisma.game.findMany({
      where: currentDateExist
    })

    ctx.body = games
    ctx.status = 200

  } catch (error) {
    ctx.body = error
    ctx.status = 500
  }
});

router.get('/login', async ctx => {
  const [type, token] = ctx.headers.authorization ? ctx.headers.authorization.split(' ') : ''
  const [email, plainTextPassword] = Buffer.from(token, 'base64').toString().split(':')
  
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(!user) {
    ctx.body = "User does not exists"
    ctx.status = 404
    return
  }

  const passwordMatch = bcrypt.compareSync(plainTextPassword, user.password)
  
  if(!passwordMatch) {
    ctx.body = "Invalid Password"
    ctx.status = 404
    return
  }

  const accessToken = jwt.sign({
    sub: user.id,
  }, process.env.JWT_SECRET as string, {
    expiresIn: '24h'
  })

  ctx.body = {
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      id: user.id,
    },
    accessToken,
  }
  
})

router.get('/user', async ctx => {
  const [type, token] = ctx.headers.authorization ? ctx.headers.authorization.split(' ') : ''

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub as string,
      }
    })

    if(!user) {
      ctx.status = 404
      return
    }


    ctx.body = {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user.id,
      },
      accessToken: token
    }
  
    
  } catch(err) {
    ctx.status = 404
    return
  }

})