import { Router } from 'express';
import {getPacientes, postPaciente, putPaciente, deletePaciente, getPacienteByID,getAllInfoByID} from '../controllers/pacientes.js';

const PacienteRouter = Router();

PacienteRouter.get('/', getPacientes);
PacienteRouter.post('/', postPaciente);
PacienteRouter.put('/', putPaciente);
PacienteRouter.delete('/:id_paciente', deletePaciente);
PacienteRouter.get('/:id_paciente', getPacienteByID);
PacienteRouter.get('/all/:id_paciente', getAllInfoByID);

export default PacienteRouter;
