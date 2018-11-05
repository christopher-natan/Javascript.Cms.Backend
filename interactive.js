/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Interactive = {
    Ready: function () {
        this.Post.Ready();
        this.Comment.Ready();
        this.Search.Ready();
    },
    Post: {
        Ready: function () {
            this.Default();
            this.OnClickPost();
            this.OnClickCancel();
        },
        OnClickPost: function () {
            $(document).on("click", "a.post-topic", function () {
                $("div.post-topic").toggle();
                $("section.post-messages").toggle();
                $("div.post-topic").removeClass("hide");
            });
        },
         OnClickCancel: function () {
            $(document).on("click", "button.btn-cancel", function () {
                $("a.post-topic").trigger("click");
            });
        },
        Default: function () {
            var isSubmit = $("input.subject").val();
            var $element = $(".post-messages").find(".col-sm-12:first-child");
            if ($.trim(isSubmit) !== "") {
                $("div.post-topic").toggle();
                $("div.post-topic").removeClass("hide");
            }
            $element.fadeOut(50);
            $element.fadeIn(1500);
        }
    },
    Search: {
        Ready: function () {
            this.OnKeyUpFilter();
        },
        OnKeyUpFilter: function () {
            $(document).on("keyup", "input.search-topic", function () {
                var filter = $(this).val().toLowerCase();
                if (filter) {
                    $("div.main-topics").find(".topic-subject span:not(:contains(" + filter + "))").closest("div.topic-subject").hide();
                    $("div.main-topics").find(".topic-subject span:contains(" + filter + ")").closest("div.topic-subject").show();
                } else {
                    $("div.main-topics").find(".topic-subject").show();
                }
            });
        }
    },
    Comment: {
        Ready: function () {
            this.Default();
            this.OnClickComment();
        },
        OnClickComment: function () {
            $(document).on("click", "a.post-comment", function () {
                $("div.post-comment").toggle();
                $("div.post-comment").removeClass("hide");
            });
        },
        Default: function () {
            var isSubmit = $(".error-message").length;
            var $element = $(".replies").find(".row:first-child");
            if ($.trim(isSubmit) >= 1) {
                $("div.post-comment").toggle();
                $("div.post-comment").removeClass("hide");
            }
            $element.fadeOut(50);
            $element.fadeIn(1500);
        }
    },
    GetURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }
};

$(document).ready(function () {
    Interactive.Ready();
});

