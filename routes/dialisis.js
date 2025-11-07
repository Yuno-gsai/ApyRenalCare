import { Router } from "express";
import { getDialisisByPacienteID, postDialisis, putDialisis, deleteDialisis } from "../controllers/dialisis.js";

const DialisisRouter = Router();

DialisisRouter.get('/:id_paciente', getDialisisByPacienteID);
DialisisRouter.post('/', postDialisis);
DialisisRouter.put('/', putDialisis);
DialisisRouter.delete('/:id_dialisis', deleteDialisis);

export default DialisisRouter;
