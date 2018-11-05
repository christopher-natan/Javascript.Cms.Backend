/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Users = {
    Ready: function () {
        this.AddEdit.Ready();
        this.View.Ready();
        this.Login.Ready();
    },
    AddEdit: {
        Ready: function () {
            this.SetShowHide(".role-id");
        },
        AssignTab: function () {
            $(document).on('click', "ul.nav.nav-tabs li a", function () {
                var href = $(this).attr("href");
                var cleaned = href.replace("#", "");
                $("input.tab").val(cleaned.replace("_", "-"));
            });
        },
        SetShowHide: function (element) {
            if (parse.action == "add") {
                $("select.select-channel").next(".loader").remove();
            }
            $(document).on('change', '.form-horizontal ' + element, function () {
                var val = $(this).val();
                var contentEditorId = 3;
                if (val == contentEditorId) {
                    $(this).closest(".form-group").next(".form-group").slideDown();
                    $(".form-group:gt(6)").hide();
                    $("hr.others").hide();
                }
                else {
                    $(this).closest(".form-group").next(".form-group").slideUp();
                    $(".form-group:gt(6)").show();
                    $("hr.others").show();
                }
            });
            $('.form-horizontal ' + element).trigger('change');
        }
    },
    View: {
        Ready: function () {
            if (parse.action === "login") return false;
            var me = this;
            $(document).on('change', 'select.select-channel', function () {
                var val = $(this).val();
                me.ByChannelId(val);
            });
        },
        ByChannelId: function (channelId) {
            if ($("div.ajax-target").length >= 1) {
                var controller = parse.controller.toLowerCase();
                var targetUrl = basePath + controller + "/lists/channel_id:" + channelId;
                $.ajax({
                    url: targetUrl,
                    cache: true
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var contents = $("div.ajax-target").html(data);
                });
            } else {
                var controller = parse.controller.toLowerCase();
                window.location.href =  basePath + controller + "/view/" + "channel_id:" + channelId; 
            }
        }
    },
    Login: {
        Ready: function () {
            this.ForgotPassword();
        },
        ForgotPassword: function () {
            var exists = $("div.login").length;
            var me = this;
            var modalForgot = $(".modal-forgot-password").length;
            if (!exists)
                return false;

            $("div.modal.modal-forgot-password").modal("hide");
            $(document).on('click', 'a.forgot-password', function () {
                if (!modalForgot) {
                    App.Dialog.Show("Forgot Password", "We will send you a link to your registered email where you can enter a new password.\n\
                                Are you sure you want to continue?", "confirm");
                    $(".modal.modal-notification .notification button").unbind("click");
                } else {
                    $(".modal.modal-forgot-password").removeClass("hide");
                    $(".modal.modal-forgot-password").modal("show");
                }
            });
            $(document).on('click', 'button.btn-danger.confirm', function () {
                window.location.href = basePath + "users/passwordReset/email:" + encodeURI($("input.email").val());
            });
        }
    }
};

$(document).ready(function () {
    Users.Ready();
});

