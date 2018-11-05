/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Supports = {
    Ready: function () {
        this.Read.Ready();
    },
    Read: {
        Ready: function () {
            this.OnClose();
        },
        OnClose: function () {
            var messageId;
            $(document).on('click', 'a.close', function () {
                messageId = $(this).attr("id");
                App.Alert("Delete Message", "Are you sure you want to delete this message?", "confirm");

            });
            $(document).on('click', '.btn-danger.confirm', function () {
                $("div.parent-" + messageId).delay(300).fadeOut("slow");
                var targetUrl = basePath + "supports/delete/id:" + messageId;
                $.ajax({
                    url: targetUrl
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $("div.block-"+ messageId).delay(200).fadeOut();
                });

            });
        }
    }
};

$(document).ready(function () {
    Supports.Ready();
});

