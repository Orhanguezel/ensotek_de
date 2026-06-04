SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO `sub_categories`
(`id`,`category_id`,`image_url`,`storage_asset_id`,`alt`,`icon`,`is_active`,`is_featured`,`display_order`)
VALUES
  ('bbbb52a1-1111-4111-8111-bbbbbbbb52a1','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,20),
  ('bbbb52a2-1111-4111-8111-bbbbbbbb52a2','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,21),
  ('bbbb52a3-1111-4111-8111-bbbbbbbb52a3','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,22),
  ('bbbb52a4-1111-4111-8111-bbbbbbbb52a4','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,23),
  ('bbbb52a5-1111-4111-8111-bbbbbbbb52a5','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,24),
  ('bbbb52a6-1111-4111-8111-bbbbbbbb52a6','aaaa5002-1111-4111-8111-aaaaaaaa5002',NULL,NULL,NULL,NULL,1,0,25)
ON DUPLICATE KEY UPDATE `category_id`=VALUES(`category_id`),`is_active`=VALUES(`is_active`);
INSERT INTO `sub_category_i18n` (`sub_category_id`,`locale`,`name`,`slug`,`description`,`meta_title`) VALUES
  ('bbbb52a1-1111-4111-8111-bbbbbbbb52a1','tr','Alüminyum & Tel Çekme','aluminyum-tel-cekme',NULL,NULL),
  ('bbbb52a1-1111-4111-8111-bbbbbbbb52a1','en','Aluminium & Wire Drawing','aluminium-wire-drawing',NULL,NULL),
  ('bbbb52a1-1111-4111-8111-bbbbbbbb52a1','de','Aluminium & Drahtziehen','aluminium-drahtziehen',NULL,NULL),
  ('bbbb52a2-1111-4111-8111-bbbbbbbb52a2','tr','Tekstil','tekstil',NULL,NULL),
  ('bbbb52a2-1111-4111-8111-bbbbbbbb52a2','en','Textile','textile',NULL,NULL),
  ('bbbb52a2-1111-4111-8111-bbbbbbbb52a2','de','Textil','textil',NULL,NULL),
  ('bbbb52a3-1111-4111-8111-bbbbbbbb52a3','tr','AVM, İş Merkezi & Otel','avm-is-merkezi-otel',NULL,NULL),
  ('bbbb52a3-1111-4111-8111-bbbbbbbb52a3','en','Mall, Office & Hotel','mall-office-hotel',NULL,NULL),
  ('bbbb52a3-1111-4111-8111-bbbbbbbb52a3','de','Einkaufszentrum, Büro & Hotel','einkaufszentrum-buero-hotel',NULL,NULL),
  ('bbbb52a4-1111-4111-8111-bbbbbbbb52a4','tr','Mühendislik & Makine','muhendislik-makine',NULL,NULL),
  ('bbbb52a4-1111-4111-8111-bbbbbbbb52a4','en','Engineering & Machinery','engineering-machinery',NULL,NULL),
  ('bbbb52a4-1111-4111-8111-bbbbbbbb52a4','de','Maschinenbau & Technik','maschinenbau-technik',NULL,NULL),
  ('bbbb52a5-1111-4111-8111-bbbbbbbb52a5','tr','Ambalaj, Kağıt & Yalıtım','ambalaj-kagit-yalitim',NULL,NULL),
  ('bbbb52a5-1111-4111-8111-bbbbbbbb52a5','en','Packaging, Paper & Insulation','packaging-paper-insulation',NULL,NULL),
  ('bbbb52a5-1111-4111-8111-bbbbbbbb52a5','de','Verpackung, Papier & Dämmung','verpackung-papier-daemmung',NULL,NULL),
  ('bbbb52a6-1111-4111-8111-bbbbbbbb52a6','tr','Plastik','plastik',NULL,NULL),
  ('bbbb52a6-1111-4111-8111-bbbbbbbb52a6','en','Plastics','plastics',NULL,NULL),
  ('bbbb52a6-1111-4111-8111-bbbbbbbb52a6','de','Kunststoff','kunststoff',NULL,NULL)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`slug`=VALUES(`slug`);
COMMIT;
