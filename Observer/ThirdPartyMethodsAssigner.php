<?php
/**
 * Copyright 2022 (c) mediarox UG (haftungsbeschraenkt) (http://www.mediarox.de)
 * See LICENSE for license details.
 */
namespace Compatibility\AmastyCheckoutIwaysPayPalPlus\Observer;

use Magento\Framework\Event\Observer;
use Magento\Payment\Observer\AbstractDataAssignObserver;
use Magento\Quote\Api\Data\PaymentInterface;
use Magento\Quote\Model\Quote\Payment;
use Iways\PayPalPlus\Model\ConfigProvider;

/**
 * Adds the third-party payment methods.
 *
 * Purpose: Update the third party payment methods based on changes (shipping method) in Onepage checkout.
 */
class ThirdPartyMethodsAssigner extends AbstractDataAssignObserver
{
//    public const CODE = 'third_party_methods';
//    private ConfigProvider $configProvider;
    
//    public function __construct(
//        ConfigProvider $configProvider
//    ) {
//        $this->configProvider = $configProvider;
//    }
    
    public function execute(Observer $observer)
    {
        $dataObject = $this->readDataArgument($observer);

        $additionalData = $dataObject->getData(PaymentInterface::KEY_ADDITIONAL_DATA);

        if (!is_array($additionalData)) {
            return;
        }
        
//        $paymentModel = $this->readPaymentModelArgument($observer);
//        if (!$paymentModel instanceof Payment) {
//            return;
//        }
//
//        $pppConfig = $this->configProvider->getConfig();
//        $thirdPartyMethods = $pppConfig['payment']['iways_paypalplus_payment']['thirdPartyPaymentMethods'] ?? null;
//        if (!$thirdPartyMethods || !is_array($thirdPartyMethods)) {
//            return;
//        }
//        $paymentModel->setAdditionalInformation([self::CODE => $thirdPartyMethods]);
    }
}
