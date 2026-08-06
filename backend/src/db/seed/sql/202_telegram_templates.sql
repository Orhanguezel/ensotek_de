-- =============================================================
-- Telegram notification settings + templates (Ensotek)
-- NOTE:
--   1) Set telegram_notifications_enabled=true to activate
--   2) Fill telegram_bot_token and telegram_default_chat_id
-- =============================================================

-- Base switches
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_notifications_enabled', '*', 'false', NOW(), NOW()),
  (UUID(), 'telegram_webhook_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_bot_token', '*', '', NOW(), NOW()),
  (UUID(), 'telegram_default_chat_id', '*', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event flags (Ensotek)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (UUID(), 'telegram_event_new_catalog_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_offer_request_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_contact_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_ticket_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_ticket_replied_enabled', '*', 'true', NOW(), NOW()),
  (UUID(), 'telegram_event_new_newsletter_subscription_enabled', '*', 'true', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();

-- Event templates (Ensotek)
-- Supported placeholders are provided by each module's telegramNotify call.
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
  (
    UUID(),
    'telegram_template_new_catalog_request',
    '*',
    '🌐 {{site_name}}
📚 *Yeni Katalog Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
💬 Mesaj: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_offer_request',
    '*',
    '🌐 {{site_name}}
💰 *Yeni Teklif Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
🔧 Ürün/Hizmet: {{product_service}}
💬 Detay: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_contact',
    '*',
    '🌐 {{site_name}}
📞 *Yeni İletişim Talebi*

👤 Ad Soyad: {{customer_name}}
📧 E-posta: {{customer_email}}
📱 Telefon: {{customer_phone}}
🏢 Firma: {{company_name}}
📝 Konu: {{subject}}
💬 Mesaj: {{message}}
📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_ticket',
    '*',
    '🎫 *Yeni Destek Talebi*\\n\\n👤 Kullanıcı: {{user_name}}\\n📧 E-posta: {{user_email}}\\n📝 Konu: {{subject}}\\n⚠️ Öncelik: {{priority}}\\n💬 Mesaj: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_ticket_replied',
    '*',
    '✅ *Destek Talebi Yanıtlandı*\\n\\n👤 Kullanıcı: {{user_name}}\\n📝 Konu: {{subject}}\\n⚠️ Öncelik: {{priority}}\\n💬 Yanıt: {{message}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'telegram_template_new_newsletter_subscription',
    '*',
    '📬 *Yeni Bülten Aboneliği*\\n\\n📧 E-posta: {{email}}\\n👤 Ad: {{name}}\\n🌐 Dil: {{locale}}\\n📅 Tarih: {{created_at}}',
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `updated_at` = NOW();
