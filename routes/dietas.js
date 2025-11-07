import {getDietaByPacienteID,postDieta,putdieta,deleteDieta} from '../controllers/dietas.js';
import { Router } from 'express';

const DietaRouter = Router();

DietaRouter.get('/:id_paciente', getDietaByPacienteID);
DietaRouter.post('/', postDieta);
DietaRouter.put('/', putdieta);
DietaRouter.delete('/:id_dieta', deleteDieta);

export default DietaRouter;
