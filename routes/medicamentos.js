import { Router } from "express";
import { getMedicamentosByPacienteID, postMedicamento, putMedicamento, deleteMedicamento } from "../controllers/medicamentos.js";

const MedicamentosRouter = Router();

MedicamentosRouter.get('/:id_paciente', getMedicamentosByPacienteID);
MedicamentosRouter.post('/', postMedicamento);
MedicamentosRouter.put('/', putMedicamento);
MedicamentosRouter.delete('/:id_medicamento', deleteMedicamento);

export default MedicamentosRouter;