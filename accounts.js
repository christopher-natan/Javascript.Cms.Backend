/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Accounts = {
    INPUT_SUBSCRIPTION: "input.radio-subscription",
    INPUT_PAY_AMOUNT: "input.pay-amount",
    INPUT_PAYMENT_OPTION: "input.radio-payment-option",
    INPUT_CURRENT_SUBSCRIPTION: "input.current-subscription",
    INPUT_CURRENT_SUBSCRIPTIONID: "input.current-subscription-id",
    INPUT_UNCOMSUMED_AMOUNT: "input.unconsumed-amount",
    INPUT_AVAILABLE: "input.available",
    BUTTON_UPGRADE: "a.btn-upgrade",
    BUTTON_UPGRADE_NOW: "a.btn-upgrade-now",
    BUTTON_PAY: "a.btn-pay",
    CHOOSE_PAYMENT_OPTION: "a.choose-payment-option",
    BUTTON_PAYMENT_OPTION: "a.btn-payment-option",
    SELECT_MONTH: "select.select-month",
    SELECT_MONTH_CONTAINER: "div.select-month-container",
    SELECT_PAYMENT_OPTION_CONTAINER: "div.select-payment-option-container",
    TABLE_TR: "table.table.table-bordered tbody tr",
    Ready: function () {
        this.Subscription.Ready();
        this.Payment.Ready();
    },
    ScrollTo: function () {
        $('html, body').animate({
            scrollTop: $(document).height()
        }, 1500);
    },
    Subscription: {
        Ready: function () {
            this.OnClickSelectSubscription();
            this.OnClickSubscriptionTr();
            this.TriggerByDefault();
            this.OnClickUpgradeTo();
            this.OnClickPaymentOption();
            this.OnChangeSelectMonth();
        },
        OnClickSelectSubscription: function () {
            var me = this;
            $(document).on("click", Accounts.INPUT_SUBSCRIPTION, function () {
                var name = $(this).attr("param");
                var $element = $(this).parent("tr");
                me.SetExtendedProperty($element, name);
            });
        },
        OnClickUpgradeTo: function () {
            var me = this;
            $(document).on("click", Accounts.BUTTON_UPGRADE, function () {
                me.ShowHideSelectMonthContainer(0);
                $(Accounts.SELECT_MONTH).trigger("change");
                Accounts.ScrollTo();
            });
        },
        OnClickPaymentOption: function () {
            var me = this;
            $(document).on("click", Accounts.BUTTON_PAYMENT_OPTION, function () {
                $(this).hide();
                me.ShowHideSelectPaymentOptionContainer(1);
                Accounts.ScrollTo();
            });
        },
        ShowHideSelectMonthContainer: function (type) {
            var $selectMonthContainer = $(Accounts.SELECT_MONTH_CONTAINER);
            if (type === 0) {
                $(Accounts.BUTTON_UPGRADE).hide();
                $selectMonthContainer.removeClass("hide").show();
            } else {
                $(Accounts.BUTTON_UPGRADE).show();
                $selectMonthContainer.hide();
                $(Accounts.BUTTON_PAYMENT_OPTION).show();
            }
        },
        ShowHideSelectPaymentOptionContainer: function (type) {
            var $selectPaymentOptionContainer = $(Accounts.SELECT_PAYMENT_OPTION_CONTAINER);
            if (type === 1) {
                $selectPaymentOptionContainer.removeClass("hide").show();
            } else {
                $selectPaymentOptionContainer.hide();
            }
        },
        OnChangeSelectMonth: function () {
            var me = this;
            $(document).on("change", Accounts.SELECT_MONTH, function () {
                var amount = me.GetSubscriptionAmount();
                var totalPrice = parseInt($(this).val()) * parseFloat(amount);
                $(Accounts.INPUT_PAY_AMOUNT).val("$" + totalPrice.toFixed(2));
            });
        },
        GetSubscriptionAmount: function () {
            var $selectedTr = $(Accounts.TABLE_TR + ".selected");
            var amount = $selectedTr.find("td").last().text();
            amount = $.trim(amount.replace("$", ""));
            return amount;
        },
        OnClickSubscriptionTr: function () {
            var me = this;
            $(document).on("click", Accounts.TABLE_TR, function () {
                var $inputSubscription = $(this).find(Accounts.INPUT_SUBSCRIPTION);
                var name = $inputSubscription.attr("param");
                var $element = $(this);
                if (name) {
                    $inputSubscription.prop("checked", true);
                    me.SetExtendedProperty($element, name);
                }
            });
        },
        OnClickUpgradeNow: function () {
            var me = this;
            $(document).on("click", Accounts.BUTTON_UPGRADE_NOW, function () {

            });
        },
        TriggerByDefault: function () {
            var isChecked = $(Accounts.INPUT_SUBSCRIPTION + ":checked").length;
            if (isChecked) {
                $(Accounts.INPUT_SUBSCRIPTION + ":checked").trigger("click");
            }
        },
        SetExtendedProperty: function ($element, name) {

            var currentSubscription = $.trim($(Accounts.INPUT_CURRENT_SUBSCRIPTION).val());
            var currentSubscriptionId = $.trim($(Accounts.INPUT_CURRENT_SUBSCRIPTIONID).val());
            var $buttonUpgrade = $(Accounts.BUTTON_UPGRADE).removeClass("hide");

            $(Accounts.TABLE_TR).find(Accounts.SELECT_MONTH).removeClass("hide").hide();
            $element.closest("table.table").find("tr.selected").removeClass("selected");
            $element.find(Accounts.SELECT_MONTH).show();
            $element.addClass("selected");

            this.ShowHideSelectPaymentOptionContainer(0);
            this.ShowHideSelectMonthContainer(1);

            $buttonUpgrade.removeAttr("disabled");
            if (parseInt(currentSubscriptionId) > parseInt($element.find(Accounts.INPUT_SUBSCRIPTION).val())) {
                $buttonUpgrade.text("Downgrade");
                $buttonUpgrade.attr("disabled", true);
                App.Alert("Downgrade", "Sorry you can't downgrade this time. Still you have an active subscription", "error");
                return false;
            }
    
            if (parseInt(currentSubscriptionId) === parseInt($element.find(Accounts.INPUT_SUBSCRIPTION).val()) || parseInt(currentSubscriptionId) === 1) {
                $buttonUpgrade.text("Add or Extend Monthly Subcription...");
                $(Accounts.SELECT_MONTH).val(2);
                this.SetUpgradeAndCalculate(0);
            } else {
                var $buttonText = "Upgrade";
                $buttonUpgrade.text($buttonText + " To " + name);
                this.SetUpgradeAndCalculate(1);
            }
        },
        SetUpgradeAndCalculate: function (type) {
            var isNotSufficient = $.trim($(Accounts.INPUT_AVAILABLE).val()) === "";
            if (isNotSufficient) {
                type = 0;
            }
            if (type) {
                var unconsumed = $(Accounts.INPUT_UNCOMSUMED_AMOUNT).val();
                var uncomsumedAmount = unconsumed.replace("$", "");
                var selectedSubscriptionAmount = this.GetSubscriptionAmount();
                var howManyMonths = Math.ceil(uncomsumedAmount / selectedSubscriptionAmount);
                $(Accounts.SELECT_MONTH).val(howManyMonths).attr("disabled", true);
                $("div.unconsumed-container").removeClass("hide").show();
                $("div.regular-container").hide();

                $(Accounts.BUTTON_PAYMENT_OPTION).hide();
                $(Accounts.BUTTON_UPGRADE_NOW).removeClass("hide").show();
            } else {
                $("div.unconsumed-container").hide();
                $("div.regular-container").show();

                $(Accounts.SELECT_MONTH).removeAttr("disabled");
                $(Accounts.BUTTON_PAYMENT_OPTION).show();
                $(Accounts.BUTTON_UPGRADE_NOW).hide();
            }
        }
    },
    Payment: {
        Ready: function () {
            this.OnClickSelectOption();
            this.OnClickRadio();
            this.OnClickPay();
            this.AccountPostPayment();
        },
        OnClickRadio: function () {
            var me = this;
            $(document).on("click", Accounts.INPUT_PAYMENT_OPTION, function () {
                me.ChangePayButtonText($(this));
            });
        },
        OnClickSelectOption: function () {
            var me = this;
            $(document).on("click", Accounts.SELECT_PAYMENT_OPTION_CONTAINER + " img", function () {
                var $radioPayment = $(this).parent("div").find(Accounts.INPUT_PAYMENT_OPTION);
                var isDisabled = $radioPayment.attr("disabled");
                if (!isDisabled) {
                    $radioPayment.prop("checked", true);
                    me.ChangePayButtonText($radioPayment);
                }
            });
        },
        ChangePayButtonText: function ($radioPayment) {
            var name = $radioPayment.attr("param");
            $(Accounts.BUTTON_PAY).text("Pay With " + name);
            $(Accounts.BUTTON_PAY).removeClass("hide");
        },
        OnClickPay: function () {
            var me = this;
            var $buttonPay = $(Accounts.BUTTON_PAY);
            $(document).on("click", Accounts.BUTTON_PAY, function () {
                var $checkedPaymentType = $(Accounts.SELECT_PAYMENT_OPTION_CONTAINER).find("input:checked");
                var isNotEmpty = $checkedPaymentType.length;

                if (!isNotEmpty === 0) {
                    App.Alert("Payment Type Required", "Please select payment type", "error");
                    return false;
                }

                var $selectedTr = $(Accounts.TABLE_TR + ".selected");
                var subscriptionType = $selectedTr.find("input.radio-subscription").val();
                var paymentType = $checkedPaymentType.val();
                var month = $(Accounts.SELECT_MONTH).val();
                var param = "?month=" + month + "&payment_type=" + paymentType + "&subscription_type=" + subscriptionType;

                $(this).prop("href", "createPayment" + param);
                $("ul").find("li.li-tab").hide();
                $("ul").find("li.li-tab-hidden").removeClass("hide");
                $("ul").find("li.li-tab-hidden").find("a").trigger("click");
                return true;
            });
        },
        AccountPostPayment: function () {
            var $postPayment = $("form.account-post-payment");
            if ($postPayment.length >= 1) {
                $postPayment.submit();
            }
        }
    },
    Request: {
        Ajax: function (element, action, param) {
            if (typeof (param["beforeRequest"]) !== "undefined") {
                param["beforeRequest"](element);
            }
            var tagetUrl = basePath + "accounts/" + action;
            $.ajax({
                url: tagetUrl,
                method: "POST",
                data: param["data"]
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                if (App.IsJsonFormat(data)) {
                    var jsonData = $.parseJSON(data);
                    if (typeof jsonData.status !== "undefined" && jsonData.status === "error") {
                        App.Alert("Error", jsonData.message, "error");
                    }
                }
                param["afterRequest"](element, data);
            });
        }
    }

};

$(document).ready(function () {
    Accounts.Ready();
});

