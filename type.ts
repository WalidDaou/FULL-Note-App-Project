// // index.js
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const app = express();
// const port = 5000;

// app.use(express.json());
// app.use(cookieParser());

// const prisma = new PrismaClient();

// // Middleware to check if the user is authenticated
// const authenticateUser = (req, res, next) => {
//   const token = req.cookies.JWT;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     req.user = user;
//     next();
//   });
// };

// // Register a new user
// app.post('/register', async (req, res) => {
//   const { email, password } = req.body;

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create a new user
//   const newUser = await prisma.user.create({
//     data: {
//       email,
//       hashedPassword,
//     },
//   });

//   res.json({ message: 'User registered successfully', user: newUser });
// });

// // Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Find the user by email
//   const existingUser = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!existingUser) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   // Check password
//   const isValidPassword = await bcrypt.compare(password, existingUser.hashedPassword);

//   if (!isValidPassword) {
//     return res.status(401).json({ error: 'Invalid password' });
//   }

//   // Generate JWT token
//   const token = jwt.sign({ userId: existingUser.id, userEmail: existingUser.email }, process.env.TOKEN_SECRET, {
//     expiresIn: '1h',
//   });

//   // Set the JWT token as a cookie
//   res.cookie('JWT', token, {
//     maxAge: 3600000, // 1 hour
//     httpOnly: true,
//   });

//   res.json({ message: 'Login successful', token });
// });

// // Logout
// app.post('/logout', authenticateUser, (req, res) => {
//   // Clear the JWT cookie
//   res.clearCookie('JWT');

//   res.json({ message: 'Logout successful' });
// });

// // Add a new note (authenticated route)
// app.post('/notes', authenticateUser, async (req, res) => {
//   const { text, priority, category } = req.body;
//   const userId = req.user.userId;

//   // Add a new note
//   const newNote = await prisma.note.create({
//     data: {
//       text,
//       priority,
//       category,
//       userId,
//     },
//   });

//   res.json({ message: 'Note added successfully', note: newNote });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
