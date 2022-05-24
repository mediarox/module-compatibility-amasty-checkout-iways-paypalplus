<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
declare(strict_types=1);

namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Model;

use Compatibility\AmastyCheckoutIwaysPayPalPlus\Api\ConfigManagementInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\Quote;

class ConfigManagement implements ConfigManagementInterface
{
    protected CartRepositoryInterface $quoteRepository;
    protected ApiConfigProvider $configProvider;

    public function __construct(
        CartRepositoryInterface $quoteRepository,
        ApiConfigProvider $configProvider
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->configProvider = $configProvider;
    }

    public function get($cartId): array
    {
        /** @var Quote $quote */
        $quote = $this->quoteRepository->get($cartId);
        return $this->configProvider->getConfig($quote);
    }
}
