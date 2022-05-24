<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Model\Api;

/**
 * Interface ApiConfigProviderInterface
 * @api
 * @since 100.0.2
 */
interface ApiConfigProviderInterface
{
    public function getConfig(\Magento\Quote\Model\Quote $quote): array;
}
