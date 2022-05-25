<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Api;

/**
 * Interface ConfigManagementInterface
 * @api
 * @since 0.0.4
 */
interface ConfigManagementInterface
{
    /**
     * Lists available third party payment methods for a specified shopping cart.
     *
     * This call returns an array of objects, but detailed information about each object’s attributes might not be
     * included.
     *
     * @param int $cartId The cart ID.
     * @return array Array of third party payment methods.
     * @throws \Magento\Framework\Exception\NoSuchEntityException The specified cart does not exist.
     */
    public function get($cartId): array;
}
