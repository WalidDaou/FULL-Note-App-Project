import express from 'express';
import {
    handleRegister, handelogin, handelLogout,getBack
} from '../usersAuth/userAuth';


const router = express.Router();

router.post('/api/register', handleRegister);
router.post('/api/Login', handelogin);
router.delete('/api/Logout', handelLogout);
router.get('/',getBack)

export default router;
