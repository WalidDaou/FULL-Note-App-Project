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
            // return res.json('user already exist')
            return res.status(500).json({ error: 'User already exists' });
        }
        // const USER = { name , email , password }
        const tokenSecret = process.env.TOKEN_SECRET;

        if (!tokenSecret) {
            console.error('Error: TOKEN_SECRET is not defined in environment variables');
            process.exit(1); // Exit the process or handle the error appropriately
        }




        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });
        const Token = JWT.sign(newUser, tokenSecret);
        console.log(Token);
        return res.json({ Token: Token });


        //   if (newUser){
        //     res.redirect('/Login')
        //   }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

function authenticatToken (req:any,res:any,next:any){

}
// async function compare(userPassword: any, hashedPassword: any) {
//     const rest = await bcrypt.compare(userPassword, hashedPassword)
//     return rest

// };

const handelogin = async (req: any, res: any) => {


    try {
        const check = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });


        if (!check) {
            console.log('User does not exist');
            return res.status(400).json({ error: 'User does not exist' });
        }

        const passcheck = await bcrypt.compare(req.body.password, check.hashedPassword);

        if (passcheck) {
            console.log('Login successful');
            return res.status(200).json({ message: 'Login successful' });
        } else {
            console.log('Invalid password');
            return res.status(400).json({ error: 'Invalid password' });
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





export { handleRegister, handelogin };
