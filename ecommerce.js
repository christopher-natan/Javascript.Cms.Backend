/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Ecommerce = {
    Ready: function () {
        this.ProceedToStep.Ready();
        this.SelectSubscription.Ready();
    },
    ProceedToStep: {
        Ready: function () {
            this.OnClickProceed();
        },
        OnClickProceed: function () {
            $(document).on("click", "div.page-items button", function () {
                var checked = $('input:radio:checked').length;
                var selected = $('input:radio:checked').val();
                if (checked <= 0) {
                    App.Alert("Select", "Please select a subscription plan.", "error");
                } else {
                    $("div.page-items").hide();
                    $("div.page-options").removeClass("hide").show();
                }
                $("input.subscription-id").val(selected);
            });

            $(document).on("click", "div.page-options .proceed-two button", function () {
                $("div.page-items").removeClass("hide").show();
                $("div.page-options").hide();
            });
        }
    },
    SelectSubscription:{
         Ready: function () {
            this.OnSelect();
        },
        OnSelect: function () {
            $(document).on("click", "div.items .item a", function () {
                $(this).parent().find("input").prop("checked", true);
            });
        }
    },
    MySubscription: {
        Ready: function () {
            this.OnSelect();
        },
        Current: function () {
            var index = $("#mysubscription .table").find("tr.selected").index();
        },
        OnSelect: function () {
            $(document).on("click", "#mysubscription .table input", function () {
                var parentTr = $(this).closest()
            });
        }
    }
};
$(document).ready(function () {
    Ecommerce.Ready();
});
