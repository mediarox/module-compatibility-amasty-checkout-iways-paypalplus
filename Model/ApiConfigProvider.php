<?php
/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * PHP version 7.3.17
 *
 * @category Modules
 * @package  Magento
 * @author   Robert Hillebrand <hillebrand@i-ways.net>
 * @license  http://opensource.org/licenses/osl-3.0.php Open Software License 3.0
 * @link     https://www.i-ways.net
 */

namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Model;

use Compatibility\AmastyCheckoutIwaysPayPalPlus\Model\Api\ApiConfigProviderInterface;
use Iways\PayPalPlus\Helper\Data as PayPalPlusHelper;
use Iways\PayPalPlus\Model\MethodList;
use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\Payment\Helper\Data as PaymentHelper;
use Magento\Payment\Model\MethodInterface;
use Magento\Quote\Model\Quote;
use Magento\Store\Model\ScopeInterface;

/**
 * This class was created because the "ConfigProvider" and its methods for setting up the configuration
 * have fixed access to the "checkoutSession". This class copies the necessary methods and makes them available
 * so that a Quote-ID can be passed.
 *
 * @see \Iways\PayPalPlus\Model\ConfigProvider
 * @see \Iways\PayPalPlus\Model\Api
 */
class ApiConfigProvider implements ApiConfigProviderInterface
{
    /**
     * @var string
     */
    protected $methodCode = Payment::CODE;
    protected MethodInterface $method;
    protected PayPalPlusHelper $payPalPlusHelper;

    protected ScopeConfigInterface $scopeConfig;
    protected UrlInterface $urlBuilder;
    protected MethodList $methodList;
    protected Repository $assetRepo;

    /**
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __construct(
        PaymentHelper $paymentHelper,
        PayPalPlusHelper $payPalPlusHelper,
        ScopeConfigInterface $scopeConfig,
        MethodList $methodList,
        UrlInterface $urlBuilder,
        Repository $assetRepo
    ) {
        $this->method = $paymentHelper->getMethodInstance($this->methodCode);
        $this->payPalPlusHelper = $payPalPlusHelper;
        $this->scopeConfig = $scopeConfig;
        $this->methodList = $methodList;
        $this->urlBuilder = $urlBuilder;
        $this->assetRepo = $assetRepo;
    }

    public function getConfig(Quote $quote): array
    {
        $showPuiOnSandbox = (bool)$this->scopeConfig->getValue(
            'iways_paypalplus/dev/pui_sandbox', 
            ScopeInterface::SCOPE_STORE
        );

        $showLoadingIndicator = (bool)$this->scopeConfig->getValue(
            'payment/iways_paypalplus_payment/show_loading_indicator',
            ScopeInterface::SCOPE_STORE
        );

        $mode = $this->scopeConfig->getValue('iways_paypalplus/api/mode', ScopeInterface::SCOPE_STORE);
        $language = $this->scopeConfig->getValue('general/locale/code', ScopeInterface::SCOPE_STORE);

        return $this->method->isAvailable() ? [
            'payment' => [
                'iways_paypalplus_payment' => [
                    'paymentExperience' => $this->payPalPlusHelper->getPaymentExperience(),
                    'showPuiOnSandbox' => $showPuiOnSandbox,
                    'showLoadingIndicator' => $showLoadingIndicator,
                    'mode' => $mode,
                    'country' => $this->getCountry($quote),
                    'language' => $language,
                    'thirdPartyPaymentMethods' => $this->getThirdPartyMethods($quote)
                ],
            ],
        ] : [];
    }

    protected function getCountry(CartInterface $quote)
    {
        $billingAddress = $quote->getBillingAddress();
        if ($billingAddress->getCountryId()) {
            return $billingAddress->getCountryId();
        }

        $shippingAddress = $quote->getShippingAddress();
        if ($shippingAddress->getCountryId()) {
            return $shippingAddress->getCountryId();
        }

        return $this->scopeConfig->getValue('paypal/general/merchant_country', ScopeInterface::SCOPE_STORE);
    }

    protected function getThirdPartyMethods(CartInterface $quote)
    {
        $this->methodList->setCheckPPP(true);
        $paymentMethods = $this->methodList->getAvailableMethods($quote);
        $this->methodList->setCheckPPP(false);
        $allowedPPPMethods = explode(
            ',',
            $this->scopeConfig->getValue(
                'payment/iways_paypalplus_payment/third_party_moduls',
                ScopeInterface::SCOPE_STORE
            )
        );
        $methods = [];
        foreach ($paymentMethods as $paymentMethod) {
            if (strpos($paymentMethod->getCode(), 'paypal') === false
                && in_array($paymentMethod->getCode(), $allowedPPPMethods)
            ) {
                $methodImage = $this->scopeConfig->getValue(
                    'payment/iways_paypalplus_section/third_party_modul_info_image_' . $paymentMethod->getCode(),
                    ScopeInterface::SCOPE_STORE
                );
                
                if ($methodImage && (strpos($methodImage, 'http') !== 0)) {
                    if (strpos($methodImage, 'http') !== 0) {
                        $methodImage = $this->assetRepo->getUrl($methodImage);
                    }
                }

                $method = [
                    'redirectUrl' => $this->urlBuilder->getUrl('checkout', ['_secure' => true]),
                    'methodName' => $paymentMethod->getTitle(),
                    'imageUrl' => $methodImage,
                    'description' => $this->scopeConfig->getValue(
                        'payment/iways_paypalplus_section/third_party_modul_info_text_' . $paymentMethod->getCode(),
                        ScopeInterface::SCOPE_STORE
                    ),
                ];
                $methods[$paymentMethod->getCode()] = $method;
            }
        }
        return $methods;
    }
}
