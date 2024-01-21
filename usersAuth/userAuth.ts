import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
dotenv.config();

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
        res.cookie("JWT", Token, {
            maxAge: 60000,
            httpOnly: true,

        })
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

// function authenticatToken (req:any,res:any,next:any){
// const authHedear = req.headers['authorization']
// const comonToken = authHedear && authHedear.split('')[1]
// if (comonToken == null ) return res.sendStatus(404)
// const tokenSecret = process.env.TOKEN_SECRET;
// JWT.verify(comonToken ,tokenSecret,(err:any,user:any)=>{
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
// })


// }


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

        const tokenSecret = process.env.TOKEN_SECRET;

        if (!tokenSecret) {
            console.error('Error: TOKEN_SECRET is not defined in environment variables');
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const passcheck = await bcrypt.compare(req.body.password, check.hashedPassword);
        const yap = JWT.sign({ userId: check.id, userEmail: check.email }, tokenSecret, { expiresIn: '10s' });

        if (passcheck && yap) {
            console.log('Login successful');
            res.cookie("JWT", yap, {
                maxAge: 60000,
                httpOnly: true,

            })
            return res.status(200).json({ message: 'Login successful', token: yap });






        } else {
            console.log('Invalid password');
            return res.status(400).json({ error: 'Invalid password' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// const handelLogout = async (req: any, res: any, next: any) => {
//     // Assuming you have the user's token in the request headers
//     const token = req.headers['authorization'];

//     // Check if the token exists
//     if (!token) {
//         return res.status(400).json({ error: 'Token not provided' });
//     }

//     // Continue with token verification
//     const tokenSecret = process.env.TOKEN_SECRET;

//     try {
//         JWT.verify(token as string, tokenSecret, (err: any, user: any) => {
//             if (err) return res.sendStatus(403);
//             req.user = user;
//             next();
//         });

//         // You can add the token to a blacklist or simply set an expiration time to invalidate it
//         // In this example, we'll just return a success message
//         console.log('Logout successful');
//         return res.status(200).json({ message: 'Logout successful' });
//     } catch (error) {
//         console.error('Error during token verification:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// }    

const handelLogout = async (req: any, res: any, next: any) => {
    try {
        // const authHeader = req.headers['authorization'];

        // if (authHeader === undefined) {
        //     return res.sendStatus(404);
        // }

        // const tokenSecret = process.env.TOKEN_SECRET;

        // // Type assertion to tell TypeScript that authHeader is a string
        // const authHeaderString = authHeader as string;

        // JWT.verify(authHeaderString, tokenSecret, (err: any, user: any) => {
        //     if (err) return res.sendStatus(403);
        //     req.user = user;
        //     next();
        // });

        // Perform any additional cleanup or logging out logic here
        // Respond with a successful status
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Handle any errors that may occur during logout
        console.error('Logout failed:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getBack = async (req: Request, res: Response) => {
    const tokenSecret = process.env.TOKEN_SECRET;

    try {
        if (req.cookies.JWT) {
            const verify = JWT.verify(req.cookies.JWT, tokenSecret as Secret);
            res.redirect('/notes');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export { handleRegister, handelogin, handelLogout, getBack };