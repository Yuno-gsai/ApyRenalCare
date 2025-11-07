import { Router } from "express";
import { getUsuarios, postUsuario,putUsuario,deleteUsuario,getUsuarioByID } from '../controllers/usuarios.js';

const UsuarioRouter = Router();

UsuarioRouter.get('/', getUsuarios);
UsuarioRouter.post('/', postUsuario);
UsuarioRouter.put('/', putUsuario);
UsuarioRouter.delete('/:id', deleteUsuario);
UsuarioRouter.get('/:id', getUsuarioByID);

export default UsuarioRouter;
