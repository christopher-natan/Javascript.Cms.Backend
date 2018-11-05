
var Viewers = {
    Ready: function () {
        this.Dashboard.Ready();
        this.MySubscription.Ready();
        this.Signin();
        this.Container.Ready();
    },
    Dashboard: {
        Ready: function () {
            this.LinkDevice();
        },
        LinkDevice: function () {
            //$(".modal-notification").find("button.btn-danger").text("Step 1 : Link Your Roku Device").show();
            $(document).on("click", ".modal-notification button.btn-danger", function () {
                window.location.href = basePath + "viewers/link_device";
            });
        }
    },
    Container: {
        Ready: function () {
            this.Resize();
        },
        Resize: function () {
            var bodyHeight = $(document).height();
            $("body").find("div.side-nav").first().css("height", bodyHeight + "px");
        }
    },
    MySubscription: {
        Ready: function () {
            this.OnSelect();
            this.OnClickUpgrade();
            this.Dashboard();
        },
        CurrentIndex: function () {
            var index = $("#mysubscription .table").find("tr").find("td img").closest("tr").index();
            return index + 1;
        },
        OnSelect: function () {
            var currentIndex = this.CurrentIndex();
            $(document).on("click", "#mysubscription .table tr", function () {
                var selectedIndex = $(this).index() + 1;
                var $current = $(this).find("td.data");
                var $currentMonth = $current.attr("month");
                var upgradeExist = $("a.submit-upgrade").length;
                var isNewViewer  = $("#history").find("tbody tr").length;
                /* upgrade */

                if (selectedIndex > currentIndex && currentIndex >= 1 && upgradeExist >= 1) {
                    $("a.btn-upgrade").hide();
                    $("a.submit-upgrade").removeClass("hide").show();
                    $("a.submit-upgrade").text("Upgrade To " + $current.text());
                } else {
                    $("a.btn-upgrade").show();
                    $("a.btn-upgrade").text("Subscribe To " + $current.text());
                    $("a.submit-upgrade").hide();
                    if (parseInt($currentMonth) >= 2) {
                        $("select.select-month").val($currentMonth).attr("disabled", "disabled");
                    } else {
                        $("select.select-month").val(1).removeAttr("disabled");
                    }
                    if (selectedIndex < currentIndex && parseInt(isNewViewer) >=1) {
                        App.Alert("Downgrade Not Allowed", "You are not allowed to downgrade at this time.", "error");
                        $("a.btn-upgrade").hide();
                    }
                }
            });
            $("#mysubscription .table").find("tr.selected").trigger("click");
        },
        OnClickUpgrade: function () {
            if (parse.action === "my_subscriptions") {
                $(document).on("click", "a.submit-upgrade", function () {
                    App.Alert("Upgrade", "Are you sure you want to upgrade your subscription? Current subsription days and amount will be converted accordingly.", "confirm");
                    $(".modal").find(".btn-danger.confirm").hide();
                    $(".modal").find(".btn-default.success").removeClass("hide").show();
                    $(".modal").find(".btn-success.confirm").removeClass("hide").text("Yes Upgrade").show();
                });
                $(document).on("click", "button.btn-success.confirm", function () {
                    $("#mysubscription").find("form").first().submit();
                });
            }
        },
        Dashboard: function () {
            if (parse.action === "dashboard") {
                $(".table-custom").find("td").find("a").attr("href", "javascript:void(1)");
            }
        }
    },
    Signin: function () {
        if (parse.action === "signin") {
            $("div.modal").find("button.btn-danger").hide();
        }
    }
};
$(document).ready(function () {
    Viewers.Ready();
});
