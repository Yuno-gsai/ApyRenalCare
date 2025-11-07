import { Router } from "express";
import { getRecordatoriosByID, postRecordatorio, putRecordatorio, deleteRecordatorio } from "../controllers/recordatorios.js";

const RecordatorioRouter = Router();

RecordatorioRouter.get('/:id_paciente', getRecordatoriosByID);
RecordatorioRouter.post('/', postRecordatorio);
RecordatorioRouter.put('/', putRecordatorio);
RecordatorioRouter.delete('/:id_recordatorio', deleteRecordatorio);

export default RecordatorioRouter;
