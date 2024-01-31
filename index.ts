import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import usersRoutes from './routes/usersRoutes'
import cookieParser from 'cookie-parser';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cookieParser());

app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/', usersRoutes);



// Get all notes
// app.get('/notes', async (req, res) => {
//   const notes = await prisma.note.findMany();
//   res.json(notes);
// });
// const authenticateUser = (req:any, res:any, next:any) => {
//   const token = req.cookies.JWT;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   JWT.verify(token, process.env.TOKEN_SECRET, (err:any, user:any) => {
//     if (err) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     req.user = user;
//     next();
//   });
// };
// Add a new note




// Update a note by ID


// Delete a note by ID




// Initialize Prisma Client
app.get('/',(req:any ,res:any)=>{
  res.send('Hello World!')
})

app.get('/users', async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get('/Login', (req: any, res: any) => {
  res.send('Login here');
});


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

