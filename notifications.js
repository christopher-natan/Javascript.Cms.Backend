/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Notifications = {
    Ready: function () {
        this.Lists.Ready();
    },
    Lists: {
        Ready: function () {
            this.OnClick();
            this.TriggerActive();
        },
        OnClick: function () {
            var targetUrl = basePath + "notifications/display";
            var $detailsContainer = $("div.details-container");
            var $loader = $("div.details-container").nextAll("div.loader");
            var prevParamId = 0;
            $(document).on("click", "div.notifications-container ul.notifications-list li a", function () {
                var paramId = $(this).attr("param");
                if (prevParamId === paramId) {
                    return false;
                }
                $loader.show();
                $detailsContainer.css("opacity", ".5");
                prevParamId = paramId;
                $(this).closest("ul").find("li.active").removeClass("active");
                $(this).closest("li").addClass("active");
                $.ajax({
                    url: targetUrl,
                    type: 'GET',
                    data: {id: paramId}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $loader.hide();
                    $detailsContainer.html(data);
                    $detailsContainer.css("opacity", "1");
                });
            });
        },
        TriggerActive: function () {
            var $liActive = $("div.notifications-container ul.notifications-list li.active");
            var hasActive = $liActive.length;
            if (hasActive) {
                $liActive.find("a").trigger("click");
            } else {
                var $notifications = $("div.notifications-container ul").find("li");
                $notifications.first().addClass("active");
                $("div.notifications-container ul li.active").find("a").trigger("click");
            }
        }
    }
};

$(document).ready(function () {
    Notifications.Ready();
});

