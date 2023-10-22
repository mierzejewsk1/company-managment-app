-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 22, 2023 at 06:07 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `company_managment`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `c_user_types`
--

CREATE TABLE `c_user_types` (
  `userTypeID` tinyint(4) NOT NULL,
  `userTypeName` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `c_user_types`
--

INSERT INTO `c_user_types` (`userTypeID`, `userTypeName`) VALUES
(1, 'Admin'),
(3, 'User'),
(2, 'Worker');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `o_users`
--

CREATE TABLE `o_users` (
  `userID` int(11) NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `userPassword` varchar(60) NOT NULL,
  `userToken` varchar(255) DEFAULT NULL,
  `userResetPasswordToken` varchar(255) DEFAULT NULL,
  `userTypeID` tinyint(4) DEFAULT NULL,
  `userName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `o_users`
--

INSERT INTO `o_users` (`userID`, `userEmail`, `userPassword`, `userToken`, `userResetPasswordToken`, `userTypeID`, `userName`) VALUES
(1, 'user1@example.com', '$2a$10$qYDGMo0kud3YCclCZsxM4OfV6MeTiwMveoenoHOLeiSxpDiWpWLPa', NULL, 'resetToken1', 1, 'UserName1'),
(2, 'user2@example.com', 'hashedPassword2', 'randomToken2', 'resetToken2', 2, 'UserName2'),
(3, 'user3@example.com', '$2a$12$Y5rO4nwzrylAfExxFl9QQeLw1oDDXgafLBaGAybGIbLMjv1jzT/eS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImlhdCI6MTY5Nzk3NzYxMiwiZXhwIjoxNjk4MDY0MDEyfQ.kdJJSJQ43w2ZBrR2gPAhCMbJosw2ZjdhlinnJXOBwOg', 'resetToken3', 1, 'UserName3'),
(4, 'user4@example.com', 'hashedPassword4', 'randomToken4', 'resetToken4', 2, 'UserName4'),
(7, 'user5@example.com', '$2b$10$royxE56XhVsb1LS9wtN3ZOIZjeoBhINK8QpCCD6oe5myyNdicQQDe', NULL, NULL, 2, 'Marcin'),
(8, 'user6@example.com', '$2b$10$3nJ8WaRzXVcqlKAFeMJhh.R2lDpCgkp3/39gaNyXan7pHJxZeV.HO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjgsImlhdCI6MTY5NzkxMTkyMSwiZXhwIjoxNjk3OTk4MzIxfQ.Nq9UbRm2vnuUkKmWsfjiyLPQg2OIxZZIsQmzJAgwhiU', NULL, 2, 'Jakub');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `o_workspaces`
--

CREATE TABLE `o_workspaces` (
  `workspaceID` smallint(5) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED DEFAULT NULL,
  `workspaceNumber` smallint(6) NOT NULL,
  `insertTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `o_workspaces`
--

INSERT INTO `o_workspaces` (`workspaceID`, `userID`, `workspaceNumber`, `insertTimestamp`) VALUES
(1, 2, 1, '2023-10-22 12:07:43'),
(2, NULL, 2, '2023-10-22 12:07:43'),
(3, NULL, 3, '2023-10-22 12:07:43'),
(4, NULL, 4, '2023-10-22 12:07:43'),
(5, NULL, 5, '2023-10-22 12:07:43'),
(6, NULL, 6, '2023-10-22 12:07:43'),
(7, NULL, 7, '2023-10-22 12:07:43'),
(8, NULL, 8, '2023-10-22 12:07:43'),
(9, NULL, 9, '2023-10-22 12:07:43'),
(10, NULL, 10, '2023-10-22 12:07:43');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `c_user_types`
--
ALTER TABLE `c_user_types`
  ADD PRIMARY KEY (`userTypeID`),
  ADD UNIQUE KEY `userTypeName` (`userTypeName`);

--
-- Indeksy dla tabeli `o_users`
--
ALTER TABLE `o_users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userEmail` (`userEmail`),
  ADD KEY `userTypeID` (`userTypeID`);

--
-- Indeksy dla tabeli `o_workspaces`
--
ALTER TABLE `o_workspaces`
  ADD PRIMARY KEY (`workspaceID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `c_user_types`
--
ALTER TABLE `c_user_types`
  MODIFY `userTypeID` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `o_users`
--
ALTER TABLE `o_users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `o_workspaces`
--
ALTER TABLE `o_workspaces`
  MODIFY `workspaceID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `o_users`
--
ALTER TABLE `o_users`
  ADD CONSTRAINT `o_users_ibfk_1` FOREIGN KEY (`userTypeID`) REFERENCES `c_user_types` (`userTypeID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
