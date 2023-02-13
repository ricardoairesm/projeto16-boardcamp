
import express from 'express';
import cors from 'cors';

import { listarClientes, atualizarCliente, inserirCliente, buscarCLienteId } from '../controllers/ClientController.js';
import { listarJogos, inserirJogo } from '../controllers/JogosController.js';
import { listarAlugueis, inserirAluguel, finalizarAluguel, apagarAluguel } from '../controllers/AluguelController.js';

const router = express.Router();
router.use(cors());
router.use(express.json());

router.get('/games', listarJogos);
router.post('/games', inserirJogo);

router.get('/customers', listarClientes);
router.get('/customers/:id', buscarCLienteId);
router.post('/customers', inserirCliente);
router.put('/customers/:id', atualizarCliente);

router.get('/rentals',listarAlugueis);
router.post('/rentals',inserirAluguel);
router.post('/rentals/:id/return',finalizarAluguel);
router.delete('/rentals:id',apagarAluguel);


export default router;