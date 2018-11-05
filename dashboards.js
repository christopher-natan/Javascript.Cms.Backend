/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Dashboards = {
    Ready: function () {
        this.Overview.Ready();
        this.News.Ready();
    },
    Overview: {
        Ready: function () {
            this.OnSelectChannelId();
        },
        OnSelectChannelId: function () {
            var me = this;
            $(document).on('change', 'select.select-channel', function () {
                var val = $(this).val();
                window.location.href = basePath + "dashboard/overview/channel_id:" + val;
            });
        }
    },
    News: {
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            var me = this;
            var $contents = $("div.dashboard").find("div.news-contents");
            $(document).on('click', 'div.dashboard div.list div.row', function () {
                var newsId = $(this).find("h4").find("a").attr("news_id");
                var tagetUrl = basePath + "dashboard/news";
                var self = this;
                $contents.css("opacity", ".4");
                $(this).find("div.loader").show();
                $(this).parent().find(".row.selected").removeClass("selected");
                $(this).addClass("selected");

                $.ajax({
                    url: tagetUrl,
                    method: "POST",
                    data: {id: newsId}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $contents.html(data);
                    $contents.css("opacity", "1");
                    $(self).find("div.loader").hide();
                    $("html, body").animate({scrollTop: 0}, "slow");
                });
            });
            $('div.dashboard div.list div.row').first().trigger("click");
        }
    }
};

$(document).ready(function () {
    Dashboards.Ready();
});