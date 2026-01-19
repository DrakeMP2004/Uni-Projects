-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 02, 2024 at 10:26 PM
-- Server version: 10.3.31-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs230_u230361`
--

-- --------------------------------------------------------

-- Taken influence from https://www.youtube.com/watch?v=LIoIg3DWxFA
--
-- Table structure for table `Addresses`
--

CREATE TABLE `Addresses` (
  `AddressID` int(11) NOT NULL,
  `AddressLine1` varchar(30) NOT NULL,
  `AddressLine2` varchar(30) NOT NULL,
  `Town` varchar(30) NOT NULL,
  `CountyOrCity` varchar(30) NOT NULL,
  `Eircode` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Addresses`
--

INSERT INTO `Addresses` (`AddressID`, `AddressLine1`, `AddressLine2`, `Town`, `CountyOrCity`, `Eircode`) VALUES
(1, '23', 'Westlook View', 'Maynooth', 'Co. Kildare', 'W27V1B0'),
(2, '45', 'St. Catherine\'s Square', 'Blanchardstown', 'Co. Dublin', 'W46V7K9'),
(3, '789 Oak St', 'Suite 201', 'Swords', 'Dublin City', 'G90HI12'),
(10, '41', 'Easton Martin Park', 'Lucan', 'Co. Dublin', 'W89N0J7'),
(11, '34', 'Parkers Avenue', 'Liffey Valley', 'Co. Dublin', 'W45R7Y3'),
(13, '9', 'Johanstown Street', 'Blanchardstown', 'Co. Dublin', 'W90N0M1');

-- --------------------------------------------------------

--
-- Table structure for table `PersonalInformation`
--

CREATE TABLE `PersonalInformation` (
  `UserID` int(11) NOT NULL,
  `Title` varchar(10) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `Surname` varchar(30) NOT NULL,
  `MobileNumber` varchar(10) NOT NULL,
  `EmailAddress` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `PersonalInformation`
--

INSERT INTO `PersonalInformation` (`UserID`, `Title`, `FirstName`, `Surname`, `MobileNumber`, `EmailAddress`) VALUES
(1, 'Mr.', 'John', 'Simpson', '0864213579', 'john@outlook.com'),
(2, 'Mrs.', 'Maria', 'Lenon', '0864208642', 'maria@gmail.com'),
(3, 'Mr', 'Ned', 'Reeds', '5556667777', 'ned@gmail.com'),
(12, 'Miss', 'Maddie', 'Richter', '0864297531', 'maddie@outlook.ie'),
(13, 'Mr.', 'Nigel', 'Sweeney', '0864224680', 'nigel@outlook.com'),
(15, 'Dr.', 'Maxwell', 'Howards', '0864297531', 'maxwell@outlook.ie');

-- --------------------------------------------------------

--
-- Table structure for table `UserAddresses`
--

CREATE TABLE `UserAddresses` (
  `UserID` int(11) NOT NULL,
  `AddressID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `UserAddresses`
--

INSERT INTO `UserAddresses` (`UserID`, `AddressID`) VALUES
(1, 1),
(2, 2),
(3, 3),
(12, 10),
(13, 11),
(15, 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Addresses`
--
ALTER TABLE `Addresses`
  ADD PRIMARY KEY (`AddressID`),
  ADD UNIQUE KEY `Address` (`Eircode`);

--
-- Indexes for table `PersonalInformation`
--
ALTER TABLE `PersonalInformation`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Name` (`Title`,`FirstName`,`Surname`) USING BTREE,
  ADD UNIQUE KEY `ContactDetails` (`MobileNumber`,`EmailAddress`) USING BTREE;

--
-- Indexes for table `UserAddresses`
--
ALTER TABLE `UserAddresses`
  ADD KEY `UserIDCon` (`UserID`),
  ADD KEY `AddressIDCon` (`AddressID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Addresses`
--
ALTER TABLE `Addresses`
  MODIFY `AddressID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `PersonalInformation`
--
ALTER TABLE `PersonalInformation`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `UserAddresses`
--
ALTER TABLE `UserAddresses`
  ADD CONSTRAINT `AddressIDCon` FOREIGN KEY (`AddressID`) REFERENCES `Addresses` (`AddressID`),
  ADD CONSTRAINT `UserIDCon` FOREIGN KEY (`UserID`) REFERENCES `PersonalInformation` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
