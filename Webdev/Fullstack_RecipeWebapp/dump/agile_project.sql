-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 31, 2022 at 05:38 PM
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
-- Database: `agile_project`
--
CREATE DATABASE IF NOT EXISTS `agile_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `agile_project`;

-- --------------------------------------------------------

--
-- Table structure for table `diets`
--

CREATE TABLE `diets` (
  `diet_id` int(11) NOT NULL,
  `diet_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `diets`
--

INSERT INTO `diets` (`diet_id`, `diet_name`) VALUES
(4, 'Atkins'),
(2, 'Ketogenic'),
(3, 'Low carb'),
(7, 'Mediterranean'),
(9, 'No sugar'),
(5, 'Paleo'),
(8, 'Raw'),
(6, 'Vegan'),
(1, 'Vegetarian');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `ingredient_id` int(11) NOT NULL,
  `ingredient_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ingredient_type_id` int(11) NOT NULL,
  `ingredient_availability` tinyint(1) NOT NULL,
  `ingredient_cal_100g` int(5) NOT NULL,
  `ingredient_carbs_100g` decimal(6,2) NOT NULL,
  `ingredient_fats_100g` decimal(6,2) NOT NULL,
  `ingredient_prots_100g` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`ingredient_id`, `ingredient_name`, `ingredient_type_id`, `ingredient_availability`, `ingredient_cal_100g`, `ingredient_carbs_100g`, `ingredient_fats_100g`, `ingredient_prots_100g`) VALUES
(1, 'Potato', 1, 1, 87, '20.13', '0.10', '1.87'),
(2, 'Salt', 7, 1, 0, '0.00', '0.00', '0.00'),
(3, 'Egg, chicken', 5, 1, 147, '0.77', '9.94', '12.58'),
(4, 'Apple', 2, 0, 52, '13.81', '0.17', '0.26'),
(5, 'Butter', 3, 1, 717, '0.06', '81.11', '0.85'),
(6, 'Tomato', 1, 1, 18, '0.20', '3.92', '0.88'),
(7, 'Parsley', 1, 0, 36, '6.33', '0.79', '2.97'),
(8, 'Flour', 4, 1, 364, '76.31', '0.98', '10.33'),
(9, 'Lettuce, romaine', 1, 1, 17, '3.30', '0.30', '1.20'),
(10, 'Cucumber', 1, 1, 15, '3.60', '0.10', '0.70'),
(11, 'Pepper, bell', 1, 1, 32, '7.60', '0.20', '1.00'),
(12, 'Olives, black', 1, 1, 119, '6.50', '11.10', '0.80'),
(13, 'Onion, red', 1, 1, 41, '9.50', '0.20', '1.30'),
(14, 'Oil, olive', 6, 1, 853, '0.00', '100.00', '0.00'),
(15, 'Cheese, feta', 3, 1, 300, '4.80', '24.00', '16.00'),
(16, 'Chicken breast', 5, 1, 172, '0.00', '9.30', '20.90'),
(17, 'Pork, lean', 5, 1, 121, '0.20', '4.00', '21.10'),
(18, 'Beef, lean', 5, 1, 131, '0.00', '5.00', '21.40'),
(19, 'Rice, white', 4, 1, 130, '28.60', '0.20', '2.40'),
(20, 'Oatmeal, dry rolled', 4, 1, 334, '72.60', '2.70', '12.60'),
(21, 'Sugar', 7, 1, 387, '100.00', '0.00', '0.00'),
(22, 'Milk, whole', 3, 1, 42, '5.00', '1.00', '3.40');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient_types`
--

CREATE TABLE `ingredient_types` (
  `ingredient_type_id` int(11) NOT NULL,
  `ingredient_type_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredient_types`
--

INSERT INTO `ingredient_types` (`ingredient_type_id`, `ingredient_type_name`) VALUES
(7, 'Condiments'),
(3, 'Dairy'),
(2, 'Fruits'),
(4, 'Grains'),
(6, 'Oils'),
(5, 'Protein'),
(1, 'Vegetables');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient_unit`
--

CREATE TABLE `ingredient_unit` (
  `ingredient_unit_id` int(10) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `unit_id` int(6) NOT NULL,
  `grams_per_unit` decimal(7,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredient_unit`
--

INSERT INTO `ingredient_unit` (`ingredient_unit_id`, `ingredient_id`, `unit_id`, `grams_per_unit`) VALUES
(1, 1, 1, '1000.00'),
(2, 2, 4, '6.00'),
(3, 1, 3, '453.59'),
(4, 2, 2, '1.00'),
(5, 1, 2, '1.00'),
(6, 3, 2, '1.00'),
(7, 4, 2, '1.00'),
(8, 5, 2, '1.00'),
(9, 6, 2, '1.00'),
(10, 7, 2, '1.00'),
(11, 8, 2, '1.00'),
(12, 1, 6, '173.00'),
(13, 3, 6, '50.00'),
(14, 6, 3, '453.59'),
(15, 4, 6, '200.00'),
(16, 5, 4, '14.00'),
(17, 5, 10, '20.00'),
(18, 4, 3, '453.59'),
(19, 6, 6, '123.00'),
(20, 7, 4, '3.80'),
(21, 7, 6, '10.00'),
(22, 7, 7, '60.00'),
(23, 8, 7, '125.00'),
(24, 8, 9, '28.35'),
(25, 9, 2, '1.00'),
(26, 9, 6, '360.00'),
(27, 9, 7, '36.00'),
(28, 10, 2, '1.00'),
(29, 10, 6, '300.00'),
(30, 10, 7, '105.00'),
(31, 11, 2, '1.00'),
(32, 11, 6, '120.00'),
(33, 11, 7, '150.00'),
(34, 11, 10, '10.00'),
(35, 12, 2, '1.00'),
(36, 12, 6, '8.00'),
(37, 12, 9, '28.35'),
(38, 13, 2, '1.00'),
(39, 13, 6, '110.00'),
(40, 13, 7, '115.00'),
(41, 13, 10, '14.00'),
(42, 14, 2, '1.00'),
(43, 14, 4, '4.50'),
(44, 14, 5, '0.92'),
(45, 14, 7, '216.00'),
(46, 14, 9, '28.35'),
(47, 15, 2, '1.00'),
(48, 15, 7, '150.00'),
(49, 15, 9, '28.35'),
(50, 15, 10, '17.00'),
(51, 16, 2, '1.00'),
(52, 16, 3, '453.59'),
(53, 16, 6, '174.00'),
(54, 16, 9, '28.35'),
(55, 17, 1, '1000.00'),
(56, 17, 2, '1.00'),
(57, 17, 3, '453.59'),
(58, 18, 1, '1000.00'),
(59, 18, 2, '1.00'),
(60, 18, 3, '453.59'),
(61, 19, 2, '1.00'),
(62, 19, 7, '186.00'),
(63, 20, 2, '1.00'),
(64, 20, 4, '5.00'),
(65, 20, 7, '80.00'),
(66, 21, 2, '1.00'),
(67, 21, 4, '6.00'),
(68, 22, 2, '1.00'),
(69, 22, 4, '5.00'),
(70, 22, 5, '1.04'),
(71, 22, 7, '244.00'),
(72, 22, 8, '1030.00'),
(73, 22, 9, '28.35');

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

CREATE TABLE `recipe` (
  `recipe_id` int(11) NOT NULL,
  `recipe_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipe_calorie` int(4) NOT NULL,
  `recipe_carbs` decimal(5,2) NOT NULL,
  `recipe_fats` decimal(5,2) NOT NULL,
  `recipe_prots` decimal(5,2) NOT NULL,
  `recipe_preptime` int(4) NOT NULL,
  `recipe_description` varchar(8000) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`recipe_id`, `recipe_name`, `recipe_calorie`, `recipe_carbs`, `recipe_fats`, `recipe_prots`, `recipe_preptime`, `recipe_description`) VALUES
(1, 'Boiled potato', 211, '19.52', '2.24', '1.81', 20, 'Very boiled potato - much taste - great eat'),
(2, 'Scrambled eggs', 148, '2.08', '16.18', '13.84', 5, 'Scrambled eggs is a dish made from eggs (usually chicken eggs) stirred, whipped or beaten together while being gently heated, typically with salt, butter, oil and sometimes other ingredients.'),
(3, 'Apple pie', 460, '37.10', '12.50', '2.40', 145, 'This is absolutely the best homemade apple pie youll ever make! It has a flaky, buttery crust and a tender, lightly-spiced apple pie filling. Use a combination of apples for best flavor, and bake until the top is golden and the filling is bubbly!'),
(4, 'Greek salad', 84, '4.19', '7.23', '2.73', 20, 'Greek salad is a popular salad in Greek cuisine generally made with pieces of tomatoes, cucumbers, onion, feta cheese (usually served as a slice on top of the other ingredients), and olives (typically Kalamata olives) and dressed with salt, Greek oregano, and olive oil. Common additions include green bell pepper slices or caper berries (especially on the Dodecanese islands). Greek salad is often imagined as a farmer\'s breakfast or lunch, as its ingredients resemble those that a Greek farmer might have on hand. (Wiki)'),
(5, 'Pancakes', 389, '67.48', '8.63', '8.98', 20, 'A pancake (or hot-cake, griddlecake, or flapjack) is a flat cake, often thin and round, prepared from a starch-based batter that may contain eggs, milk and butter and cooked on a hot surface such as a griddle or frying pan, often frying with oil or butter. It is a type of batter bread. Archaeological evidence suggests that pancakes were probably eaten in prehistoric societies. (Wiki)'),
(6, 'Beef with rice', 145, '15.23', '4.43', '10.56', 40, 'Simple yet tasty dish. You can spice the things up and add black pepper, cinnamon and even nuts!'),
(7, 'Muffins', 274, '32.24', '11.85', '10.24', 40, 'Simple, satisfying, and made with pantry staples, this Oatmeal Muffins recipe makes for a great breakfast or quick afternoon snack.'),
(8, 'Mashed potatoes', 86, '19.75', '0.11', '1.89', 90, 'Grandma style mashed potatoes with simple parsley for the taste.');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_diet`
--

CREATE TABLE `recipe_diet` (
  `recipe_diet_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `diet_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipe_diet`
--

INSERT INTO `recipe_diet` (`recipe_diet_id`, `recipe_id`, `diet_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 2, 2),
(4, 3, 3),
(25, 4, 1),
(26, 4, 2),
(27, 4, 3),
(28, 4, 7),
(29, 4, 8),
(30, 4, 9),
(31, 5, 1),
(32, 6, 4),
(33, 6, 5),
(34, 7, 1),
(35, 8, 6);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredient`
--

CREATE TABLE `recipe_ingredient` (
  `recipe_ingredient_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `ingredient_amount` decimal(5,2) NOT NULL,
  `unit_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipe_ingredient`
--

INSERT INTO `recipe_ingredient` (`recipe_ingredient_id`, `recipe_id`, `ingredient_id`, `ingredient_amount`, `unit_id`) VALUES
(1, 1, 1, '5.00', 3),
(2, 1, 2, '1.00', 4),
(3, 1, 5, '200.00', 5),
(4, 1, 7, '5.00', 2),
(5, 2, 3, '100.00', 2),
(6, 2, 6, '50.00', 2),
(7, 2, 7, '10.00', 2),
(8, 3, 8, '350.00', 2),
(9, 3, 4, '1.20', 1),
(10, 3, 2, '2.00', 4),
(51, 4, 9, '1.00', 6),
(52, 4, 10, '1.00', 7),
(53, 4, 6, '2.00', 6),
(54, 4, 12, '6.00', 9),
(55, 4, 11, '1.00', 6),
(56, 4, 13, '1.00', 6),
(57, 4, 15, '1.00', 7),
(58, 4, 14, '6.00', 4),
(59, 5, 8, '4.00', 7),
(60, 5, 22, '2.00', 4),
(61, 5, 5, '4.00', 4),
(62, 5, 2, '1.00', 4),
(63, 5, 21, '2.00', 4),
(64, 6, 18, '2.00', 3),
(65, 6, 19, '6.00', 7),
(66, 6, 5, '4.00', 4),
(67, 6, 2, '2.00', 4),
(68, 6, 7, '2.00', 4),
(69, 7, 20, '1.00', 7),
(70, 7, 22, '8.00', 4),
(71, 7, 8, '1.00', 7),
(72, 7, 5, '3.00', 4),
(73, 7, 3, '4.00', 6),
(74, 8, 1, '6.00', 3),
(75, 8, 2, '2.00', 4),
(76, 8, 7, '1.00', 7);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_steps`
--

CREATE TABLE `recipe_steps` (
  `recipe_steps_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `step_no` int(11) NOT NULL,
  `step_description` varchar(8000) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipe_steps`
--

INSERT INTO `recipe_steps` (`recipe_steps_id`, `recipe_id`, `step_no`, `step_description`) VALUES
(1, 1, 1, 'Wash potato'),
(2, 1, 2, 'Peel potato'),
(3, 1, 3, '(Optional) Cut potato'),
(4, 1, 4, 'Add potato to pot'),
(5, 1, 5, 'Boil potato'),
(6, 1, 6, 'Eat potato'),
(7, 2, 1, 'Whisk eggs, salt and pepper in small bowl. Melt butter in non-stick skillet over medium heat.'),
(8, 2, 2, 'Pour in egg mixture and reduce heat to medium-low. As eggs begin to set, gently move spatula across bottom and side of skillet to form large, soft curds.'),
(9, 2, 3, 'Cook until eggs are thickened and no visible liquid egg remains, but the eggs are not dry.'),
(10, 2, 4, '(Optional) Sprinkle eggs with shredded cheese before serving, such as cheddar, Monterey Jack or mozzarella.'),
(11, 3, 2, 'Combine sugar, flour and spices (allspice, nutmeg, cinnamon) in a bowl. Add the flour mixture to the apple slices and use your hands to distribute the flour through the apples so they are well coated. Then sprinkle with brandy and vanilla extract and stir to coat all the apples.'),
(12, 3, 4, 'Remove one disk of pie dough from the refrigerator. Let sit at room temperature for 5-10 minutes. Place disk on a lightly floured, clean, flat surface. Using a rolling pin, roll out the pie dough to a 12-inch circle, about 1/8 of an inch thick.\r\nAs you roll out the dough, check to make sure it isnt sticking. If and when it starts to stick, gently lift it up and sprinkle a little more flour on the table surface or on the pie dough to keep the dough from sticking.\r\nGently place the rolled out dough onto a 9-inch pie plate. Press down to line the pie dish with the dough.'),
(13, 3, 1, 'Peel, core, and slice the apples.'),
(14, 3, 3, 'Place one oven rack in the lowest position and put a large rimmed baking sheet on it (to catch any drippings from the pie.) Position a second rack the next rung up (still in the lower third of the oven) and preheat to 375°F.'),
(57, 4, 1, 'Combine romaine, cucumber, tomatoes, olives, bell peppers, and red onion in a large bowl; sprinkle with feta cheese.'),
(58, 4, 2, 'Whisk olive oil, lemon juice, oregano, and black pepper together in a small bowl. Pour dressing over salad, toss well to combine, and serve.'),
(59, 5, 1, 'In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.'),
(60, 5, 2, 'Heat a lightly oiled griddle or frying pan over medium-high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.'),
(61, 6, 1, 'Heat 3 tsp. butter in a large saucepan over medium-high heat.'),
(62, 6, 2, 'Add ground beef and mix in salt (possibly spices, cinnamon, and black pepper).'),
(63, 6, 3, 'Cook until beef is browned, 7 to 10 minutes.'),
(64, 6, 4, 'Add rice to the saucepan.'),
(65, 6, 5, 'Cover and bring to a boil. Reduce heat to low and cook until liquid is absorbed, about 20 minutes.'),
(66, 6, 6, 'Meanwhile, melt 1 tablespoon butter in a small skillet over medium heat. You can add pine nuts and cook until lightly browned, 3 to 5 minutes.'),
(67, 6, 7, 'Mix this sauce into rice and meat mixture before serving.'),
(68, 7, 1, 'Preheat oven to 350 degrees F (175 degrees C). Grease 12 muffin cups.'),
(69, 7, 2, 'Beat together milk, eggs, oats, and butter in a large bowl until evenly mixed.'),
(70, 7, 3, 'Sift the flour and salt on top of the mixture.'),
(71, 7, 4, 'Fold the flour mixture into the oats mix until a batter has formed.'),
(72, 7, 5, ' Pour batter into muffin cups, filling to the top.'),
(73, 7, 6, 'Bake in preheated oven until a toothpick inserted into the middle of a muffin comes out clean, about 25 minutes.'),
(74, 8, 1, 'Place potatoes into a large pot and cover with salted water; bring to a boil. Reduce heat to medium-low and simmer until tender, 15 to 20 minutes. Drain.'),
(75, 8, 2, 'Return potatoes to the pot and mash until smooth.'),
(76, 8, 3, 'Cut the parsley or blend it.'),
(77, 8, 4, 'Add the parsley a top of the mash before serving.');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `unit_id` int(6) NOT NULL,
  `unit_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`unit_id`, `unit_name`) VALUES
(7, 'cup'),
(2, 'g.'),
(1, 'kg.'),
(8, 'l.'),
(3, 'lb.'),
(5, 'ml.'),
(9, 'oz.'),
(6, 'piece'),
(10, 'slice'),
(4, 'tsp.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(12) NOT NULL,
  `user_login` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_password` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role_id` int(11) NOT NULL,
  `user_hash` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_ip` int(16) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_login`, `user_password`, `user_role_id`, `user_hash`, `user_ip`) VALUES
(1, 'admin1', '9db06bcff9248837f86d1a6bcf41c9e7', 1, '3356c47721c3c56fba9f8d8661098fd5', 0),
(2, 'user2', 'a02cc9a3fc5def5275b5ca22f0d8f414', 2, '30769ed600d35741d25cc54de3fb5df5', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `role_id` int(1) NOT NULL,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diets`
--
ALTER TABLE `diets`
  ADD PRIMARY KEY (`diet_id`),
  ADD UNIQUE KEY `diet_name` (`diet_name`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD UNIQUE KEY `ingredient_name` (`ingredient_name`);

--
-- Indexes for table `ingredient_types`
--
ALTER TABLE `ingredient_types`
  ADD PRIMARY KEY (`ingredient_type_id`),
  ADD UNIQUE KEY `ingredient_type_name` (`ingredient_type_name`);

--
-- Indexes for table `ingredient_unit`
--
ALTER TABLE `ingredient_unit`
  ADD PRIMARY KEY (`ingredient_unit_id`);

--
-- Indexes for table `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`recipe_id`),
  ADD UNIQUE KEY `recipe_name` (`recipe_name`);

--
-- Indexes for table `recipe_diet`
--
ALTER TABLE `recipe_diet`
  ADD PRIMARY KEY (`recipe_diet_id`);

--
-- Indexes for table `recipe_ingredient`
--
ALTER TABLE `recipe_ingredient`
  ADD PRIMARY KEY (`recipe_ingredient_id`);

--
-- Indexes for table `recipe_steps`
--
ALTER TABLE `recipe_steps`
  ADD PRIMARY KEY (`recipe_steps_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`unit_id`),
  ADD UNIQUE KEY `unit_name` (`unit_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_login` (`user_login`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `diets`
--
ALTER TABLE `diets`
  MODIFY `diet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `ingredient_types`
--
ALTER TABLE `ingredient_types`
  MODIFY `ingredient_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ingredient_unit`
--
ALTER TABLE `ingredient_unit`
  MODIFY `ingredient_unit_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `recipe`
--
ALTER TABLE `recipe`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `recipe_diet`
--
ALTER TABLE `recipe_diet`
  MODIFY `recipe_diet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `recipe_ingredient`
--
ALTER TABLE `recipe_ingredient`
  MODIFY `recipe_ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `recipe_steps`
--
ALTER TABLE `recipe_steps`
  MODIFY `recipe_steps_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `unit_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `role_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
