-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: affiliate_blog_db
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_control_list`
--

DROP TABLE IF EXISTS `access_control_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_control_list` (
  `id` varchar(64) NOT NULL,
  `role_id` varchar(64) NOT NULL,
  `api_group` varchar(100) NOT NULL,
  `isRead` tinyint(1) DEFAULT 1,
  `isWrite` tinyint(1) DEFAULT 0,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `isRemove` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_control_list`
--

LOCK TABLES `access_control_list` WRITE;
/*!40000 ALTER TABLE `access_control_list` DISABLE KEYS */;
INSERT INTO `access_control_list` VALUES ('00b3ba2a-5590-4995-9f7a-4ba0ae4d7c24','ad72721d-e715-4096-86d2-5f490624d1c1','content',1,0,NULL,NULL,NULL,0),('0a6f5306-0873-4067-866e-89ec6974b5f0','0e4e7caf-cc68-4297-a41c-52318a1e72e5','access control',1,1,NULL,NULL,NULL,1),('217222e3-8cc2-41b5-855a-b88bca54f086','ad72721d-e715-4096-86d2-5f490624d1c1','access control',1,0,NULL,NULL,NULL,0),('230596da-7181-484c-ba05-a6db47003261','ad72721d-e715-4096-86d2-5f490624d1c1','content',1,0,NULL,NULL,NULL,0),('23d83d01-529b-4ed5-be2e-d36bc8baaf12','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','access control',1,0,NULL,NULL,NULL,0),('24360695-82a9-4441-a314-e6ab76dfb37c','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','content',1,0,NULL,NULL,NULL,0),('30da5e6d-3d0d-4430-92c8-3bac38adcc62','0e4e7caf-cc68-4297-a41c-52318a1e72e5','roles',1,1,NULL,NULL,NULL,1),('46214bfb-8cd2-4e2d-8c3e-2104b4bb6f4f','0e4e7caf-cc68-4297-a41c-52318a1e72e5','content',1,1,NULL,NULL,NULL,1),('46e8b2f0-982e-454a-8625-4dbc434706fa','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','users',1,0,NULL,NULL,NULL,0),('4d18f45d-f2ec-419a-ad90-0060a679d1b4','f0a34cbe-bd75-4743-a9da-d4d265faaf63','roles',1,1,NULL,NULL,NULL,1),('4e061608-5e25-4455-9c23-3258dee79e02','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','access control',1,0,NULL,NULL,NULL,0),('5b4620ae-64d3-4913-ad1d-9cbaf6a94ae0','f0a34cbe-bd75-4743-a9da-d4d265faaf63','roles',1,1,NULL,NULL,NULL,1),('68930d11-9ddb-4584-ba4c-7f2512c30095','0e4e7caf-cc68-4297-a41c-52318a1e72e5','roles',1,1,NULL,NULL,NULL,1),('76bd223d-c476-4980-a9b1-683d26898c5d','0e4e7caf-cc68-4297-a41c-52318a1e72e5','users',1,1,NULL,NULL,NULL,1),('819a656f-b83f-46b2-9a01-41e3a9422e3c','f0a34cbe-bd75-4743-a9da-d4d265faaf63','users',1,1,NULL,NULL,NULL,1),('8c5e27b6-8d44-46b6-865e-b52186c36863','ad72721d-e715-4096-86d2-5f490624d1c1','roles',1,0,NULL,NULL,NULL,0),('935f9948-78e4-41ff-91a0-94fb4f5bd8d4','0e4e7caf-cc68-4297-a41c-52318a1e72e5','content',1,1,NULL,NULL,NULL,1),('96381be9-1786-4cba-82d9-5f26157e84da','0e4e7caf-cc68-4297-a41c-52318a1e72e5','users',1,1,NULL,NULL,NULL,1),('9bb88060-3c7c-4df6-bdc8-c124d1c52a8d','f0a34cbe-bd75-4743-a9da-d4d265faaf63','access control',1,1,NULL,NULL,NULL,1),('9bdfa0bc-f9f7-4c2d-b6d4-57f78060c891','f0a34cbe-bd75-4743-a9da-d4d265faaf63','access control',1,1,NULL,NULL,NULL,1),('9ca35927-1746-483e-9b0e-3c289d5c988f','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','content',1,0,NULL,NULL,NULL,0),('ad71d353-5953-4d76-a654-cbca53e233f2','ad72721d-e715-4096-86d2-5f490624d1c1','access control',1,0,NULL,NULL,NULL,0),('b44ff536-d3dc-44e2-8b9f-0c5efef17a45','0e4e7caf-cc68-4297-a41c-52318a1e72e5','access control',1,1,NULL,NULL,NULL,1),('c0ffaf96-5611-43c8-abb4-07be4acddf32','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','roles',1,0,NULL,NULL,NULL,0),('cb046a31-b529-4f24-beb5-a9b63e64a862','f0a34cbe-bd75-4743-a9da-d4d265faaf63','content',1,1,NULL,NULL,NULL,1),('cd2e91a5-c359-47d3-a291-0de97a2dfd11','f0cbd7c2-0725-4b07-93dd-8a4a0b15352a','roles',1,0,NULL,NULL,NULL,0),('d3b83000-e180-4c48-84dd-813327b36392','f0a34cbe-bd75-4743-a9da-d4d265faaf63','content',1,1,NULL,NULL,NULL,1),('dfa4f865-75ae-4229-92b0-0254c3708566','ad72721d-e715-4096-86d2-5f490624d1c1','roles',1,0,NULL,NULL,NULL,0),('eeb40b68-9ab1-438e-8890-162d904bcf42','ad72721d-e715-4096-86d2-5f490624d1c1','users',1,0,NULL,NULL,NULL,0),('f0ad3568-06cc-4bb7-8fc0-00d89c9ecbcf','f0a34cbe-bd75-4743-a9da-d4d265faaf63','users',1,1,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `access_control_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-03 20:22:24
