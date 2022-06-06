SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Banco de dados: `main_bc`
--

-- --------------------------------------------------------

--
-- Descartar tabela atual antes de criar novamente
--
DROP TABLE IF EXISTS `wallets`;

--
-- Estrutura para tabela `wallets`
--
CREATE TABLE `wallets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wallet_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wallet_public` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wallet_private` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Índices de tabela `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallets_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `wallets_user_uuid_unique` (`user_uuid`),
  ADD UNIQUE KEY `wallets_wallet_address_unique` (`wallet_address`),
  ADD UNIQUE KEY `wallets_wallet_public_unique` (`wallet_public`),
  ADD UNIQUE KEY `wallets_wallet_private_unique` (`wallet_private`);

--
-- AUTO_INCREMENT de tabela `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;


-- --------------------------------------------------------

--
-- Descartar tabela atual antes de criar novamente
--
DROP TABLE IF EXISTS `crypto_transactions`;

--
-- Estrutura para tabela `crypto_transactions`
--
CREATE TABLE `crypto_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Índices de tabela `crypto_transactions`
--
ALTER TABLE `crypto_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `crypto_transactions_uuid_unique` (`uuid`);


--
-- AUTO_INCREMENT de tabela `crypto_transactions`
--
ALTER TABLE `crypto_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

  -- --------------------------------------------------------