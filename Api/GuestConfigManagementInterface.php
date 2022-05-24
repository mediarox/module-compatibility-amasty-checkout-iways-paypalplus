<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Api;

/**
 * Interface GuestConfigManagementInterface
 * @api
 * @since 0.0.4
 */
interface GuestConfigManagementInterface
{
    /**
     * Lists available third party payment methods for a specified shopping cart.
     *
     * This call returns an array of objects, but detailed information about each object’s attributes might not be
     * included.  See https://devdocs.magento.com/codelinks/attributes.html#PaymentMethodManagementInterface to
     * determine which call to use to get detailed information about all attributes for an object.
     *
     * @param string $cartId The cart ID.
     * @return array Array of third party payment methods.
     * @throws \Magento\Framework\Exception\NoSuchEntityException The specified cart does not exist.
     */
    public function get($cartId): array;
}
