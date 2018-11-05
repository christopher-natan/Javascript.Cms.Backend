/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Vasts = {
    Ready: function () {
        this.SelectChannel.Ready();
        this.View.Ready();
        this.ButtonGroups.Ready();
    },
    SelectChannel: {
        Ready: function () {
            this.OnChangeSelectChannel();
            this.TriggerSelectChannel();
        },
        OnChangeSelectChannel: function () {
            var me = this;
            $("select.select-channel.channel-id-view").on("change", function () {
                var val = $(this).val();
                $("select.select-channel.channel-id-add").val(val);
                me.TriggerSelectChannel();
            });
            $("select.select-channel.channel-id-add").on("change", function () {
                var val = $(this).val();
                $("select.select-channel.channel-id-view").val(val);
                $(".ajax-video-contents").fadeTo("fast", 0.33);
                var targetUrl = basePath + "vasts/view";
                $.ajax({
                    url: targetUrl,
                    method: "POST",
                    data: {"channel_id": $("select.select-channel").val()}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var newData = $("div.view-vast-content").html(data);
                    App.Initialize.Sortable.Ready();
                    Vasts.View.Ready();
                });
                $(".ajax-video-contents").fadeTo("fast", 100);
            });
        },
        TriggerSelectChannel: function () {
            $("select.select-channel.channel-id-add").trigger("change");
        }
    },
    View: {
        Ready: function () {
            this.OnSortUpdate();
            this.OnDelete();
        },
        OnSortUpdate: function () {
            App.PerformSort("vasts/order");
        },
        OnDelete: function () {
            var keyId;
            var table = ".table.table-sortable";
            $(document).on("click", table + " tr td a.delete", function () {
                var val = $(this).attr("key_id");
                keyId = val;
                App.Alert("Remove", "Are you sure you want to remove this Vast Tag?", "confirm");
            });
            $(document).on("click", ".modal.modal-notification .btn-danger", function () {
                 var targetUrl = basePath + "vasts/delete";
                $.ajax({
                    url: targetUrl,
                    method: "POST",
                    data: {key_id: keyId}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $(table + " tr." + keyId).fadeOut();
                });
            });
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
                var href = basePath + "vasts/activate/set:" + status;
                $.ajax({
                    url: href
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                   // me.HideElements(status);
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
    Vasts.Ready();
});

