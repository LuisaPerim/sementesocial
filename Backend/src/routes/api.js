import { Router } from "express";
import * as authController from '../controllers/auth.controller.js';
import * as ongController from '../controllers/ong.controller.js';
import * as volController from '../controllers/voluntario.controller.js';

const router = Router();

//Rota de cadastro do usuário
router.post('/cadastrar',authController.cadastrarUsuario);
router.post('/cadastrar/ong', ongController.cadastrarOng); 
router.post('/cadastrar/voluntario', volController.cadastrarVoluntario);

//Rota de login
router.post('/login', authController.login);

//Rota de logout
router.post('/logout', authController.logout)

//Rota para listar todos os matches de uma ong
router.get('/matches/:ongId', ongController.obterMatchesOng)

//Rota para pegar os dados da ong
router.get('/ongs/:id', ongController.obterDadosOng);

//Rota para atualizar os dados da ong
router.put('/ongs/:ongId', ongController.atualizarOng);

//Rota para pegar todas as ong
router.get('/ongs', ongController.listarOngs);

//Rota para realizar o match
router.post('/matches', volController.criarMatch)

//Rota para remover o match
router.delete('/matches', volController.removerMatch);

//Rota para matches realizados por voluntários
router.get('/matches/voluntario/:id_voluntario', volController.obterMatchesVoluntario)

//Rota para pedar os dados de um voluntário
router.get('/voluntarios/:id', volController.obterDadosVoluntario);

//Rota para pegar os dados do voluntario
router.put('/voluntarios/:id', volController.atualizarDadosVoluntario);

//Rota para excluir um voluntario
router.delete('/voluntarios/:id', volController.deletarVoluntario);

//Rota para excluir uma ong
router.delete('/ongs/:id', ongController.deletarOng);

export default router;