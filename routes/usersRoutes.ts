import express from 'express';
import {
    handleRegister,
    handelogin,
    //  getBack,
    note,
    notes,
    notex,
    //  authenticateUser,
    editNote,
    deleteNote
} from '../Controller/userController';
import { auth } from './middelware/auth';


const router = express.Router();

router.post('/api/register', handleRegister);
router.post('/api/Login', handelogin);
// router.get('/',getBack)
// router.use(authenticateUser);
router.get('/note', notes)
router.get('/note/unique', auth, notex)

router.post('/notes', auth, note)
router.put('/notes/:id', auth, editNote)
router.delete('/notes/:id', auth, deleteNote)

export default router;
