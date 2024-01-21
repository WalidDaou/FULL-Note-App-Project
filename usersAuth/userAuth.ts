import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
const prisma = new PrismaClient();


const handleRegister = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    try {
      const check = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
  
      if (check) {
        // User already exists
        console.log('user already exist')
       
        return res.status(500).json({ error: 'User already exists' });
      }
  
  
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

      
    //   if (newUser){
    //     res.redirect('/Login')
    //   }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const handelogin = async (req:any,res:any)=>{

  }

  export {handleRegister,handelogin}