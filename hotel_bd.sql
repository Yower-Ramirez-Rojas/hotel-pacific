-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para hotel_bd
CREATE DATABASE IF NOT EXISTS `hotel_bd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel_bd`;

-- Volcando estructura para tabla hotel_bd.habitaciones
CREATE TABLE IF NOT EXISTS `habitaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla hotel_bd.habitaciones: ~12 rows (aproximadamente)
INSERT INTO `habitaciones` (`id`, `numero`, `tipo`, `disponible`) VALUES
	(1, '101', 'Sencilla', 0),
	(2, '102', 'Sencilla', 1),
	(3, '103', 'Sencilla', 1),
	(4, '104', 'Sencilla', 1),
	(5, '201', 'Doble', 1),
	(6, '202', 'Doble', 0),
	(7, '203', 'Doble', 1),
	(8, '204', 'Doble', 1),
	(9, '301', 'Suite', 1),
	(10, '302', 'Suite', 0),
	(11, '303', 'Suite', 1),
	(12, '304', 'Suite', 1);

-- Volcando estructura para tabla hotel_bd.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` int DEFAULT NULL,
  `pago` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rut` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla hotel_bd.reservas: ~3 rows (aproximadamente)
INSERT INTO `reservas` (`id`, `numero`, `pago`, `nombre`, `apellido`, `rut`, `telefono`, `fecha_ingreso`) VALUES
	(6, 202, 'efectivo', 'yower', 'rojas', '26.649.867-5', '964034821', '2027-02-05'),
	(7, 101, 'tarjeta', 'juan', 'perez', '227759941', '960034286', '2026-06-06'),
	(8, 302, 'paypal', 'lionel', 'messi', '2277599456', '988559967', '2026-08-22');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
