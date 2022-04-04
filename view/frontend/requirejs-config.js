/**
 * Copyright 2021 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */

var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/action/select-payment-method': {
                'Compatibility_AmastyCheckoutIwaysPayPalPlus/js/action/select-payment-method-mixin': true
            },
            'Iways_PayPalPlus/js/view/payment/method-renderer/payment': {
                'Compatibility_AmastyCheckoutIwaysPayPalPlus/js/view/payment/method-renderer/payment-mixin': true
            }
        }
    }
};