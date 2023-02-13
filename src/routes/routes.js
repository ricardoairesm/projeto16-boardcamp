
import express from 'express';
import cors from 'cors';

import { listarClientes, atualizarCliente, inserirCliente, buscarCLienteId } from '../controllers/ClientController.js';
import { listarJogos, inserirJogo } from '../controllers/JogosController.js';

const router = express.Router();
router.use(cors());
router.use(express.json());

router.get('/games',listarJogos);
router.post('/games',inserirJogo);

router.get('/customers', listarClientes);
router.get('/customers/:id', buscarCLienteId);
router.post('/customers', inserirCliente);
router.put('/customers/:id', atualizarCliente);


export default router;