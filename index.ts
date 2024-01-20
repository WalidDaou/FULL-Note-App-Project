import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
const app = express();


app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Initialize Prisma Client

app.get('/users', async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get('/Login', (req: any, res: any) => {
  res.send('Login here');
});


const handelstuff = async (req: any, res: any) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    console.log(newUser);
    return res.json(newUser);

    if (newUser) {

      res.redirect('/login')
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

app.post('/api/register', handelstuff
);



app.get('/', (req: any, res: any) => {
  res.send('starting');
});


app.listen(port, async () => {
  console.log(`Server is running on port Good Good ${port}.`);

  try {
    await prisma.$connect();
    console.log('Prisma Client connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});

