import express from 'express';
import {
    handleRegister,handelogin
} from '../usersAuth/userAuth';


const router = express.Router();

router.post('/api/register', handleRegister);
router.post('/api/Login', handelogin);


export default router;
