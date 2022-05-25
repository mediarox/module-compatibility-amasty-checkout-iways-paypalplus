<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
declare(strict_types=1);

namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Model;

use Compatibility\AmastyCheckoutIwaysPayPalPlus\Api\GuestConfigManagementInterface;
use Magento\Quote\Model\QuoteIdMask;
use Magento\Quote\Model\QuoteIdMaskFactory;

class GuestConfigManagement implements GuestConfigManagementInterface
{
    protected QuoteIdMaskFactory $quoteIdMaskFactory;
    protected ConfigManagement $configManagement;

    public function __construct(
        QuoteIdMaskFactory $quoteIdMaskFactory,
        ConfigManagement $configManagement
    ) {
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->configManagement = $configManagement;
    }

    public function get($cartId): array
    {
        /** @var $quoteIdMask QuoteIdMask */
        $quoteIdMask = $this->quoteIdMaskFactory->create()->load($cartId, 'masked_id');
        return $this->configManagement->get($quoteIdMask->getQuoteId());
    }
}
