CREATE DATABASE sementesocial;
--
-- Table structure for table `match`
--
CREATE TABLE `match` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ong` int NOT NULL,
  `id_voluntario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_match_id_ong` (`id_ong`),
  KEY `fk_match_id_voluntario` (`id_voluntario`),
  CONSTRAINT `fk_match_id_ong` FOREIGN KEY (`id_ong`) REFERENCES `ongs` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_match_id_voluntario` FOREIGN KEY (`id_voluntario`) REFERENCES `voluntarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE
) 
--
-- Table structure for table `ongs`
--

CREATE TABLE `ongs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cnpj` varchar(30) DEFAULT NULL,
  `nome_responsavel` varchar(100) DEFAULT NULL,
  `contato_telefone` varchar(30) DEFAULT NULL,
  `contato_email` varchar(50) DEFAULT NULL,
  `endereco_estado` varchar(30) DEFAULT NULL,
  `endereco_cidade` varchar(50) DEFAULT NULL,
  `endereco_endereco` varchar(100) DEFAULT NULL,
  `categoria` varchar(30) DEFAULT NULL,
  `foto` blob,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ongs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
)

--
-- Table structure for table `usuarios`
--


CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `tipo` enum('voluntario','ong') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`)
) 
--
-- Table structure for table `voluntarios`
--


CREATE TABLE `voluntarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `biografia` text,
  `dt_nasc` date DEFAULT NULL,
  `contato_telefone` varchar(30) DEFAULT NULL,
  `contato_email` varchar(50) DEFAULT NULL,
  `endereco_estado` varchar(30) DEFAULT NULL,
  `endereco_cidade` varchar(50) DEFAULT NULL,
  `endereco_endereco` varchar(100) DEFAULT NULL,
  `foto` blob,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `voluntarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) 
