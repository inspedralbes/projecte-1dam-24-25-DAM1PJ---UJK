-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Temps de generació: 28-04-2025 a les 10:27:10
-- Versió del servidor: 8.0.41-0ubuntu0.22.04.1
-- Versió de PHP: 8.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `a24javaguper_UKJ`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `actuacions`
--

CREATE TABLE `actuacions` (
  `id_actuació` tinyint NOT NULL,
  `id_incidencia` tinyint DEFAULT NULL,
  `id_usuari` smallint DEFAULT NULL,
  `data_actuacio` datetime NOT NULL,
  `descripcio` tinytext,
  `finaliza_actuació` datetime NOT NULL,
  `id_tecnic` smallint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `departaments`
--

CREATE TABLE `departaments` (
  `id_departament` smallint NOT NULL,
  `nom` tinytext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `incidencia`
--

CREATE TABLE `incidencia` (
  `id_incidencia` tinyint NOT NULL,
  `descripcio` tinytext,
  `creada` datetime NOT NULL,
  `estat` tinyint(1) DEFAULT NULL,
  `prioritat` enum('Baja','Media','Alta','Crítica') NOT NULL,
  `ubicacio` tinytext NOT NULL,
  `id_tipus` tinyint DEFAULT NULL,
  `id_usuari` smallint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `tecnic`
--

CREATE TABLE `tecnic` (
  `id_tecnic` smallint NOT NULL,
  `nom` tinytext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `tipus`
--

CREATE TABLE `tipus` (
  `id_tipus` tinyint NOT NULL,
  `nom` tinytext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `usuari`
--

CREATE TABLE `usuari` (
  `id_usuari` smallint NOT NULL,
  `nom` tinytext,
  `rol` enum('Alumno','Profesor','Tecnico') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_departament` smallint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `actuacions`
--
ALTER TABLE `actuacions`
  ADD PRIMARY KEY (`id_actuació`),
  ADD KEY `id_incidencia` (`id_incidencia`),
  ADD KEY `id_usuari` (`id_usuari`),
  ADD KEY `fk_actuacions_tecnic` (`id_tecnic`);

--
-- Índexs per a la taula `departaments`
--
ALTER TABLE `departaments`
  ADD PRIMARY KEY (`id_departament`);

--
-- Índexs per a la taula `incidencia`
--
ALTER TABLE `incidencia`
  ADD PRIMARY KEY (`id_incidencia`),
  ADD KEY `id_tipus` (`id_tipus`),
  ADD KEY `id_usuari` (`id_usuari`),
  ADD KEY `creada` (`creada`);

--
-- Índexs per a la taula `tecnic`
--
ALTER TABLE `tecnic`
  ADD PRIMARY KEY (`id_tecnic`);

--
-- Índexs per a la taula `tipus`
--
ALTER TABLE `tipus`
  ADD PRIMARY KEY (`id_tipus`);

--
-- Índexs per a la taula `usuari`
--
ALTER TABLE `usuari`
  ADD PRIMARY KEY (`id_usuari`),
  ADD KEY `id_departament` (`id_departament`);

--
-- AUTO_INCREMENT per les taules bolcades
--

--
-- AUTO_INCREMENT per la taula `actuacions`
--
ALTER TABLE `actuacions`
  MODIFY `id_actuació` tinyint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la taula `departaments`
--
ALTER TABLE `departaments`
  MODIFY `id_departament` smallint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la taula `incidencia`
--
ALTER TABLE `incidencia`
  MODIFY `id_incidencia` tinyint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la taula `tecnic`
--
ALTER TABLE `tecnic`
  MODIFY `id_tecnic` smallint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la taula `tipus`
--
ALTER TABLE `tipus`
  MODIFY `id_tipus` tinyint NOT NULL AUTO_INCREMENT;

--
-- Restriccions per a les taules bolcades
--

--
-- Restriccions per a la taula `actuacions`
--
ALTER TABLE `actuacions`
  ADD CONSTRAINT `actuacions_ibfk_1` FOREIGN KEY (`id_incidencia`) REFERENCES `incidencia` (`id_incidencia`),
  ADD CONSTRAINT `actuacions_ibfk_2` FOREIGN KEY (`id_usuari`) REFERENCES `usuari` (`id_usuari`),
  ADD CONSTRAINT `fk_actuacions_tecnic` FOREIGN KEY (`id_tecnic`) REFERENCES `tecnic` (`id_tecnic`);

--
-- Restriccions per a la taula `incidencia`
--
ALTER TABLE `incidencia`
  ADD CONSTRAINT `incidencia_ibfk_1` FOREIGN KEY (`id_tipus`) REFERENCES `tipus` (`id_tipus`),
  ADD CONSTRAINT `incidencia_ibfk_2` FOREIGN KEY (`id_usuari`) REFERENCES `usuari` (`id_usuari`);

--
-- Restriccions per a la taula `tecnic`
--
ALTER TABLE `tecnic`
  ADD CONSTRAINT `tecnic_ibfk_1` FOREIGN KEY (`id_tecnic`) REFERENCES `actuacions` (`id_tecnic`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Restriccions per a la taula `usuari`
--
ALTER TABLE `usuari`
  ADD CONSTRAINT `usuari_ibfk_1` FOREIGN KEY (`id_departament`) REFERENCES `departaments` (`id_departament`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
