-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 20, 2022 at 02:19 PM
-- Server version: 10.5.11-MariaDB
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `express_project`
--
CREATE DATABASE IF NOT EXISTS `express_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `express_project`;

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `id` int(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `status` set('on','off') NOT NULL DEFAULT 'on,off',
  `schedule_start` set('on','off') DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `program` varchar(16) DEFAULT NULL,
  `silent_mode` set('on','off') DEFAULT NULL,
  `ionization_mode` set('on','off') DEFAULT NULL,
  `air_conditioning` set('on','off') DEFAULT NULL,
  `flow_temperature,_°C` varchar(16) DEFAULT NULL,
  `brightness,_%` varchar(16) DEFAULT NULL,
  `lights_color` varchar(7) DEFAULT NULL,
  `speed,_RPM` varchar(16) DEFAULT NULL,
  `resolution` set('320p','480p','720p','1080p') DEFAULT NULL,
  `night_mode` set('on','off') DEFAULT NULL,
  `password` varchar(16) DEFAULT NULL,
  `force_lock` set('on','off') DEFAULT NULL,
  `blinds` set('open','close') DEFAULT NULL,
  `flow_rate,_%` varchar(16) DEFAULT NULL,
  `section_1_temperature,_°C` varchar(16) DEFAULT NULL,
  `section_2_temperature,_°C` varchar(16) DEFAULT NULL,
  `section_3_temperature,_°C` varchar(16) DEFAULT NULL,
  `freezer_temperature,_°C` varchar(16) DEFAULT NULL,
  `ice_maker` set('on','off') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `delicate_mode` set('on','off') DEFAULT NULL,
  `alarm_clock` set('on','off') DEFAULT NULL,
  `alarm_time` time(6) DEFAULT NULL,
  `wattage,_W` varchar(16) DEFAULT NULL,
  `steam_preheat` set('on','off') DEFAULT NULL,
  `processor_setting` set('low','high','pulse') DEFAULT NULL,
  `channel` varchar(16) DEFAULT NULL,
  `volume,_%` varchar(16) DEFAULT NULL,
  `schedule_stop` set('on','off') DEFAULT NULL,
  `stop_time` datetime(6) DEFAULT NULL,
  `find/play_track` varchar(64) DEFAULT NULL,
  `auto_play` set('on','off') DEFAULT NULL,
  `bass_boost` set('on','off') DEFAULT NULL,
  `activate_camera` set('on','off') DEFAULT NULL,
  `activate_voice_channel` set('on','off') DEFAULT NULL,
  `portion_size,_g` varchar(16) DEFAULT NULL,
  `energy_save_mode` set('on','off') DEFAULT NULL,
  `section_1_firmness` set('soft','medium','firm') DEFAULT NULL,
  `section_2_firmness` set('soft','medium','firm') DEFAULT NULL,
  `track_heartbeat` set('on','off') DEFAULT NULL,
  `activate_security_system` set('on','off') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`id`, `name`, `type`, `status`, `schedule_start`, `start_time`, `program`, `silent_mode`, `ionization_mode`, `air_conditioning`, `flow_temperature,_°C`, `brightness,_%`, `lights_color`, `speed,_RPM`, `resolution`, `night_mode`, `password`, `force_lock`, `blinds`, `flow_rate,_%`, `section_1_temperature,_°C`, `section_2_temperature,_°C`, `section_3_temperature,_°C`, `freezer_temperature,_°C`, `ice_maker`, `notes`, `delicate_mode`, `alarm_clock`, `alarm_time`, `wattage,_W`, `steam_preheat`, `processor_setting`, `channel`, `volume,_%`, `schedule_stop`, `stop_time`, `find/play_track`, `auto_play`, `bass_boost`, `activate_camera`, `activate_voice_channel`, `portion_size,_g`, `energy_save_mode`, `section_1_firmness`, `section_2_firmness`, `track_heartbeat`, `activate_security_system`) VALUES
(100, 'SmartWateringSystem001', 'Sprinkler', 'on', 'on', '2022-02-27 16:44:00', '3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', '2022-02-28 13:41:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, 'CleanHouseDisher', 'Dishwater', 'on', 'on', '2021-12-30 18:40:00', '3', 'on', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, 'Cooker007', 'Food processor', 'on', NULL, NULL, '4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'high', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, 'BabyMonitor3000', 'Baby monitor', 'on', 'on', '2021-12-24 23:06:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1080p', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', '2021-12-30 00:07:00.000000', NULL, NULL, NULL, 'on', 'on', NULL, NULL, NULL, NULL, 'on', NULL),
(105, 'SuperFan', 'Fan', 'on', NULL, NULL, NULL, 'off', NULL, NULL, NULL, NULL, NULL, '600', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, 'testTest', 'Baby monitor', 'on', 'off', '2021-12-16 22:57:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '480p', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on', '2021-12-16 22:57:00.000000', NULL, NULL, NULL, 'off', 'on', NULL, NULL, NULL, NULL, 'off', NULL),
(111, 'testDevice', 'Bed', 'on', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '24', '12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'soft', 'firm', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `type` varchar(50) NOT NULL,
  `status[radio]` set('on','off') NOT NULL DEFAULT 'on,off',
  `schedule_start[radio]` set('on','off') DEFAULT NULL,
  `start_time[datetime]` datetime DEFAULT NULL,
  `program[range]` varchar(16) DEFAULT NULL,
  `silent_mode[radio]` set('on','off') DEFAULT NULL,
  `ionization_mode[radio]` set('on','off') DEFAULT NULL,
  `air_conditioning[radio]` set('on','off') DEFAULT NULL,
  `flow_temperature,_°C[range]` varchar(16) DEFAULT NULL,
  `brightness,_%[range]` varchar(16) DEFAULT NULL,
  `lights_color[color]` varchar(7) DEFAULT NULL,
  `speed,_RPM[range]` varchar(16) DEFAULT NULL,
  `resolution[radio]` set('320p','480p','720p','1080p') DEFAULT NULL,
  `night_mode[radio]` set('on','off') DEFAULT NULL,
  `password[text]` varchar(16) DEFAULT NULL,
  `force_lock[radio]` set('on','off') DEFAULT NULL,
  `blinds[radio]` set('open','close') DEFAULT NULL,
  `flow_rate,_%[range]` varchar(16) DEFAULT NULL,
  `section_1_temperature,_°C[range]` varchar(16) DEFAULT NULL,
  `section_2_temperature,_°C[range]` varchar(16) DEFAULT NULL,
  `section_3_temperature,_°C[range]` varchar(16) DEFAULT NULL,
  `freezer_temperature,_°C[range]` varchar(16) DEFAULT NULL,
  `ice_maker[radio]` set('on','off') DEFAULT NULL,
  `notes[text]` varchar(255) DEFAULT NULL,
  `delicate_mode[radio]` set('on','off') DEFAULT NULL,
  `alarm_clock[radio]` set('on','off') DEFAULT NULL,
  `alarm_time[time]` time(6) DEFAULT NULL,
  `wattage,_W[range]` varchar(16) DEFAULT NULL,
  `steam_preheat[radio]` set('on','off') DEFAULT NULL,
  `processor_setting[radio]` set('low','high','pulse') DEFAULT NULL,
  `channel[range]` varchar(16) DEFAULT NULL,
  `volume,_%[range]` varchar(16) DEFAULT NULL,
  `schedule_stop[radio]` set('on','off') DEFAULT NULL,
  `stop_time[datetime]` datetime(6) DEFAULT NULL,
  `find/play_track[text]` varchar(64) DEFAULT NULL,
  `auto_play[radio]` set('on','off') DEFAULT NULL,
  `bass_boost[radio]` set('on','off') DEFAULT NULL,
  `activate_camera[radio]` set('on','off') DEFAULT NULL,
  `activate_voice_channel[radio]` set('on','off') DEFAULT NULL,
  `portion_size,_g[range]` varchar(16) DEFAULT NULL,
  `energy_save_mode[radio]` set('on','off') DEFAULT NULL,
  `section_1_firmness[radio]` set('soft','medium','firm') DEFAULT NULL,
  `section_2_firmness[radio]` set('soft','medium','firm') DEFAULT NULL,
  `track_heartbeat[radio]` set('on','off') DEFAULT NULL,
  `activate_security_system[radio]` set('on','off') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`type`, `status[radio]`, `schedule_start[radio]`, `start_time[datetime]`, `program[range]`, `silent_mode[radio]`, `ionization_mode[radio]`, `air_conditioning[radio]`, `flow_temperature,_°C[range]`, `brightness,_%[range]`, `lights_color[color]`, `speed,_RPM[range]`, `resolution[radio]`, `night_mode[radio]`, `password[text]`, `force_lock[radio]`, `blinds[radio]`, `flow_rate,_%[range]`, `section_1_temperature,_°C[range]`, `section_2_temperature,_°C[range]`, `section_3_temperature,_°C[range]`, `freezer_temperature,_°C[range]`, `ice_maker[radio]`, `notes[text]`, `delicate_mode[radio]`, `alarm_clock[radio]`, `alarm_time[time]`, `wattage,_W[range]`, `steam_preheat[radio]`, `processor_setting[radio]`, `channel[range]`, `volume,_%[range]`, `schedule_stop[radio]`, `stop_time[datetime]`, `find/play_track[text]`, `auto_play[radio]`, `bass_boost[radio]`, `activate_camera[radio]`, `activate_voice_channel[radio]`, `portion_size,_g[range]`, `energy_save_mode[radio]`, `section_1_firmness[radio]`, `section_2_firmness[radio]`, `track_heartbeat[radio]`, `activate_security_system[radio]`) VALUES
('Air purifier', 'on,off', NULL, NULL, '1,3,1', NULL, 'on,off', NULL, NULL, NULL, '#429BB8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Baby monitor', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '320p,480p,720p,1080p', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, 'on,off', 'on,off', NULL, NULL, NULL, NULL, 'on,off', NULL),
('Bed', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '12,24,0.5', '12,24,0.5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'soft,medium,firm', 'soft,medium,firm', NULL, NULL),
('Car', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '15,40,1', '15,40,1', '15,40,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', 'Track name - Author,64', 'on,off', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off'),
('Coffee maker', 'on,off', NULL, NULL, '1,7,1', NULL, NULL, NULL, '85,98,0.1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Dishwater', 'on,off', 'on,off', '0000-00-00 00:00:00', '1,3,1', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Display', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, '0,100,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1,99,1', '0,100,1', 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Door', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'def_pass_123,16', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Fan', 'on,off', NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, '300,600,10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Faucet', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, '15,40,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Food processor', 'on,off', NULL, NULL, '1,5,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'low,high,pulse', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Microwave', 'on,off', NULL, NULL, '1,11,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '00:00:00.000000', '300,900,150', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Oven', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '50,250,10', '50,250,10', '120,280,10', NULL, NULL, NULL, NULL, 'on,off', '00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Personal computer', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', 'on,off', '0000-00-00 00:00:00.000000', 'Track name - Author,64', 'on,off', 'on,off', NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL),
('Refrigerator', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,10,0.5', '0,10,0.5', '0,10,0.5', '-25,0,0.5', 'on,off', 'Sample note - write something here...,255', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL),
('Security camera', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '320p,480p,720p,1080p', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1,9,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off'),
('Smart lighting', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', '#F4E98C', NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL),
('Smart outlet', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL),
('Smart pet system (feeder, camera)', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '320p,480p,720p,1080p', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, 'on,off', 'on,off', '40,120,5', NULL, NULL, NULL, NULL, NULL),
('Speaker', 'on,off', 'on,off', '0000-00-00 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', 'on,off', '0000-00-00 00:00:00.000000', 'Track name - Author,64', 'on,off', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Sprinkler', 'on,off', 'on,off', '0000-00-00 00:00:00', '1,3,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0,100,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Thermostat', 'on,off', NULL, NULL, NULL, NULL, NULL, 'on,off', '17,30,0.1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Treadmill', 'on,off', NULL, NULL, '1,9,1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Track name - Author,64', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL),
('Vacuum', 'on,off', 'on,off', '0000-00-00 00:00:00', '1,3,1', 'on,off', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Washing machine', 'on,off', 'on,off', '0000-00-00 00:00:00', '1,14,1', NULL, NULL, NULL, '0,70,5', NULL, NULL, '600,1500,150', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', '0000-00-00 00:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Window', 'on,off', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'on,off', 'open,close', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
