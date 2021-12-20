### Compatibility module for
* amasty/module-single-step-checkout
* iways/module-pay-pal-plus

#### Corrected behaviors

1. **Place Order Button Position "below the order total"**

   As described in the [documentation of Amasty](https://amasty.com/docs/doku.php?id=magento_2:one_step_checkout#layout), you can configure the position of the order button in the checkout. As also described there, third-party payment methods sometimes cause problems. This also applies to PayPal Plus payment methods. In case the position "below the order total" is selected, the order buttons of the PayPal Plus payment methods do not move as desired.
   Third-party payment methods from the "payment/iways_paypalplus_payment/third_party_moduls" setting of PayPal Plus are also taken into account.

#### Installation
```bash
composer require mediarox/module-compatibility-amasty-checkout-iways-paypalplus
bin/magento setup:upgrade
```

#### Notice

Further suggestions, corrections or features (pull requests or issues) are welcome.