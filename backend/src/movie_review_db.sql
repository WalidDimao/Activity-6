-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 12:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movie_review_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `release_year` int(11) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `release_year`, `director`, `duration_minutes`, `genre`, `poster_url`, `created_at`, `updated_at`) VALUES
(7, 'Inception', 'A science fiction action film where a skilled thief, who steals secrets by entering people’s dreams, is given a chance to have his criminal record erased if he can successfully implant an idea into someone’s subconscious.', 2010, 'Christopher Nolan', 148, 'Science Fiction, Action, Thriller', NULL, '2025-12-06 00:27:44.246966', '2025-12-06 00:27:44.246966'),
(10, 'The Karate Kid (2010)', 'A young boy moves to China and learns kung fu from a skilled mentor to defend himself against bullies and compete in a martial arts tournament, blending action with a coming-of-age story.', 2010, 'Harald Zwart', 140, 'Action, Drama, Family, Sports', NULL, '2025-12-06 00:35:16.796906', '2025-12-06 00:35:16.796906'),
(13, 'Parasite', 'A poor family schemes to become employed by a wealthy household, but their plan spirals into unexpected chaos and suspense.', 2019, 'Bong Joon-ho', 132, 'Drama / Thriller', NULL, '2025-12-07 11:46:40.809060', '2025-12-07 11:46:40.809060'),
(14, 'Interstellar', 'A team of astronauts travels through a wormhole in search of a new home for humanity as Earth becomes uninhabitable.', 2014, 'Christopher Nolan', 169, 'Science Fiction / Adventure', NULL, '2025-12-07 11:48:23.910588', '2025-12-07 11:48:23.910588');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `movie_id`, `user_name`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(7, 7, 'walid', 5, 'magaling yung bida', '2025-12-06 00:31:02.260187', '2025-12-06 00:31:02.260187'),
(10, 10, 'walid', 3, 'jackie chan nayan eh', '2025-12-06 00:36:32.940844', '2025-12-06 00:36:32.940844'),
(13, 13, 'walid', 4, 'Great movie—smart, intense, and very well made.', '2025-12-07 11:47:30.011283', '2025-12-07 11:47:30.011283');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_563501cf3faa75a1ca40be84f82` (`movie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK_563501cf3faa75a1ca40be84f82` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
