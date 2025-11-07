import {Router} from 'express';
import {getSignosVitalesByPacienteID, postSignosVitales, putSignosVitales, deleteSignosVitales} from '../controllers/signosVitales.js';

const SignosVitalesRouter = Router();

SignosVitalesRouter.get('/:id_paciente', getSignosVitalesByPacienteID);
SignosVitalesRouter.post('/', postSignosVitales);
SignosVitalesRouter.put('/', putSignosVitales);
SignosVitalesRouter.delete('/:id_signo', deleteSignosVitales);

export default  SignosVitalesRouter;