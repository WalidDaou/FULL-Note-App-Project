import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { Request, Response } from 'express';

import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
dotenv.config();

const prisma = new PrismaClient();


// const authenticateUser = (req: any, res: any) => {
//     const cookies = req.cookies;
//     const token = cookies && cookies.jwt;

//     if (!token) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
//         if (err) {
//             return res.status(403).json({ error: 'Forbidden' });
//         }

//         req.user = user;
//         next();
//     });
// };

const notes = async (req: any, res: any) => {

    const notes = await prisma.note.findMany();
    res.json(notes);
}


const notex = async (req: any, res: any) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const userNotes = await prisma.note.findMany({
            where: { userId: parseInt(userId) },
        });

        res.json(userNotes);
    } catch (error) {
        console.error('Error fetching user notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const note = async (req: any, res: any) => {

    const { text, priority, category } = req.body;
    const userId = req.user && req.user.userId;

    // Add a new note
    const newNote = await prisma.note.create({
        data: {
            text,
            priority,
            category,
            userId,
        },
    });

    res.json(newNote);
}



const handleRegister = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
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


        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });

        console.log(newUser);
        return res.json({ newUser });


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
// jwt.verify(comonToken ,tokenSecret,(err:any,user:any)=>{
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

        const tokenSecret = process.env.TOKEN_SECRET || 'defaultSecret';

        if (!tokenSecret) {
            console.error('Error: TOKEN_SECRET is not defined in environment variables');
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const passcheck = await bcrypt.compare(req.body.password, check.hashedPassword);
        if (!passcheck) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const yap = jwt.sign({ name : check.name , userId: check.id, userEmail: check.email }, tokenSecret, {
            expiresIn: '1h',
        });

    

        const decoded = jwt.verify(yap, tokenSecret) as JwtPayload;
        console.log('Decoded:', decoded);

        // Rest of your code...
        if (passcheck && yap && decoded) {
            return res.json({ decodedToken: decoded, yap });
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }



}
// const handelLogout = async (req: any, res: any) => {
//     // Assuming you have the user's token in the request headers
//     const token = req.headers['authorization'];

//     // Check if the token exists
//     if (!token) {
//         return res.status(400).json({ error: 'Token not provided' });
//     }

//     // Continue with token verification
//     const tokenSecret = process.env.TOKEN_SECRET;

//     try {
//         jwt.verify(token as string, tokenSecret, (err: any, user: any) => {
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

// const editNote = async (req: any, res: any) => {



//     const id = parseInt(req.params.id);
//     const { text, priority, category, userId } = req.body;
//     const updatedNote = await prisma.note.update({
//         where: { id },
//         data: { text, priority, category, userId },
//     });
//     res.json(updatedNote);



// }

const editNote = async (req: any, res: any) => {
    const id = parseInt(req.params.id);
    const { text, priority, category, userId } = req.body;

    // Assuming you have the userId of the currently authenticated user
    const authenticatedUserId = req.user.id; // Adjust this based on your authentication setup

    // Check if the authenticated user is the owner of the note
    const existingNote = await prisma.note.findUnique({
        where: { id },
    });

    if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.userId !== authenticatedUserId) {
        return res.status(403).json({ error: 'Unauthorized - You are not the owner of this note' });
    }

    // If the user is the owner, proceed with the update
    const updatedNote = await prisma.note.update({
        where: { id },
        data: { text, priority, category, userId },
    });

    res.json(updatedNote);
}

const deleteNote = async (req: any, res: any) => {

    const id = parseInt(req.params.id);

    const authenticatedUserId = req.user.id; // Adjust this based on your authentication setup

    // Check if the authenticated user is the owner of the note
    const existingNote = await prisma.note.findUnique({
        where: { id },
    });

    if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.userId !== authenticatedUserId) {
        return res.status(403).json({ error: 'Unauthorized - You are not the owner of this note' });
    }

    await prisma.note.delete({
        where: { id },
    });
    res.json({ message: 'Note deleted successfully' });

}




const handelLogout = async (req: any, res: any) => {

    res.clearCookie('token');
    res.json({ message: 'Logout successful' });


}



// const getBack = async (req: Request, res: Response) => {





//     const TOKEN_SECRET = process.env.TOKEN_SECRET;
//     const token = req.get('Authorization')?.split(' ')[1];
//     const decoded = jwt.verify(token, TOKEN_SECRET);

//     try {
//         if (token) {

//             res.redirect('/notes');
//         } else {
//             res.redirect('/login');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



export {
    handleRegister,
    handelogin,
    handelLogout,
    // getBack,
    note,
    notex,
    notes,
    // authenticateUser,
    editNote,
    deleteNote

};