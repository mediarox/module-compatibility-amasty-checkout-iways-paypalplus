/**
 * Copyright 2021 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function ($, wrapper, quote) {
    'use strict';

    return function (selectPaymentMethodAction) {

        // ####### "global" properties & objects
        let paypalplusConfig = window.checkoutConfig.payment.iways_paypalplus_payment;

        // ####### "gobal" helper methods
        let isThirdPartyPPPMethod = function (paymentMethodCode) {
            return typeof paypalplusConfig.thirdPartyPaymentMethods[paymentMethodCode] !== "undefined";
        };
        let getElement = function (selector) {
            return $(selector).length ? $(selector) : null;
        }
        let createDiv = function (cssClass) {
            return $('<div>').addClass(cssClass);
        };

        return wrapper.wrap(selectPaymentMethodAction, function (originalSelectPaymentMethodAction, paymentMethod) {

            // ####### properties & objects
            let payPalPlusMethodCode = 'iways_paypalplus_payment';
            let payPalPlusOrderButtonSelector = '#place-ppp-order';
            let payPalPlusOrderButton = getElement(payPalPlusOrderButtonSelector);
            let amastyOrderButtonSelector = 'button.checkout.amasty:not('+ payPalPlusOrderButtonSelector +')';
            let amastyOrderButton = getElement(amastyOrderButtonSelector);
            let amastyOrderButtonContainerSelector = '.checkout-payment-method.submit';
            let amastyOrderButtonContainer = getElement(amastyOrderButtonContainerSelector);
            let classPaymentMethods = 'payment-methods';
            let classActionsToolbar = 'actions-toolbar';
            let classMoved = 'moved';
            let classAmasty = 'amasty';

            // ####### helper methods
            let isNativePPPMethod = function (paymentMethodCode) {
                return paymentMethodCode === payPalPlusMethodCode;
            };
            let markAsMoved = function (element) {
                element.addClass(classMoved);
            };
            let markAsAmastyButton = function (element) {
                element.addClass(classAmasty);
            };
            let hideParentContainer = function (element) {
                element.parent().hide();
            };
            let isPPPButtonAlreadyMoved = function () {
                return payPalPlusOrderButton.hasClass(classMoved);
            }
            // based on origin, @see <ppp_module>/view/frontend/web/js/view/payment/method-renderer/payment.js
            let isPPPMethod = function (paymentMethod) {
                if (paymentMethod &&
                    (isNativePPPMethod(paymentMethod.method) || isThirdPartyPPPMethod(paymentMethod.method))) {
                    return paymentMethod.method;
                }
                return null;
            };

            // ####### base methods
            let movePayPalPlusOrderButton = function () {
                if(amastyOrderButton &&
                    payPalPlusOrderButton &&
                    amastyOrderButtonContainer &&
                    !isPPPButtonAlreadyMoved()
                ) {
                    markAsMoved(payPalPlusOrderButton);
                    markAsAmastyButton(payPalPlusOrderButton); // support native styling's
                    hideParentContainer(payPalPlusOrderButton); // prevents native margin & padding of the soon empty parent container

                    // move into new structure <div class="payment-methods"><div class="actions-toolbar">PPP-BUTTON</div></div>
                    let newPaymentMethodsDiv = createDiv(classPaymentMethods);
                    let newActionsToolbarDiv = createDiv(classActionsToolbar);
                    newActionsToolbarDiv.append(payPalPlusOrderButton); // pppButton into newActionsToolbar
                    newPaymentMethodsDiv.append(newActionsToolbarDiv); // newActionsToolbar into newPaymentMethods

                    // insert new structure into amastyOrderButtonContainer
                    amastyOrderButtonContainer.append(newPaymentMethodsDiv);
                }
            };
            let switchOrderButton = function (paymentMethod) {
                if(amastyOrderButton && payPalPlusOrderButton) {
                    if(isPPPMethod(paymentMethod)) {
                        amastyOrderButton.hide();
                        payPalPlusOrderButton.show();
                    } else {
                        amastyOrderButton.show();
                        payPalPlusOrderButton.hide();
                    }
                }
            };

            // ####### do it.
            movePayPalPlusOrderButton();
            switchOrderButton(paymentMethod);

            // ####### mixin origin call
            originalSelectPaymentMethodAction(paymentMethod);
        });
    };
});