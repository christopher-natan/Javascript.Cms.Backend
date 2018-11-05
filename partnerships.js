/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Partnerships = {
    buttonGroups: "div.btn-group.partnership-buttons button",
    activeTabPane: "div.tab-pane.active",
    Ready: function () {
        this.ButtonGroups.Ready();
        this.EnableDisable.Ready();
        this.SubscriptionPlan.Ready();
    },
    Action: {
        MakeTabActive: function () {
            var exist = $("span.help-block").length;
            if (exist) {
                $("div.partnership-buttons").find("button").eq(1).trigger("click");
            }
        }
    },
    ButtonGroups: {
        Ready: function () {
            this.OnClickButton();
        },
        OnClickButton: function () {
            var me = this;
            var active = $("div.enable-disable-buttons button.active").attr("param");
            this.HideElements(active);
            $(document).on("click", "div.enable-disable-buttons button", function () {
                var status = $(this).attr("param");
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
                var href = basePath + "partnership/activate/set:" + status;
                $.ajax({
                    url: href
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    me.HideElements(status);
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
    },
    EnableDisable: {
        Ready: function () {
            this.OnClickButton();
            this.TriggerActive();
        },
        OnClickButton: function () {
            $(document).on("click", Partnerships.buttonGroups, function () {
                var $activeTabPane = $(Partnerships.activeTabPane);
                var showThis = $(this).attr("param");
                $(this).closest("div").find("button").removeClass("active");
                $(this).addClass("active");
                $activeTabPane.find("div.shows").hide();
                $activeTabPane.find("div." + showThis).removeClass("hide").show();
            });
        },
        TriggerActive: function () {
            $(Partnerships.activeTabPane).find(Partnerships.buttonGroups + ".active").trigger("click");
        }
    },
    SubscriptionPlan: {
        Ready: function () {
            this.OnChangeChannel();
            this.Add();
        },
        Add: function () {
            Partnerships.Action.MakeTabActive();
        },
        OnChangeChannel: function () {
            $(document).on('change', '.partnership select.select-channel', function (e, data) {
                var val = $(this).val();
                var url = basePath + "partnership/index/channel_id:" + val;
                window.location.href = url;
            });
        }
    }
};

$(document).ready(function () {
    Partnerships.Ready();
});

