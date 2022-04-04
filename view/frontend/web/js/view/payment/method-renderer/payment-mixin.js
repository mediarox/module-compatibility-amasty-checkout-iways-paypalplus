/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
define(
    [
        'jquery',
        'Amasty_Checkout/js/model/payment/payment-loading',
        'Amasty_Checkout/js/model/address-form-state',
        'Magento_Checkout/js/model/shipping-service'
    ],
    function (
        $,
        paymentLoader,
        addressFormState,
        shippingService
    ) {
    'use strict';
    
    var mixin = {
        /**
         * Extend enableContinue.
         */
        initPayPalPlusFrame: function () {
            var self = this;
            if (self.canInitialise() && !self.isInitialized) {
                self.ppp = PAYPAL.apps.PPP(
                    {
                        approvalUrl: self.paymentExperience,
                        placeholder: "ppplus",
                        mode: self.mode,
                        useraction: "commit",
                        buttonLocation: "outside",
                        showPuiOnSandbox: self.showPuiOnSandbox,
                        showLoadingIndicator: self.showLoadingIndicator,
                        country: self.getCountry(),
                        language: self.language,
                        preselection: "paypal",
                        thirdPartyPaymentMethods: self.getThirdPartyPaymentMethods(),
                        onLoad: function () {
                            self.lastCall = 'enableContinue';
                            var billingAgreements = $('.checkout-agreement.field.choice.required input.required-entry[type="checkbox"]');
                            billingAgreements.on(
                                'click',
                                function (e) {
                                    var clickedBillingAgreements = $(this);
                                    billingAgreements.each(
                                        function () {
                                            if ($(this).attr('name') == clickedBillingAgreements.attr('name')) {
                                                $(this).prop('checked', clickedBillingAgreements.prop('checked'));
                                            }
                                        }
                                    );
                                }
                            );
                        },
                        onThirdPartyPaymentMethodSelected: function (data) {
                            self.lastCall = 'onThirdPartyPaymentMethodSelected';
                            self.selectedMethod = self.paymentCodeMappings[data.thirdPartyPaymentMethod];
                            self.selectPaymentMethod();
                        },
                        enableContinue: function () {
                            if (self.lastCall != 'onThirdPartyPaymentMethodSelected') {
                                self.selectedMethod = 'iways_paypalplus_payment';
                                self.selectPaymentMethod();
                                self.lastCall = 'enableContinue';
                            }
                            self.isPaymentMethodSelected = true;
                            $("#place-ppp-order").removeAttr("disabled");
                            if(self.isAmastyPlaceOrderActionAllowed()) {
                                self.isPlaceOrderActionAllowed(true);
                            }
                        },
                        disableContinue: function () {
                            self.isPaymentMethodSelected = false;
                            $("#place-ppp-order").attr("disabled", "disabled");
                        }
                    }
                );
                self.isInitialized = true;
            }
        },
        /**
         * Adapted from Amasty_Checkout::js/view/place-button.js:isPlaceOrderActionAllowed.
         * @returns {boolean}
         */
        isAmastyPlaceOrderActionAllowed: function () {
            return !paymentLoader()
                && !addressFormState.isBillingFormVisible()
                && !addressFormState.isShippingFormVisible()
                && !shippingService.isLoading();
        }
    };

    return function (target) { 
        return target.extend(mixin);
    };
});