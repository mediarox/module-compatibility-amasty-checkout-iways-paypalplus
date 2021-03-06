/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
define(
    [
        'jquery',
        'Amasty_Checkout/js/model/payment/payment-loading',
        'Amasty_Checkout/js/model/address-form-state',
        'Magento_Checkout/js/model/shipping-service',
        'Amasty_Checkout/js/model/events',
        'mage/storage',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Checkout/js/model/resource-url-manager',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Checkout/js/action/get-totals'
    ],
    function (
        $,
        paymentLoader,
        addressFormState,
        shippingService,
        events,
        storage,
        fullScreenLoader,
        resourceUrlManager,
        quote,
        errorProcessor,
        getTotals
    ) {
        'use strict';
        let mixin = {
            payPalPlusMethodCode: 'iways_paypalplus_payment',
        
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
                                if (self.isAmastyPlaceOrderActionAllowed()) {
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
            },
            /**
             * Override.
             * 
             * Add shipping save observer to re-init ppp.
             */
            initObservable: function () {
                var self = this;

                this._super();

                events.onAfterShippingSave(_.debounce(function () {
                    self.reInitPayPalPlus();
                }, 50));

                return this;
            },
            /**
             * Load new ppp config (web api) and re-init (refresh) ppp iframe.
             */
            reInitPayPalPlus: function () {
                fullScreenLoader.startLoader();
                self = this;
                storage.get(this.getUrlForPppConfig()).done(
                    function (response) {
                        self.refreshPppConfig(response);
                        fullScreenLoader.stopLoader();
                    }
                ).fail(
                    function (response) {
                        errorProcessor.process(response);
                        fullScreenLoader.stopLoader();
                    }
                );
            },
            /**
             * Get ppp config web api url.
             * @return {*}
             */
            getUrlForPppConfig: function () {
                var params = resourceUrlManager.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq
                    {
                        cartId: quote.getQuoteId()
                } : {},
                urls = {
                    'guest': '/guest-carts/:cartId/ppp-config',
                    'customer': '/carts/mine/ppp-config'
                };

                return resourceUrlManager.getUrl(urls, params);
            },
            /**
             * Refresh ppp config with given response.
             * 
             * @param response
             */
            refreshPppConfig: function (response) {
                let self = this;
                let newPppConfig = response[0].iways_paypalplus_payment;
                if (!newPppConfig) return;
                this.reInitVars(newPppConfig);
                try {
                    if (this.canInitialise() && this.isInitialized) {
                        this.isInitialized = false;
                        this.initPayPalPlusFrame();
                        
                        // if previous selected method is not available anymore
                        if (!this.realIsPPPMethod()) {
                            this.ppp.deselectPaymentMethod();
                            this.selectedMethod = this.payPalPlusMethodCode;
                            this.selectPaymentMethod();
                            this.lastCall = 'enableContinue';
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            
            /**
             * Reset all provided configuration values.
             * Derived from initVars.
             * 
             * Note: Testing to set all configuration values resulted in 
             * the third-party payment methods not being updated.
             */
            reInitVars: function (config) {
                this.thirdPartyPaymentMethods = config.thirdPartyPaymentMethods ?? [];
                // toDo
            },
            isNativePPPMethod: function (paymentMethodCode) {
                return paymentMethodCode === this.payPalPlusMethodCode;
            },
            isThirdPartyPPPMethod: function (paymentMethodCode) {
                return typeof this.thirdPartyPaymentMethods[paymentMethodCode] !== "undefined";
            },
            /**
             * Derived isPPPMethod as real bool method.
             * @returns {boolean}
             */
            realIsPPPMethod: function () {
                return (this.selectedMethod &&
                    (this.isNativePPPMethod(this.selectedMethod) || this.isThirdPartyPPPMethod(this.selectedMethod)));
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);