/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Advertisements = {
    Ready: function () {
        this.ButtonGroups.Ready();
    },
    ButtonGroups: {
        Ready: function () {
            this.OnClickButton();
        },
        OnClickButton: function () {
            var me = this;
            $(document).on("click", "div.enable-disable-buttons button", function () {
                var status = $(this).attr("param");
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
                var href = basePath + "advertisements/activate/set:" + status;
                $.ajax({
                    url: href
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                   
                });
            });
        },
        HideElements: function (status) {
            if (parseInt(status) === 1) {
                $("ul.nav.nav-tabs").find("li.li-tab").show();
                $("div.partnership-buttons").show();
            } else {
                $("ul.nav.nav-tabs").find("li.li-tab").hide();
                $("div.partnership-buttons").hide();
            }
            $("ul.nav.nav-tabs").find("li.li-tab.active").show();
        }
    }
};

$(document).ready(function () {
    Advertisements.Ready();
});

