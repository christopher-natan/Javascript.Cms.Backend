/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Creates = {
    Ready: function () {
        this.Modal.Ready();
        this.Step.Ready();
        this.Theme.Ready();
        this.SetDefault.Ready();
    },
    SetDefault: {
        Ready: function () {
            var theme = $("input.theme").val();
            $("#" + theme).find("img").addClass("selected");
        }
    },
    Modal: {
        Ready: function () {
            var modalClass = ".modal.channel-creator";
            $(modalClass).modal({backdrop: 'static', keyboard: false}).show();
            $(modalClass).on('shown.bs.modal', function () {
                $(modalClass).focus();
            });
        }
    },
    Download: {
        Ready: function () {
            $(document).on('click', 'a.automatic-login', function (e) {
                var targetUrl = basePath + "creates/login";
                window.location.href = targetUrl;
                e.preventDefault();
                return false;
            });
        },
    },
    Theme: {
        Ready: function () {
            this.OnClickSelect();
        },
        OnClickSelect: function () {
            $(document).on('click', 'a.select-theme', function () {
                var currentId = $(this).attr("id");
                $("input.theme").val(currentId);
                $("img.selected").removeClass("selected");
                $(this).find("img").addClass("selected");
            });
        }
    },
    Step: {
        Ready: function () {
            this.OnGotoNext();
            this.OnGotoPrev();
            this.OnSubmitCreate();
        },
        GetData: function ($visibleContent) {
            var data = $.parseJSON($visibleContent.attr("data"));
            return data;
        },
        HelpBlock: function ($visibleContent, message) {
            var $helpblock = $("<div>").addClass("help-block");
            $helpblock.text(message);
            $helpblock.fadeOut().fadeIn();
            return $helpblock;
        },
        OnGotoNext: function () {
            var me = this;
            $(document).on('click', 'a.next', function () {
                $("div.help-block").remove();

                var $visibleContent = $(".step:visible");
                var data = me.GetData($visibleContent);
                var nextId = $visibleContent.next().attr("id");

                if (me.OnValidForm()) {
                    var $nextContent = $(".step:visible").next();
                    $visibleContent.hide();
                    $nextContent.removeClass("hidden").show();
                    me.AutomatePage(nextId);
                    me.AutomateButton();
                    me.AssignButtonNumber();
                }
            });
        },
        OnGotoPrev: function () {
            var me = this;
            $(document).on('click', 'a.prev', function () {
                $("div.help-block").remove();

                var $visibleContent = $(".step:visible");
                var data = me.GetData($visibleContent);
                var prevtId = $visibleContent.prev().attr("id");

                var $prevContent = $(".step:visible").prev();
                $visibleContent.hide();
                $prevContent.removeClass("hidden").show();
                me.AutomatePage(prevtId);
                me.AutomateButton();
                me.AssignButtonNumber();
            });
        },
        AutomateButton: function () {
            var $visibleContent = $(".step:visible");
            var data = this.GetData($visibleContent);
            $("div.buttons").find("a.prev").removeClass("hidden");
            $("div.buttons").find("button.create").removeClass("hidden");

            if (parseInt(data.prev) === 0) {
                $("div.buttons").find("a.prev").hide();
            } else {
                $("div.buttons").find("a.prev").show();
            }

            if (parseInt(data.next) === 0) {
                $("div.buttons").find("a.next").hide();
            } else {
                $("div.buttons").find("a.next").show();
            }

            if (data.create == undefined) {
                $("div.buttons").find("button.create").hide();
            } else {
                $("div.buttons").find("button.create").show();
            }

        },
        AutomatePage: function (nextId) {
            $("ul.pagination").find("li.active").removeClass("active");
            $("ul.pagination").find("li." + nextId).addClass("active");
        },
        AssignButtonNumber: function () {
            var $visibleContent = $(".step:visible");
            var currentIndex = $visibleContent.index();
            var nextIndex = currentIndex + 2;

            $("a.prev").text("Step " + currentIndex);
            $("a.next").text("Step " + nextIndex);
        },
        DisableButton: function () {
            $(".btn").attr("disabled", "disabled");
        },
        OnSubmitCreate: function () {
            var me = this;
            $(document).on('click', 'button.create.newuser', function () {
                var email = $.trim($("input.email").val());
                var $visibleContent = $(".step:visible");
                //$(this).hide();
                //$(this).prev("button").hide();
                $("div.help-block").remove();
                $("button.create.newuser").attr("disabled", true);
                $("div.buttons").find("a.btn-default.prev").attr("disabled", true);
                if (!me.OnValidForm()) {
                    $(".loader").hide();
                    $(this).show();
                    $(this).prev("button").show();
                     me.RemoveDisabledButton();
                    return false;
                }
                if (!App.isValidEmail(email)) {
                    $(".loader").hide();
                    $("input.email").after(me.HelpBlock($visibleContent, "Please input valid email address"));
                    $(this).show();
                    $(this).prev("button").show();
                     me.RemoveDisabledButton();
                    return false;
                }
                me.OnSubmitToCheckIfSuccess();
            });
        },
        RemoveDisabledButton: function () {
            $("button.create.newuser").removeAttr("disabled");
            $("div.buttons").find("a.btn-default.prev").removeAttr("disabled");
        },
        OnSubmitToCheckIfSuccess: function () {
            var me = this;
            // me.DisableButton();
            var targetUrl = basePath + "creates/as123";
            $.ajax({
                url: targetUrl,
                method: "POST",
                data: $("form").serialize()
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                var encode = $.parseJSON(data);
                var $errorContainer = $(".error-container");
                $errorContainer.empty();

                if (typeof encode.valid === "undefined") {
                    $.each(encode, function (i, v) {
                        $errorContainer.append(v);
                    });
                    $(".loader").hide();
                    $errorContainer.fadeOut().fadeIn();
                }
                /*success */
                if (typeof encode.success !== "undefined") {
                    var $visibleContent = $(".step:visible");
                    $(".buttons").find(".btn").remove();
                    $visibleContent.hide();
                    $("div.step-to-success").removeClass("hidden").fadeOut().fadeIn();
                } else {
                    me.RemoveDisabledButton();
                }

            });
        },
        OnValidForm: function () {
            var $visibleContent = $(".step:visible");
            var $formGroupRequired = $visibleContent.find("div.form-group.required");
            var me = this;
            var gotError = false;
            $.each($formGroupRequired, function (e, v) {
                var $input = $(this).find(".input-sm");
                var getVal = $.trim($input.val());
                if (getVal.length <= 0) {
                    $($input).after(me.HelpBlock($visibleContent, $input.attr("message")));
                    gotError = true;
                }
            });
            if (gotError) {
                return false;
            }
            return true;
        }
    }
};

$(document).ready(function () {
    Creates.Ready();
});

