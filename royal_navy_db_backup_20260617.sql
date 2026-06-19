-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: royal_navy_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `from_year` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_year` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education_level` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_domestic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_overseas` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `education_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (1,1,NULL,NULL,NULL,NULL,'A Secret Course',NULL,NULL,NULL,'2026-06-16 23:44:34','2026-06-16 23:44:34'),(2,2,'១៩៩៩','២០០៤','៦ ឆ្នាំ','បឋមសិក្សា',NULL,'សាលាបឋមសិក្សាទួលស្វាយព្រៃ','រាជធានីភ្នំពេញ',NULL,'2026-06-17 01:22:52','2026-06-17 01:22:52'),(3,2,'២០០៥','២០០៨','៣ ឆ្នាំ','មធ្យមសិក្សា',NULL,'អនុវិទ្យាល័យទួលស្វាយព្រៃ','រាជធានីភ្នំពេញ',NULL,'2026-06-17 01:24:44','2026-06-17 01:24:44'),(4,2,'២០០៩','២០១១','៣ ឆ្នាំ','ទុតិយភូមិ',NULL,'វិទ្យាល័យទួលស្វាយព្រៃ','រាជធានីភ្នំពេញ',NULL,'2026-06-17 01:26:46','2026-06-17 01:26:46'),(5,2,'២០១៤','២០១៤','៥ ខែ','Foundation','Programme','EF International Language Centers',NULL,'San Francisco USA','2026-06-17 01:28:50','2026-06-17 01:28:50'),(6,2,'២០២០','២០២០','៦ ខែ','ពលទាហាន','វគ្គនាយទហានបន្តវេនជំនាន់ទី១៣','វិទ្យាស្ថានកងទ័ពជើងគោក','ខេត្តកំពង់ស្ពឺ',NULL,'2026-06-17 01:31:48','2026-06-17 01:31:48'),(7,2,'២០២០','២០២១','១ ឆ្នាំ','មូលដ្ឋានគ្រឹះភាសារវៀតណាម',NULL,'សាលាការពារព្រំដែនទី២',NULL,'RA Ria, Vung Tau, Vietnam','2026-06-17 01:40:49','2026-06-17 01:40:49'),(8,2,'២០២១','២០២៥','៤ ឆ្នាំ','បរិញ្ញាបត្រយោធា','ម៉ាសុីននាវា','វិទ្យាស្ថានកងទ័ពជើងទឹក',NULL,'RA Ria, Vung Tau, Vietnam','2026-06-17 01:42:16','2026-06-17 01:42:16');
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family_info`
--

DROP TABLE IF EXISTS `family_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family_info` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `marital_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_dob` date DEFAULT NULL,
  `spouse_birth_village` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_birth_district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_birth_province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_current_village` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_current_district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spouse_current_province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriage_certificate_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriage_certificate_date` date DEFAULT NULL,
  `number_of_children` int NOT NULL DEFAULT '0',
  `male_children_count` int NOT NULL DEFAULT '0',
  `female_children_count` int NOT NULL DEFAULT '0',
  `children` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `family_info_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family_info`
--

LOCK TABLES `family_info` WRITE;
/*!40000 ALTER TABLE `family_info` DISABLE KEYS */;
INSERT INTO `family_info` VALUES (1,2,'married','ហែម សូរីណា','wife','female','1991-08-17','ឆ្លូង','ឆ្លូង','ក្រចេះ','ឆ្លូង','ឆ្លូង','ក្រចេះ','21','2019-05-10',1,0,1,'[{\"dob\": \"9/04/2026\", \"name\": \"យ៉ា ទិត្យនីតា \"}]','2026-06-17 01:17:53','2026-06-17 01:17:53');
/*!40000 ALTER TABLE `family_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health`
--

DROP TABLE IF EXISTS `health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `health_check_date` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `bmi_standard_level` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_pressure` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `physical_condition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vaccination` text COLLATE utf8mb4_unicode_ci,
  `chronic_disease` text COLLATE utf8mb4_unicode_ci,
  `regular_medication` text COLLATE utf8mb4_unicode_ci,
  `assigned_doctor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_health_check_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `health_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health`
--

LOCK TABLES `health` WRITE;
/*!40000 ALTER TABLE `health` DISABLE KEYS */;
INSERT INTO `health` VALUES (1,2,'2026-01-01',77.00,173.00,'25.7','11','ល្អ','កូវិត-19, ថ្លើម','គ្មាន','គ្មាន','គ្មាន','2026-06-01','2026-06-17 02:41:20','2026-06-17 02:41:42');
/*!40000 ALTER TABLE `health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_01_01_000002_create_personal_info_table',1),(5,'2025_01_01_000003_create_military_info_table',1),(6,'2025_01_01_000004_create_family_info_table',1),(7,'2025_01_01_000005_create_military_service_histories_table',1),(8,'2025_01_01_000006_create_education_table',1),(9,'2025_01_01_000007_create_specialized_trainings_table',1),(10,'2025_01_01_000008_create_missions_table',1),(11,'2025_01_01_000009_create_health_table',1),(12,'2026_06_17_054740_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `military_info`
--

DROP TABLE IF EXISTS `military_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `military_info` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `military_enlistment_date` date DEFAULT NULL,
  `military_rank` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `military_unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education_level` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `military_specialty` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_date_military_rank` date DEFAULT NULL,
  `last_position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `military_info_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `military_info`
--

LOCK TABLES `military_info` WRITE;
/*!40000 ALTER TABLE `military_info` DISABLE KEYS */;
INSERT INTO `military_info` VALUES (1,1,NULL,'A-Secret-Rank',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-16 23:44:35','2026-06-16 23:44:35'),(2,2,'2010-02-04','វរនាវីត្រី','ជំនួយការ ការិយាល័យបញ្ជូនសារ','ស្នងការដ្ធានប្រតិបត្តិការសឹក','បញ្ជាការដ្ឋានកងទ័ពជើងទឹក','បរិញ្ញាបត្រយោធា','បញ្ជូនសារ','2026-05-09','នាយផ្នែក ការិយាល័យប្រព័ន្ធវិទ្យុត្រាំងឃឺង នាយកដ្ឋានបញ្ចូនសារ ក្រសួងការពារជាតិ','2026-06-17 01:11:30','2026-06-17 01:11:30');
/*!40000 ALTER TABLE `military_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `military_service_histories`
--

DROP TABLE IF EXISTS `military_service_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `military_service_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `start_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `military_rank` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `military_unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `place` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `military_service_histories_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `military_service_histories`
--

LOCK TABLES `military_service_histories` WRITE;
/*!40000 ALTER TABLE `military_service_histories` DISABLE KEYS */;
INSERT INTO `military_service_histories` VALUES (1,2,'01/10/2010','21/05/2012','ចក្របាលរងឯក','ពលនវី','កងវរសេនាតូចការពារអាកាស','មូលដ្ឋានសមុទ្រ','ខេត្តកំពង់សោម','2026-06-17 02:44:49','2026-06-17 02:44:49'),(2,2,'21/05/2012','10/10/2013','ចក្របាលត្រី','ពលនវី','កងវរសេនាតូចការពារអាកាស','មូលដ្ឋានសមុទ្រ','ខេត្តកំពង់សោម','2026-06-17 02:46:08','2026-06-17 02:46:08'),(3,2,'10/10/2013','20/11/2015','ចក្របាល','ពលនវី','កងវរសេនាតូចការពារអាកាស','មូលដ្ឋានសមុទ្រ','ខេត្តកំពង់សោម','2026-06-17 02:46:55','2026-06-17 02:46:55'),(4,2,'08/12/2021','29/05/2024','អនុនាវីទោ','ជំនួយការ','ខុទ្ទក័ាយ','បញ្ជាការដ្ឋានកងទ័ពជើងទឹក','រាជធានីភ្នំពេញ','2026-06-17 02:49:55','2026-06-17 02:49:55'),(5,2,'29/05/2024','បច្ចុប្បន្ន','អនុនាវីឯក','នាយរង','ក. ឧតុនីយម-ជលសាស្រ្ត ស្នងការ ប្រតិបត្តិការសឹក','បញ្ជាការដ្ឋានកងទ័ពជើងទឹក','រាជធានីភ្នំពេញ','2026-06-17 02:52:44','2026-06-17 02:53:00');
/*!40000 ALTER TABLE `military_service_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `start_date` date DEFAULT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mission_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mission_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_during_mission` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `missions_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missions`
--

LOCK TABLES `missions` WRITE;
/*!40000 ALTER TABLE `missions` DISABLE KEYS */;
INSERT INTO `missions` VALUES (1,2,'2025-05-03','១៥ថ្ងៃ','នាគមាស','ធានាវិទ្យុទាក់ទង','កងរាជអាវុធហត្ថ, ជុំសែនរីករាយ','បំរើការ','ល្អ','2026-06-17 02:38:04','2026-06-17 02:38:04');
/*!40000 ALTER TABLE `missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'rcn-token','e43474a295b0e14785d255e818e7ee93b1bfa6ccd209653d0b6181b2adcd04b6','[\"*\"]','2026-06-16 23:44:49',NULL,'2026-06-16 23:44:23','2026-06-16 23:44:49'),(2,'App\\Models\\User',2,'rcn-token','fc94af8c076fb9c558e1401297e8d684d977cb374f974ff2196a8de956d3ccff','[\"*\"]','2026-06-16 23:44:48',NULL,'2026-06-16 23:44:24','2026-06-16 23:44:48'),(3,'App\\Models\\User',3,'rcn-token','891533f0d077324c9320674b07e9ca5daf1dd368978fdd1b43a10a30f89a9604','[\"*\"]','2026-06-17 03:24:37',NULL,'2026-06-17 00:53:28','2026-06-17 03:24:37');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_info`
--

DROP TABLE IF EXISTS `personal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_info` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `nam_kh` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `military_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civilian_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_village` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_village` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `personal_info_user_id_foreign` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES (2,3,'យ៉ា ទិត្យសីហ:','Ya TITSEYHAK','male','226046','1991-09-29','9ស11ធ2024','010706101','ផ្សារថ្មី២','ដូនពេញ','រាជធានីភ្នំពេញ','ផ្សារថ្មី២','ដូនពេញ','រាជធានីភ្នំពេញ','096 5615 333 / 031 535 53 33','personnel_photos/XRLSOkmcf0JHLfNZM3u1kNE0jW9eb5SNWNhY3r0X.png','2026-06-17 01:02:59','2026-06-17 01:02:59');
/*!40000 ALTER TABLE `personal_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('tyfr4AJUXdbYshhGI0I50xFLYTaAJueySRDng89A',3,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDR5cnZPVkJTN2R2NmVnSWxjQmNrYXhzaXlaNElySG1kS3U1T2ZrMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaGVhbHRoP3BlcnNvbmFsX2luZm9faWQ9MiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1781691877);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialized_trainings`
--

DROP TABLE IF EXISTS `specialized_trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialized_trainings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personal_info_id` bigint unsigned NOT NULL,
  `duration_study` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `register_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialty_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialty` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education_level` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_domestic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_overseas` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `specialized_trainings_personal_info_id_foreign` (`personal_info_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialized_trainings`
--

LOCK TABLES `specialized_trainings` WRITE;
/*!40000 ALTER TABLE `specialized_trainings` DISABLE KEYS */;
INSERT INTO `specialized_trainings` VALUES (1,2,'៣ខែ','២០២៤','គ្រូបង្គោល','សន្តិសុខព័ត៍មាន','បឋម','មជ្ឈមណ្ឌលហ្វឹកហ្ចឺន នឹងជួសជុលបញ្ជូនសារ','ខេត្តកំពង់ស្ពឺ',NULL,'2026-06-17 02:32:23','2026-06-17 02:32:23'),(2,2,'៣ឆ្នាំ','២០២៦','ភាសា','អង់គ្លេស','ឧត្តម','មជ្ឈមណ្ឌលបណ្តុះបណ្តាលអូស្រ្តាលី','រាជធានីភ្នំពេញ',NULL,'2026-06-17 02:35:34','2026-06-17 02:35:34');
/*!40000 ALTER TABLE `specialized_trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'lik','Lik Lik','lik0101@gmail.com','admin',NULL,'$2y$12$m1OCXwWeYb1.6ABCWFlM9e4Ekh/wTZBH3LTZpHrYF608ghOzcBmL.',NULL,'2026-06-17 00:53:28','2026-06-17 00:53:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-17 17:34:24
