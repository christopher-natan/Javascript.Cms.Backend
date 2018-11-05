/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Global = {
    Ready: function () {
        this.Tab.Ready();
        this.FirstFocus();
        this.AssignHelps.Ready();
    },
    FirstFocus: function () {
        var existing = $("input.name").length;
        if (existing >= 1) {
            $("input.name").focus();
        }
    },
    Tab: {
        Ready: function () {
            this.SetValidationRequired();
        },
        SetValidationRequired: function () {
            var existing = $(".tab-validate").length;
            if (existing >= 1) {
                if ($(".tab-validate").length >= 1 && $(".help-block").length >= 1) {
                    var helpBlock = $(".help-block");
                    var id = helpBlock.closest(".tab-pane").attr("id");
                    $("a[href='#" + id + "']").trigger("click");
                }
            }
        }
    },
    AssignHelps: {
        PrevoiousId: "",
        Ready: function () {
            this.Set();
            this.ShowModal();
        },
        Set: function () {
            var $pageHelp = $("div.page-help");
            var existing = $pageHelp.length;
            $(document).on("click", "a.read-more-help", function () {
                var $parentPageHelp = $(this).closest("div.page-help");
                var paramId = $(this).attr("param");
                var targetUrl = basePath + "helps/sets";
                var title = $parentPageHelp.find("h4").text();
                App.Alert(title, "<img src='" + basePath + "img/ajax-loader.gif'> Loading...", "nothing");
                $.ajax({
                    url: targetUrl,
                    type: 'GET',
                    data: {id: paramId}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $(".modal-notification .modal-body").addClass("help").html(data);
                });
            });
        },
        ShowModal: function () {
            var me = this;
            var $pageHelp = $("a.panel-help");
            var existing = $pageHelp.length;
            if (!existing)
                return false;

            $('#modalGuide').on('hidden.bs.modal', function (e) {
                $(".modal-guide").find(".modal-body").find("iframe").remove();
                $(".modal-guide").find(".modal-body").html("");
            });

            $(document).on("click", "a.panel-help", function () {
               
                var vcode = $(this).attr("param");
                var title = $(this).attr("title");
                var width = "600";
                var height = "400";
                $("div.modal-guide").removeClass("hide");
                $("div.modal-guide").find(".modal-title").text(title);
                $(".modal-guide").find(".modal-body").html('<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + vcode + '?autoplay=1&loop=0&rel=0&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>');
                me.PrevoiousId = vcode;
            });
        }
    }
};

$(document).ready(function () {
    Global.Ready();
});

