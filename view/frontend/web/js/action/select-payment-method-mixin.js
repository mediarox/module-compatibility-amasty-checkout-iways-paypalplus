/**
 * Copyright 2021 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
define([
    'ko',
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function (ko, $, wrapper, quote) {
    'use strict';

    return function (selectPaymentMethodAction) {
        let paypalplusConfig = window.checkoutConfig.payment.iways_paypalplus_payment;
        let isThirdPartyPPPMethod = function (paymentMethodCode) {
            return typeof paypalplusConfig.thirdPartyPaymentMethods[paymentMethodCode] !== "undefined";
        };
        
        return wrapper.wrap(selectPaymentMethodAction, function (originalSelectPaymentMethodAction, paymentMethod) {

            let getElement = function (selector) {
                return $(selector).length ? $(selector) : null;
            }
            
            let payPalPlusMethodCode = 'iways_paypalplus_payment';
            let isNativePPPMethod = function (paymentMethodCode) {
                return paymentMethodCode === payPalPlusMethodCode;
            };
            let payPalPlusOrderButtonSelector = '#place-ppp-order:not(.moved)';
            let amastyOrderButtonSelector = 'button.checkout.amasty';
            
            
            let amastyOrderButton = getElement(amastyOrderButtonSelector);
            let payPalPlusOrderButton = getElement(payPalPlusOrderButtonSelector);
            
            let markAsMoved = function (element) {
                element.addClass('moved');
            };
            
            let movePayPalPlusOrderButtonBelowAmastyOrderButton = function () {
                if(amastyOrderButton && payPalPlusOrderButton) {
                    markAsMoved(payPalPlusOrderButton);
                    amastyOrderButton.after(payPalPlusOrderButton);
                }
            };
            
            // based on origin, @see <ppp_module>/view/frontend/web/js/view/payment/method-renderer/payment.js
            let isPPPMethod = ko.computed(
                function (paymentMethod) {
                    if (paymentMethod && 
                        (isNativePPPMethod(paymentMethod.method) || isThirdPartyPPPMethod(paymentMethod.method))) {
                        return paymentMethod.method;
                    }
                    return null;
                }
            );
            
            let switchOrderButton = function (paymentMethod) {
                if(isPPPMethod(paymentMethod)) {
                    amastyOrderButton.hide();
                    payPalPlusOrderButton.show();
                } else {
                    amastyOrderButton.show();
                    payPalPlusOrderButton.hide();
                }
            };
            
            movePayPalPlusOrderButtonBelowAmastyOrderButton();
            switchOrderButton(paymentMethod);
            originalSelectPaymentMethodAction(paymentMethod);
        });
    };

});
