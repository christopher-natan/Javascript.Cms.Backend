/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var basePath = "//www.findstep.com/client/";
var Embed = {
    Ready: function () {
        this.DeviceLinking.Ready();
    },
    DeviceLinking: {
        Ready: function () {
            this.GetModal();
            this.OnSubmit();
            this.OnChangeInput();
        },
        GetModal: function () {

            var targetUrl = basePath + "embed/deviceLinking";
            $.ajax({
                url: targetUrl,
                jsonpCallback: "callback",
                dataType: "jsonp",
                contentType: "text/html",
                method: "GET",
                data: {id: 1}
            }).error(function (xhr, ajaxOptions, thrownError) {

            }).done(function (data) {
                var results = data.html;
                $("body").append($(results));
                $(".modal-dialog").modal("show");
            });
        },
        OnSubmit: function () {
            $(".modal-dialog").modal("show");
            $("span.error").hide();
            $(document).on("click", "button.btn", function (event) {
                var linkCode = $("input.link-code").val();
                var targetUrl = basePath + "embed/executeLinking";
                if ($.trim(linkCode) === "") {
                    $("span.error").text("Please input the link code").show();
                    return false;
                }
                $("span.error").hide();
                $("button.btn").attr("disabled", true);
                $("button.btn").text("Validating...");
                $.ajax({
                    url: targetUrl,
                    jsonpCallback: "callback",
                    dataType: "jsonp",
                    method: "GET",
                    data: {link_code: linkCode}
                }).error(function (xhr, ajaxOptions, thrownError) {

                }).done(function (data) {
                    if (data.type === "error") {
                        $("span.error").text(data.message).show();
                        $("button.btn").attr("disabled", false);
                        $("button.btn").text("Link Device");
                    } else {
                        $(".modal-body").html("<h5 class='text-center alert alert-success'>" + data.message + "</h5>");
                        $(".modal-footer").html("");
                    }
                });
                event.preventDefault();
                return false;
            });
        },
        OnChangeInput: function () {
            $(document).on("focus", "input.link-code", function () {
                $("span.error").hide();
            });
        }
    }
};
$(document).ready(function () {
    Embed.Ready();
    $(document).bind("contextmenu", function (e) {
        e.preventDefault();
    });
});
