### Compatibility module for
* amasty/module-single-step-checkout
* iways/module-pay-pal-plus

#### Corrected behaviors

1. Place Order Button Position "below the order total"
   * Problem 
     * As described in the [documentation of Amasty](https://amasty.com/docs/doku.php?id=magento_2:one_step_checkout#layout), you can configure the position of the order button in the checkout. As also described there, third-party payment methods sometimes cause problems. This also applies to PayPal Plus payment methods. In case the position "below the order total" is selected, the order buttons of the PayPal Plus payment methods do not move as desired.
   * Fix
     * Extend "Magento_Checkout/js/action/select-payment-method" to inject (mixin) additional move behaviour.
   * Info
     * Third-party payment methods from the "payment/iways_paypalplus_payment/third_party_moduls" setting of PayPal Plus are also taken into account.
2. Order button remains disabled for logged in customers
   * Problem 
     * An order is normally triggered via the "placeOrder" method (Module_Checkout::js/view/payment/default.js).
     Among other things, this checks the property "isPlaceOrderActionAllowed" (ko.observable), which is set to "true" if a billing address is available. For registered customers with existing billing addresses, this check does not work correctly in interaction with Amasty Checkout & PayPal Plus, so the order button remains disabled in these cases.
   * Fix 
     * We extend the "initPayPalPlusFrame" method (Iways_PayPalPlus::js/view/payment/method-renderer/payment.js) respectively the callback method "enableContinue" contained therein by a check of the Amasty "isPlaceOrderActionAllowed" conditions (Amasty_Checkout::js/view/place-button.js:isPlaceOrderActionAllowed) and set the native property "isPlaceOrderActionAllowed" depending on this.

#### Installation
```bash
composer require mediarox/module-compatibility-amasty-checkout-iways-paypalplus
bin/magento setup:upgrade
```

#### Notice

Further suggestions, corrections or features (pull requests or issues) are welcome.