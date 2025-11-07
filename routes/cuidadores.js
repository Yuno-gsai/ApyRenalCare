import { Router } from "express";
import { getCuidadores, postCuidador, putCuidador, deleteCuidador, getCuidadorByID, RelacionarPaciente, EliminarRelacion, CrearPaciente } from '../controllers/cuidadores.js';

const CuidadorRouter = Router();

CuidadorRouter.get('/', getCuidadores);
CuidadorRouter.post('/', postCuidador);
CuidadorRouter.put('/', putCuidador);
CuidadorRouter.delete('/:id_cuidador', deleteCuidador);
CuidadorRouter.get('/:id_cuidador', getCuidadorByID);
CuidadorRouter.post('/RelacionarPaciente', RelacionarPaciente);
CuidadorRouter.post('/EliminarRelacion', EliminarRelacion);
CuidadorRouter.post('/CrearPaciente', CrearPaciente);

export default CuidadorRouter;
