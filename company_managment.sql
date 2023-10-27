-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 27, 2023 at 06:43 PM
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
-- Struktura tabeli dla tabeli `c_target_groups`
--

CREATE TABLE `c_target_groups` (
  `targetGroupID` tinyint(3) UNSIGNED NOT NULL,
  `targetGroupName` tinytext NOT NULL,
  `insertTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `c_target_groups`
--

INSERT INTO `c_target_groups` (`targetGroupID`, `targetGroupName`, `insertTimestamp`) VALUES
(1, 'Wszyscy', '2023-10-25 16:01:13'),
(2, 'Administratorzy', '2023-10-25 16:01:13'),
(3, 'Pracownicy', '2023-10-25 16:01:13');

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
-- Struktura tabeli dla tabeli `o_messages`
--

CREATE TABLE `o_messages` (
  `messageID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `recipientID` int(10) UNSIGNED NOT NULL,
  `messageDescription` text NOT NULL,
  `insertTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `o_messages`
--

INSERT INTO `o_messages` (`messageID`, `userID`, `recipientID`, `messageDescription`, `insertTimestamp`) VALUES
(2, 3, 14, 'A to kolejna wiadomość w konwersacji do mojego ziomeczka', '2023-10-27 15:47:51'),
(3, 14, 3, 'A to jest wiadomość do admina o id 3 czyli w drugą strone', '2023-10-27 15:51:03'),
(6, 2, 4, 'wwewww', '2023-10-27 16:38:22');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `o_news`
--

CREATE TABLE `o_news` (
  `newsID` int(10) UNSIGNED NOT NULL,
  `newsDescription` mediumtext NOT NULL,
  `targetGroupID` tinyint(4) NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `insertTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `o_news`
--

INSERT INTO `o_news` (`newsID`, `newsDescription`, `targetGroupID`, `userID`, `insertTimestamp`) VALUES
(1, 'Ogłoszenie tylko dla administratorów. Zwykli użytkownicy nie powinni tego widzieć', 2, 3, '2023-10-25 16:05:32'),
(2, 'Ogłoszenie dla wszystkich pracowników. Powinni to widzieć administratorzy oraz zwykli pracownicy', 1, 3, '2023-10-25 16:05:32');

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
(1, 'user1@example.com', '$2a$10$qYDGMo0kud3YCclCZsxM4OfV6MeTiwMveoenoHOLeiSxpDiWpWLPa', NULL, 'resetToken1', 1, 'Marcin Mierzej'),
(2, 'user2@example.com', 'hashedPassword2', 'randomToken2', 'resetToken2', 2, 'UserName2'),
(3, 'user3@example.com', '$2a$12$Y5rO4nwzrylAfExxFl9QQeLw1oDDXgafLBaGAybGIbLMjv1jzT/eS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImlhdCI6MTY5ODQyMjMxMywiZXhwIjoxNjk4NTA4NzEzfQ.YKkuyU2iU2fNXVZh_B7CeigeZNMp2KjAUK4tR0BlNOg', 'resetToken3', 1, 'UserName3'),
(4, 'user4@example.com', 'hashedPassword4', 'randomToken4', 'resetToken4', 2, 'UserName4'),
(7, 'user5@example.com', '$2b$10$royxE56XhVsb1LS9wtN3ZOIZjeoBhINK8QpCCD6oe5myyNdicQQDe', NULL, NULL, 2, 'Marcin'),
(8, 'user6@example.com', '$2b$10$3nJ8WaRzXVcqlKAFeMJhh.R2lDpCgkp3/39gaNyXan7pHJxZeV.HO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjgsImlhdCI6MTY5NzkxMTkyMSwiZXhwIjoxNjk3OTk4MzIxfQ.Nq9UbRm2vnuUkKmWsfjiyLPQg2OIxZZIsQmzJAgwhiU', NULL, 2, 'Jakub'),
(14, 'testowy@example.com', '$2b$10$u3aIgIfT71AtiwzQ7QJk2updbHseQ0.rZOtC6CgJhIt9r/K3ZPoPm', NULL, NULL, 2, 'testowy');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `o_workspaces`
--

CREATE TABLE `o_workspaces` (
  `workspaceID` smallint(5) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED DEFAULT NULL,
  `workspaceNumber` smallint(6) NOT NULL,
  `isAvailable` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  `insertTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `o_workspaces`
--

INSERT INTO `o_workspaces` (`workspaceID`, `userID`, `workspaceNumber`, `isAvailable`, `insertTimestamp`) VALUES
(1, 2, 1, 1, '2023-10-22 12:07:43'),
(2, NULL, 2, 1, '2023-10-22 12:07:43'),
(3, NULL, 3, 1, '2023-10-22 12:07:43'),
(4, NULL, 4, 1, '2023-10-22 12:07:43'),
(5, NULL, 5, 1, '2023-10-22 12:07:43'),
(6, 7, 6, 1, '2023-10-22 12:07:43'),
(7, NULL, 7, 1, '2023-10-22 12:07:43'),
(8, NULL, 8, 1, '2023-10-22 12:07:43'),
(9, NULL, 9, 1, '2023-10-22 12:07:43'),
(10, NULL, 10, 1, '2023-10-22 12:07:43');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `c_target_groups`
--
ALTER TABLE `c_target_groups`
  ADD PRIMARY KEY (`targetGroupID`);

--
-- Indeksy dla tabeli `c_user_types`
--
ALTER TABLE `c_user_types`
  ADD PRIMARY KEY (`userTypeID`),
  ADD UNIQUE KEY `userTypeName` (`userTypeName`);

--
-- Indeksy dla tabeli `o_messages`
--
ALTER TABLE `o_messages`
  ADD PRIMARY KEY (`messageID`);

--
-- Indeksy dla tabeli `o_news`
--
ALTER TABLE `o_news`
  ADD PRIMARY KEY (`newsID`);

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
-- AUTO_INCREMENT for table `c_target_groups`
--
ALTER TABLE `c_target_groups`
  MODIFY `targetGroupID` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `c_user_types`
--
ALTER TABLE `c_user_types`
  MODIFY `userTypeID` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `o_messages`
--
ALTER TABLE `o_messages`
  MODIFY `messageID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `o_news`
--
ALTER TABLE `o_news`
  MODIFY `newsID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `o_users`
--
ALTER TABLE `o_users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
