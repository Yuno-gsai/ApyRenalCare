import { Router } from "express";
import { getDoctores, postDoctor, putDoctor, deleteDoctor, getDoctorByID, RelacionarPaciente, EliminarRelacion,CrearPaciente,getPacientesByDocotorID } from "../controllers/doctores.js";

const DoctorRouter = Router();

DoctorRouter.get('/', getDoctores);
DoctorRouter.post('/', postDoctor);
DoctorRouter.put('/', putDoctor);
DoctorRouter.delete('/:id_doctor', deleteDoctor);
DoctorRouter.get('/:id_doctor', getDoctorByID);
DoctorRouter.post('/RelacionarPaciente', RelacionarPaciente);
DoctorRouter.delete('/EliminarRelacion/:id_doctor/:id_paciente', EliminarRelacion);
DoctorRouter.post('/CrearPaciente', CrearPaciente);
DoctorRouter.get('/PacientesByDocotorID/:id_doctor', getPacientesByDocotorID);
export default DoctorRouter;