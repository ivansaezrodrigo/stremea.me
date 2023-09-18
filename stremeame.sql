-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: stremeame_db
-- ------------------------------------------------------
-- Server version       8.0.33-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Rooms`
--

DROP TABLE IF EXISTS `Rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `owner` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `private` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`),
  CONSTRAINT `Rooms_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rooms`
--

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
INSERT INTO `Rooms` VALUES (12,'uUm9XcO1S934-xVbJGsdI',10,'Tengo Catorce tractores amarillos','¿Es lo que se llevaaa ahora?¿Otra vez?',0,'2023-04-26 21:55:52','2023-04-26 23:00:10'),(36,'XFblj4tBg1GkvHO-ImVKe',40,'👾 ¡Konichiwa chavales! - Disfrutad del streaming del tal あんず 🕹','¡Bienvenidos!¡Esta es mi nueva sala de chat! Tomad asiento y disfrutad del streaming.',0,'2023-05-17 12:41:47','2023-05-17 12:41:47'),(38,'I6Ht-XHbJBuPkhk96rjob',46,'👾 ¡Konichiwa chavales! - Disfrutad del streaming del tal 偉丈夫 🕹','¡Bienvenidos!¡Esta es mi nueva sala de chat! Tomad asiento y disfrutad del streaming.',0,'2023-05-17 16:38:27','2023-05-17 16:38:27'),(40,'N3wKDik5Vix-81fm9UEOe',45,'👾 ¡Konichiwa chavales! - Disfrutad del streaming del tal あんず 🕹','¡Bienvenidos!¡Esta es mi nueva sala de chat! Tomad asiento y disfrutad del streaming.',0,'2023-05-23 14:14:36','2023-05-23 18:31:48');
/*!40000 ALTER TABLE `Rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoomsUsers`
--

DROP TABLE IF EXISTS `RoomsUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RoomsUsers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `banned` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roomId` (`roomId`),
  KEY `userId` (`userId`),
  CONSTRAINT `RoomsUsers_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `Rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RoomsUsers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoomsUsers`
--

LOCK TABLES `RoomsUsers` WRITE;
/*!40000 ALTER TABLE `RoomsUsers` DISABLE KEYS */;
INSERT INTO `RoomsUsers` VALUES (7,12,10,0,'2023-04-26 21:55:52','2023-04-26 21:55:52'),(8,12,11,1,'2023-04-26 21:57:34','2023-04-26 23:27:29'),(32,36,40,0,'2023-05-17 12:41:48','2023-05-17 12:41:48'),(35,38,46,0,'2023-05-17 16:38:27','2023-05-17 16:38:27'),(37,40,45,0,'2023-05-23 14:14:36','2023-05-23 14:14:36');
/*!40000 ALTER TABLE `RoomsUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tokens`
--

DROP TABLE IF EXISTS `Tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `typetoken` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `Tokens_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tokens`
--

LOCK TABLES `Tokens` WRITE;
/*!40000 ALTER TABLE `Tokens` DISABLE KEYS */;
INSERT INTO `Tokens` VALUES (3,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFJlY3VwZXJhY2lvbiI6Imp1bWFuY2hAZ21haWwuY29tIiwiaWF0IjoxNjgzOTIwMTk0LCJleHAiOjE2ODM5MjEwOTR9._Ii06CUmFfbvTJwKay8MHXNtZhm_DVNAbIDGdsEg_ZE','recuperacion','2023-05-12 19:36:34','2023-05-12 19:36:34'),(4,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFJlY3VwZXJhY2lvbiI6Imp1bWFuY2hAZ21haWwuY29tIiwiaWF0IjoxNjgzOTIxMTUxLCJleHAiOjE2ODM5MjIwNTF9.1jaxywIxxqDO6jCUFbE2r-Er-A3fZgmrr9QCHhBWhGs','recuperacion','2023-05-12 19:52:31','2023-05-12 19:52:31'),(5,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFJlY3VwZXJhY2lvbiI6Imp1bWFuY2hAZ21haWwuY29tIiwiaWF0IjoxNjg0MzQzMTc0LCJleHAiOjE2ODQzNDQwNzR9.Bm4bjZav_2dJ8xpg-2Yac4tQ1O6qtBr1KvshvyGcbWY','recuperacion','2023-05-17 17:06:14','2023-05-17 17:06:14'),(6,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFJlY3VwZXJhY2lvbiI6Imp1bWFuY2hAZ21haWwuY29tIiwiaWF0IjoxNjg0ODY4MzIyLCJleHAiOjE2ODQ4NjkyMjJ9.qSsL59rXRyRNGhJB9JNKaZLYWk_ibfQPIFYio4E3EfQ','recuperacion','2023-05-23 18:58:42','2023-05-23 18:58:42'),(7,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFJlY3VwZXJhY2lvbiI6Imp1bWFuY2hAZ21haWwuY29tIiwiaWF0IjoxNjg0ODY4NjUxLCJleHAiOjE2ODQ4Njk1NTF9.6N-4ey-_7JKtVw-rygrOIPtfvoCQ-Y8HzvBlaGH-uX8','recuperacion','2023-05-23 19:04:11','2023-05-23 19:04:11');
/*!40000 ALTER TABLE `Tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alias` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitch` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `newsletter` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (10,NULL,'rrrrrr@asd.com','$2b$10$erqQ.92VloLC0T64cJ889.AvSPAA4U269HcxHr3X.ic8UE2NfH2P6','mecenas','gorgontzola','gorgontzolla','gorgontzola','http://google.com/',1,'2023-04-26 19:19:41','2023-04-26 21:21:41'),(11,NULL,'polloalasa@milanese.com','$2b$10$XHvyHYfzIVUKRiC2BE/n5OUiMBElXHM1O1BiSKeD6RwPWm6QMBoDe','user',NULL,NULL,NULL,NULL,1,'2023-04-26 19:24:48','2023-04-26 19:30:27'),(12,NULL,'ivan@saez.com','$2b$10$Xzf9NZEv9sAMvZPxXiXKT.UQxD.XPmlk68fZsen73pjqvZaRMs2Va','user',NULL,NULL,NULL,NULL,1,'2023-05-02 18:40:50','2023-05-02 18:40:50'),(17,NULL,'user@example.com','$2b$10$0mBKEJND9wRbi88W.HF0pusD9Qz3tpZU7wac1Wa.aa4C8KOoHQSKC','user',NULL,NULL,NULL,NULL,1,'2023-05-04 21:06:20','2023-05-04 21:06:20'),(18,NULL,'usuario@usuario.com','$2b$10$WF1GafFhVmRPI.NwV0hgguNXu4/sZPPZ9UeohCrYKaq9okiN1Xm7C','user',NULL,NULL,NULL,NULL,1,'2023-05-08 07:47:46','2023-05-08 07:47:46'),(19,NULL,'pepitopa@papa.com','$2b$10$RHCs9qvbN5ln0aYqwxBa4.40E5YIAT0wE0UKcpkAsB.YVBQQQQhyO','user',NULL,NULL,NULL,NULL,1,'2023-05-08 08:47:26','2023-05-08 08:47:26'),(20,NULL,'jumanch@correo.com','$2b$10$M8N5UZjVac8p0gxTcjp6xOT81MmaEIevc1F74TykW5xXuNwp0ZK92','user','JUANMACHAN','jumanch','jumanchtv','http://ivansaezrodrigo.live/',1,'2023-05-08 09:16:14','2023-05-12 10:36:29'),(21,NULL,'sdadsds@correo.com','$2b$10$ieXiOMvi65miZwzy0gmirO5ai2yAaJdpOKHhLMzEF26Ls1ZAJ5I0y','user',NULL,NULL,NULL,NULL,1,'2023-05-08 09:17:18','2023-05-08 09:17:18'),(22,NULL,'ivansaezro@gmail.com','$2b$10$3rmBuWD30CO61XKwukWHkOlzW9jqpN6rhj0kK3b98Paancix0Lvzi','user',NULL,NULL,NULL,NULL,1,'2023-05-08 09:18:08','2023-05-08 09:18:08'),(23,NULL,'usuario@ejemplo.com','$2b$10$lFWgvoBr/veHX02wa1vbkOL.LNkKlKKGBQb.UiZWEYmt1iEtzlUva','user',NULL,NULL,NULL,NULL,1,'2023-05-08 09:46:49','2023-05-08 09:46:49'),(24,NULL,'jumanch@correo2.com','$2b$10$M0k35ya9cSqskFQ1PAYZC.PrncPYPD4gG5LBu4b//7lXKKfQKhhdq','user',NULL,NULL,NULL,NULL,1,'2023-05-08 09:48:14','2023-05-08 09:48:14'),(25,NULL,'vicente@correo.com','$2b$10$UBj6rQRR9sDqfQUErOig8eoS6NP2oN9cIlNpOqvtahT2UCSX772LG','user',NULL,NULL,NULL,NULL,1,'2023-05-09 07:09:30','2023-05-09 07:09:30'),(26,'苏格','papaya@example.com','$2b$10$Blbk5xyKZtTbhQGLhjttLeLfQ62UStZseTUFoHx4qe4D74qSUNskG','user',NULL,NULL,NULL,NULL,1,'2023-05-09 14:55:02','2023-05-09 14:55:02'),(38,'七月','vicentemonsalve@gmail.com','$2b$10$HdXmNMhOWpaQySIyhdsgTOLC47D1jMknU2C7VwoiVRtBxC6Ibru/S','user',NULL,NULL,NULL,NULL,1,'2023-05-10 10:25:23','2023-05-10 10:25:23'),(40,'あんず','a@a.com','$2b$10$7uzWPb62eIobmeWVuDfLwef4GPZZLmMayYs46dsvI80inGwuoaFWm','user','a','','','',1,'2023-05-11 10:38:24','2023-06-08 07:08:19'),(42,'パン粉','b@b.com','$2b$10$EQf7JY2R28ujdlp/cKeB5.dtPE2w035.Hit2uU9NSe0uv6LwP2/KS','user',NULL,NULL,NULL,NULL,1,'2023-05-11 10:47:44','2023-05-11 10:47:44'),(45,'Iván','jumanch@gmail.com','$2b$10$6ofaecPR0cI00h5bh0.AC.uHB1wnFPp1jYUnguMwZhjB2ckZ.4Dk.','mecenas','jumanch_','jumanch','jumanchh','https://ivansaezrodrigo.live',0,'2023-05-11 14:26:12','2023-05-23 15:06:56'),(46,'偉丈夫','prueba@hoy.com','$2b$10$h.g9aLXuoSO0FKZg5gCke.EbOte6fWX6H50rl8pAln6FiUyQhwxWe','user','TwPrueba','','','https://ivansaezrodrigo.live',0,'2023-05-17 16:35:33','2023-05-17 16:37:35'),(47,'セメント','usuario@usuario2.com','$2b$10$U1mZ2DYAe1bwpi0bHnmup.SonL7iv5OulaEwohFlSxY0QVyYJ8fd.','user',NULL,NULL,NULL,NULL,1,'2023-05-19 17:15:30','2023-05-19 17:15:30'),(48,'ふぐり','asddsadsa@sasddsadsa.com','$2b$10$BxD3yl1d7DKSQ1F4nUiCRuV3bf/NLQz1aYoneT.QUgglhh0Yydk4G','user',NULL,NULL,NULL,NULL,1,'2023-05-23 09:53:05','2023-05-23 09:53:05');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20230424200027-create-user.js'),('20230424200319-create-token.js'),('20230424200610-create-room.js'),('20230424213210-create-rooms-user.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Crear el usuario stremeaSQL
CREATE USER 'stremeaSQL'@'localhost' IDENTIFIED BY 'albaricoque';

-- Otorgar permisos totales al usuario sobre la base de datos stremeame_db
GRANT ALL PRIVILEGES ON stremeame_db.* TO 'stremeaSQL'@'localhost';

-- Actualizar los privilegios
FLUSH PRIVILEGES;

-- Dump completed on 2023-06-08 10:10:03