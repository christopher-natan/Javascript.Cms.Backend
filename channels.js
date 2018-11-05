/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Channels = {
    Ready: function () {
        this.Download.Ready();
        this.Packaging.Ready();
        this.ScreenType.Ready();
        this.DeviceLinking.Ready();
        this.EnableSpringBoard.Ready();
        this.EnableMarathon.Ready();
        this.Themes.Ready();
        this.Tab.Ready();
        this.ShowThemes.Ready();
        this.EditImages.Ready();
        this.H4Title.Ready();
        this.CheckEnableSubscriptionSystem.Ready();
        this.Carousel.Ready();
    },
    CheckEnableSubscriptionSystem: {
        Ready: function () {
            var exist = $("div.autoform-registration-screen-settings").length;
            if (exist >= 1 && parseInt(parse.enableSubscriptionSystem) === 1) {
                $("div.autoform-registration-screen-settings").hide();
            }
        }
    },
    ShowThemes: {
        Ready: function () {
            $(".modal.modal-themes").modal("hide");
            // $(".modal.modal-packaging").modal("hide");
            this.OnLoadAddChannel();
            this.OnClickSelect();
        },
        OnLoadAddChannel: function () {
            var isNotification = false;
            var title = $('.modal.modal-notification').find(".modal-title").text();
            if ($.trim(title) !== "Create Your First Channel") {
                return false;
            }
            $('.modal.modal-notification').on('hidden.bs.modal', function (e) {
                var isError = $('.modal.modal-notification').hasClass("error");
                if (isError) {
                    return true;
                }
                $(".modal.modal-themes").removeClass("hide");
                $(".modal.modal-themes").modal("show");
            });
        },
        OnClickSelect: function () {
            $(document).on("click", 'a.select-theme', function () {
                $(".modal.modal-themes").removeClass("hide");
                $(".modal.modal-themes").modal("show");
            });
        }
    },
    Packaging: {
        KeyId: "",
        Current: {},
        Ready: function () {
            var exists = $("div.modal-packaging").length;
            $("div.modal-packaging").modal("hide");
            if (exists >= 1) {
                this.Que();
            }
            this.IsAuto();
        },
        IsAuto: function () {
            var exists = $("input.auto-package").length;
            if (exists) {
                var val = $("input.auto-package").val();
                if (val >= 1) {
                    $("table.table-custom").find("tr.current").find("td a.create-package").trigger("click");
                }
            }
        },
        Que: function () {
            /*301 - Erro on no key id */
            var me = this;
            $(document).on("click", 'a.create-package', function () {
                me.KeyId = $(this).attr("key_id");
                me.Current = this;
                var title = $(this).attr("name");
                $(".modal-packaging").removeClass("hide");
                $(".modal-packaging").modal({keyboard: false, backdrop: 'static'}).show();
                $(".modal-packaging").find(".modal-title").text("Packaging " + title);

                $(".modal-packaging .message-status").show();
                $(".modal-packaging .message-success").hide();
                $(".modal-packaging .cancel-packaging").text("Cancel");
                $("div.modal .login-roku").hide();

                var tagetUrl = basePath + "packages/que/key_id:" + me.KeyId;
                $.ajax({
                    url: tagetUrl
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var request = $.parseJSON(data);
                    if (request.status !== "error") {
                        me.Check("", 0, 1);
                    } else {
                        me.OnError(data);
                        return false;
                    }
                });
            });
        },
        IfTimeOut: function (data, timer) {
            var me = this;
            if (typeof data.invalid !== "undefined") {
                clearTimeout(timer);
                $("div.modal-packaging").modal("hide");
                App.Alert(data.alert.title, data.alert.message, "error");
                return true;
            }
            return false;
        },
        Check: function (prefix, count, delay) {
            /*805 - Error on checking and exceed because of some other ques*/
            var isVisible = $("div.modal-packaging").is(":visible");
            if (!isVisible) {
                return false;
            }
            var me = this;
            var $try = 12;
            var tagetUrl = basePath + "packages/check/key_id:" + me.KeyId;
            var message = prefix + "Checking channel source please wait...";
            $(".message-status").text(message).fadeOut("fast").fadeIn("fast");
            setTimeout(function () {
                var timer = this;
                $.ajax({
                    url: tagetUrl,
                    cache: false
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    ++count;
                    var request = $.parseJSON(data);
                    if (me.IfTimeOut(request, timer)) {
                        return false;
                    }

                    if (request.status == "error" && count <= $try) {
                        me.Check("Trying again: " + count + "....  ", count, 2000);
                    } else {
                        if (count >= $try && request.status == "error") {
                            me.OnError(data);
                        } else {
                            clearTimeout(timer);
                            me.Prepare("", 0);
                        }
                    }
                });
            }, delay);
        },
        Prepare: function (prefix, count) {
            /*806*/
            var isVisible = $("div.modal-packaging").is(":visible");
            if (!isVisible) {
                return false;
            }
            var me = this;
            var $try = 5;
            var tagetUrl = basePath + "packages/prepare/key_id:" + me.KeyId;
            var message = prefix + "Preparing the channel source file please wait...";
            var delay = 1000;
            $(".message-status").text(message).fadeOut("fast").fadeIn("fast");
            setTimeout(function () {
                var timer = this;
                $.ajax({
                    url: tagetUrl,
                    cache: false
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    ++count;
                    var request = $.parseJSON(data);
                    if (me.IfTimeOut(request, timer)) {
                        return false;
                    }

                    if (request.status == "error" && count <= $try) {
                        me.Prepare("Trying again: " + count + "....  ", count);
                    } else {
                        if (count >= $try && request.status == "error") {
                            me.OnError(data);
                        } else {
                            clearTimeout(this);
                            me.Install("", 0);
                        }
                    }
                });
            }, delay);
        },
        Install: function (prefix, count) {
            /*807 | /*808**/
            ++count;
            var me = this;
            var isVisible = $("div.modal-packaging").is(":visible");
            if (!isVisible)
                return false;
            var $try = 6;
            var tagetUrl = basePath + "packages/install/key_id:" + me.KeyId;
            var message = prefix + "Installing the channel source for packaging process...";
            var delay = 1000;
            $(".message-status").text(message).fadeOut("fast").fadeIn("fast");
            setTimeout(function () {
                var timer = this;
                $.ajax({
                    url: tagetUrl,
                    cache: false
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {

                    var request = $.parseJSON(data);
                    if (me.IfTimeOut(request, timer)) {
                        return false;
                    }

                    if (request.invalid != undefined) {
                        clearTimeout(timer);
                        me.OnError(data);
                        return false;
                    }
                    if (request.status == "error" && count <= $try) {
                        me.Install("Trying again: " + count + "....  ", count);
                    } else {
                        if (count >= $try && request.status == "error") {
                            me.OnError(data);
                        } else {
                            /* proceed to next step*/
                            clearTimeout(timer);
                            me.Package("", 0);
                        }
                    }
                });
            }, delay);
        },
        Package: function (prefix, count) {
            ++count;
            var me = this;
            var isVisible = $("div.modal-packaging").is(":visible");
            if (!isVisible)
                return false;
            var $try = 4;
            var tagetUrl = basePath + "packages/package/app_name:AppName";
            var message = prefix + "Packaging and preparing for download...";
            var delay = 1000;
            $(".message-status").text(message).fadeOut("fast").fadeIn("fast");
            setTimeout(function () {
                var timer = this;
                $.ajax({
                    url: tagetUrl,
                    cache: false
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var request = $.parseJSON(data);
                    if (me.IfTimeOut(request, timer)) {
                        return false;
                    }
                    if (request.status == "error" && count <= $try) {
                        me.Package("Trying again: " + count + "....  ", count);
                    } else {
                        if (count >= $try && request.status == "error") {
                            me.OnError(data);
                        } else {
                            /* proceed to next step*/
                            clearTimeout(timer);
                            $("div.modal-packaging .message-status").hide();
                            $("div.modal-packaging .message-success").removeClass("hidden").show();
                            $("div.modal-packaging .cancel-packaging").text("Close");
                            $("div.modal").find(".loader").hide();
                            me.Download();
                        }
                    }
                });
            }, delay);
        },
        Download: function () {
            var me = this;
            var tagetUrl = basePath + "packages/download/key_id:" + me.KeyId;
            $(".down-loading").removeClass("hide").show();
            $.ajax({
                url: tagetUrl
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                var isError = me.OnError(data);
                if (!isError) {
                    var jsonData = $.parseJSON(data);
                    $("div.modal .login-roku").removeClass("hide").show();
                    window.location.href = jsonData.download_url;
                    $(".down-loading").hide();
                    //$(".modal-packaging").modal("hide");
                    return false;
                }
            });
        },
        OnError: function (data) {
            data = $.parseJSON(data);
            if (typeof data.alert !== "undefined") {
                $("div.modal-packaging").modal("hide");
                App.Alert(data.alert.title, data.alert.message, "error");
                return true;
            }
            return false;
        }
    },
    Tab: {
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            $(document).on("click", 'ul.nav.nav-tabs a', function () {
                var selected = $(this).attr("href");
                var replaced = selected.replace("#", "");
                $("input.tab").val(replaced);
                if (parse.action === "add") {
                    $(".tab-content").find("button.btn-primary").hide();
                    if (replaced === "manifest") {
                        $(".tab-content").find("button.btn-primary").show();
                    }
                }
            });
            if (parse.action === "add") {
                var assignTheme = $("input.is-assigned").val();
                if (parseInt(assignTheme) === 0) {
                    $(".tab-content").find("button.btn-primary").hide();
                }
            }
            $(document).on("click", 'a.manage-images', function () {
                $('ul.nav.nav-tabs').find("li").find("a").eq(3).trigger("click");
            });
        }
    },
    DeviceLinking: {
        Ready: function () {
            this.OnChange();
            this.TriggerChange();
        },
        OnChange: function () {
            var me = this;
            $(document).on("change", 'select.linking-unlinking', function () {
                var val = $(this).val();
                if (val === "linking-enable") {
                    $("div.linking-enable").show();
                    $("h4.linking-enable").next("div").show();
                } else {
                    $("div.linking-enable").hide();
                    $('select.embed-to-website').val(0);
                }
                $('select.embed-to-website').trigger("change");
            });

            $(document).on("change", 'select.embed-to-website', function () {
                var val = parseInt($(this).val());
                if (val === 1) {
                    $("input.embed-linking-url").closest("div.form-group").show();
                    $("div.embed-linking-url-download").show();
                } else {
                    $("input.embed-linking-url").closest("div.form-group").hide();
                    $("div.embed-linking-url-download").hide();
                }
            });
        },
        TriggerChange: function () {
            $('select.linking-unlinking').trigger("change");
        }
    },
    ScreenType: {
        PreviousValue: "",
        Ready: function () {
            //this.OnChange();
            //this.TriggerChange();
        },
        OnChange: function () {
            var me = this;
            $(document).on("change", 'select.screen-type', function () {
                var type = $(this).val();
                var text = $(this).find(":selected").text();
                var $springBoardScreen = $(".springboard-screen");
                var $enableSpringBoard = $("select.enable-springboard");
                var $autoformSpringBoard = $("div.autoform-springboard");
                var $supportLegacy = $("select.support-legacy-device");
                var $settingsThemeContent = $("div.settings-theme-content");
                text = me.GetClassFormat(text);
                me.ShowHide(text);
                /*remove help block on theme*/
                me.HideByDefault();
                Channels.Themes.Trigger();
                if (type === "None") {
                    if (parse.checkType > 2) {
                        $.growl({duration: 8000, title: "No Screen", message: "Will play your media items randomly or in an order if the AutoPlayNextVideo option is yes or else will play the first media item only."});
                        $springBoardScreen.hide();
                        $("ul.nav.nav-tabs").find("li:nth-child(2)").hide();
                    } else {
                        var value = me.PreviousValue;
                        if (value === "") {
                            value = "Grid";
                        }
                        $(this).val(me.PreviousValue);
                        $.growl.warning({duration: 8000, title: "Upgrade to Unlimited", message: "Sorry, this feature is available only in Unlimited Plan. Upgrade now."});
                    }
                    $("div.edit-theme-images").hide();
                    $autoformSpringBoard.hide();
                } else {
                    if (type === "Simple") {
                        $("div.autoform-poster-screen").find("h4").trigger("click");
                    }
                    if (type === "Scheduled") {
                        $.growl({duration: 8000, title: "Scheduled Screen", message: "You need to edit your media items and add schedule or else will not going to play on the screen."});
                    }
                    $springBoardScreen.show();
                    $("ul.nav.nav-tabs").find("li:nth-child(2)").show();
                    $("div.edit-theme-images").show();
                    $autoformSpringBoard.show();
                    $enableSpringBoard.trigger("change");
                }
                if (type === "List") {
                    $supportLegacy.val(0);
                    $supportLegacy.closest("div.form-group").hide();
                } else {
                    $supportLegacy.closest("div.form-group").show();
                }
                me.PreviousValue = type;
                me.SlideScreens(text);
            });
        },
        SlideScreens: function (text) {
            var screen = text + "-settings";
            var $channel = $("#channel");
            $channel.find("div.auto-container").hide();
            $channel.find("div.autoform-general").find("div.auto-container").show();
            $channel.find("div.autoform-" + screen).find("div.auto-container").show();
        },
        HideByDefault: function () {
            var $themeContent = $("div.settings-theme-content");
            $themeContent.find("div.autoform-list-screen").find("div.auto-container").hide();
            $themeContent.find("div.autoform-poster-screen").find("div.auto-container").hide();
            $themeContent.find("div.autoform-grid-screen").find("div.auto-container").hide();
        },
        GetClassFormat: function (text) {
            text = text.toLowerCase();
            text = text.replace(" ", "-");
            return text;
        },
        TriggerChange: function () {
            $('select.screen-type').trigger("change");
        },
        ShowHide: function (show) {
            var text;
            var parent = this;
            var options = $('select.screen-type option');
            var texts = $.map(options, function (option) {
                return option.text;
            });
            $.each(texts, function (key, value) {
                text = parent.GetClassFormat(value);
                $("." + text).hide();
            });
            $("." + show).removeClass("hide").show();
        }
    },
    EnableSpringBoard: {
        Ready: function () {
            this.OnChange();
            this.TriggerChange();
        },
        OnChange: function () {
            var parent = this;
            $(document).on("change", 'select.enable-springboard', function () {
                var val = $(this).val();
                parent.ShowHide(val);
            });
        },
        TriggerChange: function () {
            var type = $('select.screen-type').val();
            if (type !== "None") {
                $('select.enable-springboard').trigger("change");
            }
        },
        ShowHide: function (show) {
            if (show == 1)
                $(".form-group.springboard-screen").show();
            else
                $(".form-group.springboard-screen").hide();
        }
    },
    EnableMarathon: {
        Ready: function () {
            this.OnChange();
            this.TriggerChange();
        },
        OnChange: function () {
            var parent = this;
            $(document).on("change", 'select.enable-marathon', function () {
                var val = $(this).val();
                parent.ShowHide(val);
            });
        },
        TriggerChange: function () {
            $('select.enable-marathon').trigger("change");
        },
        ShowHide: function (show) {
            if (show == 1)
                $(".form-group.marathon").show();
            else
                $(".form-group.marathon").hide();
        }
    },
    Download: {
        Ready: function () {
            this.OnClickGetGraphics();
        },
        OnClickGetGraphics: function () {
            var parent = this;
            if ($('a.download-graphics').length <= 0)
                return false;
            $(document).on('click', 'a.download-graphics', function () {
                var href = basePath + "channels/download/graphics";
                window.location = href;
                return false;
            });
        }
    },
    H4Title: {
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            $(document).on("click", 'div.autoform h4.title', function () {
                $(this).next("div").toggle();
                $(this).find(".icon").toggle();
                $('html, body').animate({
                    scrollTop: $(this).offset().top - 70
                }, 500);
            });
        }
    },
    Carousel: {
        Ready: function () {
            this.Initialize();
            this.Execute();
            this.HelpBlockSelectIndicator();
        },
        Initialize: function () {
            var exist = $(".carousel").length;
            if (exist) {
                $('.carousel').carousel({
                    interval: 0
                });
            }
        },
        GetActiveTab: function () {
            var $activeTabId = $("ul.nav.nav-tabs").find("li.active").find("a").attr("href");
            var $activeTab = $($activeTabId);
            return $activeTab;
        },
        Execute: function () {
            var $activeTab = this.GetActiveTab();
            var me = this;
            $('.carousel').on('slide.bs.carousel', function (e, m) {
                var $autoFormContainer;
                var $activeTab = me.GetActiveTab();
                var name = $(e.relatedTarget).attr("name");
                var $autoForm = $activeTab.find("div.autoform");
                if (name !== "general") {
                    if ($activeTab.attr("id") === "channel") {
                        $autoFormContainer = $activeTab.find("div.autoform-" + name + "-screen-settings");
                    } else {
                        $autoFormContainer = $activeTab.find("div.autoform-" + name);
                    }
                } else {
                    $autoFormContainer = $activeTab.find("div.autoform-general");
                }
                $autoForm.find("h4").hide();
                $autoForm.hide(1);
                $autoFormContainer.show(1);
                $autoFormContainer.find(".auto-container").show();
            });
            $('.carousel').on('slid.bs.carousel', function (e, m) {
                var $activeTab = me.GetActiveTab();
                var carouselData = $(this).data('bs.carousel');
                var currentIndex = carouselData.getActiveIndex();
                $activeTab.find("input.current-tab").val(currentIndex);
            });
            this.Default($("#channel"));
            this.Default($("#theme"));
            this.Default($("#manifest"));
            this.Default($("#images"));
        },
        Default: function ($parentElement) {
            var currentIndicator = $parentElement.find("input.current-tab").val();
            var $carouselIndicator = $($parentElement).find("div.carousel-indicators");
            var $carouselInner = $($parentElement).find("div.carousel-inner");
            var settings = "";

            $carouselInner.find("div.item.active").removeClass("active");
            $carouselInner.find("div.item").eq(currentIndicator).addClass("active");

            $carouselIndicator.find("a").removeClass("active");
            $carouselIndicator.find("a").eq(parseInt(currentIndicator)).addClass("active");

            if ($parentElement.attr("id") === "channel") {
                settings = "-screen-settings";
                if (parseInt(currentIndicator) === 0) {
                    settings = "";
                }
            }
            var name = $carouselInner.find("div.item").eq(parseInt(currentIndicator)).attr("name");
            $($parentElement).find("div.autoform").hide();
            $($parentElement).find("div.autoform-" + name + settings).show();
        },
        HelpBlockSelectIndicator: function () {

        }
    },
    Themes: {
        Ready: function () {
            this.OnChangeFile();
            this.AssignRemoveOptionForImages();
            this.OnClickGroupButton();
            //this.Trigger();
        },
        AssignRemoveOptionForImages: function () {
            var $inputFile = $(".channels input[type=file]");
            var $fileGroup = $inputFile.closest("div.form-group");
            var helpOver = 'data-placement="left" data-toggle="popover" data-original-title="Remove" data-content="Remove this photo?"'
            var $a = '<a class="remove-image-option" href="javascript:void(1)" ' + helpOver + '><i class="icon icon-remove"></i></a>';
            var me = this;
            $.each($inputFile, function () {
                var val = $(this).closest(".form-group").next("input").val();
                var $fileGroup = $(this).closest("div.form-group");
                if ($.trim(val) !== "") {
                    $fileGroup.append($($a));
                }
            });

            $(document).on("change", ".channels input[type=file]", function () {
                var $fileGroup = $(this).closest("div.form-group");
                if (!$fileGroup.find("a.remove-image-option").length) {
                    $fileGroup.append($($a));
                }
            });

            $(document).on("click", "a.remove-image-option", function () {
                var $fileGroup = $(this).closest("div.form-group");
                var $fileContainer = $fileGroup.find("div.file-container");
                var $fileHidden = $fileGroup.next("input");
                var $fileValue = $fileHidden.val();
                $fileHidden.val("");
                $fileContainer.text("");
                $(this).remove();
                $fileGroup.find("input[type=file]").val("");
                me.AssignHidden($fileGroup, $fileValue);
            });
            //App.Initialize.PopOver.Ready();
        },
        AssignHidden: function ($fileGroup, $fileValue) {
            var exceptFields = new Array("SettingsThemeOverhangSliceHD", "SettingsThemeOverhangSliceSD");
            var tabPaneId = $.trim($fileGroup.closest(".tab-pane").attr("id"));
            var fileId = $.trim($fileGroup.find("input[type=file]").attr("id"));
            if (tabPaneId !== "theme")
                return false;
            if (parse.Action === "add")
                return false;
            if ($.inArray(fileId, exceptFields) !== -1)
                return false;

            var $removeHidden = $fileGroup.closest("form").find("input.remove-images");
            var values = $removeHidden.val();
            if ($.trim($fileValue) === "")
                return false;
            var $defaultValue = new Array();
            if (values) {
                $defaultValue = values.split(",");
            }
            $defaultValue.push($fileValue);
            $removeHidden.val($defaultValue.join(","));
        },
        OnChangeFile: function () {
            $(document).on('change', 'input.file', function () {
                var accept = $(this).attr("accept");
                var types = {image: /\.(gif|jpg|jpeg|tiff|png)$/i, xml: /\.(xml)$/i, zip: /\.(zip)$/i};
                var current = types.image;
                if (accept === "zip/*") {
                    current = types.zip;
                    if ($(this).val() !== "") {
                        var $maxByte = 3048576;
                        if (this.files[0].size > $maxByte) {
                            App.Alert("Zip File Invalid", 'Please upload zip file with the size of less than or equal 3MB', "error");
                            $(this).val("");
                            return false;
                        }
                    }
                }
                if (accept.length >= 1) {
                    if (accept === "text/xml") {
                        current = types.xml;
                        if ($(this).val() !== "") {
                            var $maxByte = 1048576;
                            if (this.files[0].size > $maxByte) {
                                App.Alert("Image Size Invalid", 'Please upload image with the size of less than or equal 1MB', "error");
                                $(this).val("");
                                return false;
                            }
                        }
                    }
                }

                var filename = $(this).val();
                if (!(current).test(filename.toLowerCase())) {
                    App.Alert("Invalid", 'Please select ' + accept + ' file only', "error");
                    $(this).val("");
                    return false;
                }
                $(this).nextAll("div").removeClass("bg-white").text("");
            });
        },
        OnClickGroupButton: function () {
            var me = this;
            //$("div.settings-theme-content").find("div.autoform").find("div.auto-container").slideUp();
            $(document).on('click', '.btn-group button', function () {
                var value = $(this).attr("param");
                $(this).parent().find("button.active").removeClass("active");
                $(this).addClass("active");
                me.ShowThemeSettings(this, value);
            });
            me.OpenIfHelpBlock(this);
            $('div.btn-group').find("button:first").trigger("click");
        },
        OpenIfHelpBlock: function (element) {
            /* open the section that have error */
            var $currentAutoContainer = $(element).closest("div.auto-container");
            var $helpBLock = $currentAutoContainer.find("span.help-block");
            if ($helpBLock.length >= 1) {
                $helpBLock.closest("div.auto-container").slideDown();
                $helpBLock.closest("div.auto-container").prev("h4").find(".icon").toggle();
            }
        },
        ShowThemeSettings: function (element, val) {
            var me = this;
            var $currentAutoContainer = $(element).closest("div.auto-container");
            /*hide*/
            $currentAutoContainer.find("div.form-group").hide();

            /*show*/
            $currentAutoContainer.find("hr." + val).fadeIn();
            $currentAutoContainer.find("h4." + val).fadeIn();
            $currentAutoContainer.find("div.form-group." + val).fadeIn();
        },
        DisplayThemeSettings: function (element, val) {
            var me = this;
            var $settingsThemeContent = $(element).closest("div.auto-container");
            var screenType = $('select.screen-type').val();
            var $helpBLock = $("#theme").find("span.help-block");
            var $currentAutoForm = $settingsThemeContent.find("div.autoform-" + screenType.toLowerCase() + "-screen");
            $settingsThemeContent.fadeOut("fast").fadeIn("fast");

            /*hide*/
            $settingsThemeContent.find("h4").hide();
            $settingsThemeContent.find("hr").hide();
            $settingsThemeContent.find(".form-group").show
            /*show*/
            $settingsThemeContent.find("hr." + val).show();
            $settingsThemeContent.find("h4." + val).show();
            $settingsThemeContent.find(".form-group." + val).show();

            /*hide the auto-container*/
            if ($helpBLock.length <= 0) {
                $settingsThemeContent.find("div.auto-container").slideUp("fast");
            }
            /*open the current screen*/
            $currentAutoForm.find("div.auto-container").slideDown("fast");
            /*set the required to open*/
            $settingsThemeContent.find("div.autoform-general").find("div.auto-container").slideDown("fast");
            $settingsThemeContent.find("div.autoform-overhang-background").find("div.auto-container").slideDown("fast");
        },
        ShowHideThemeContainer: function (elem, val) {
            var $autoContainer = $("#theme").find("div.auto-container");
            var $currentAutoContainer = $("#theme").find("div.auto-container");
            var $helpBLock = $("#theme").find("span.help-block");
            var currentField = $("#theme").find("input.current-field").val();
            $autoContainer.hide();

            if ($helpBLock.length >= 1) {
                $helpBLock.closest("div.auto-container").show();
                $helpBLock.closest("div.auto-container").prev("h4").find(".icon").toggle();
            } else {
                $helpBLock.closest("div.auto-container").hide();
                $("#theme").find("div.autoform").find("h4 i.icon").hide();
                $("#theme").find("div.autoform").find("h4 i.icon-chevron-right").show();
                if (currentField !== "") {
                    $autoContainer = $("#theme").find("." + currentField).find("div.auto-container");
                } else {
                    if ($.trim(val) === "r") {
                        $autoContainer = $autoContainer.slideDown("fast");
                    } else {
                        $autoContainer = $autoContainer.first().slideDown("fast");
                    }
                }

                $autoContainer.slideDown("fast");
                $autoContainer.prev("h4").find(".icon-chevron-right").hide();
                $autoContainer.prev("h4").find(".icon-chevron-down").show();
            }
        },
        Trigger: function () {
            //$('div.themes-buttons').find("button").first().trigger("click");
        },
        Hide: function () {
            var $theme = $(".settings-theme-content");
            $theme.find("h4").hide();
            $theme.find("hr").hide();
            $theme.find(".form-group").hide();
        },
        Show: function (val) {
            var $theme = $(".settings-theme-content");
            $theme.find("hr." + val).show();
            $theme.find("h4." + val).show();
            $theme.find(".form-group." + val).show();
        },
        ShowHideScreenType: function () {
            var screenTypeText = $('select.screen-type').find(":selected").text();
            var screenTypeVal = Channels.ScreenType.GetClassFormat(screenTypeText);
            var showHide = screenTypeVal == "poster-screen" ? "grid-screen" : "poster-screen";
            // $("." + showHide).hide();
        }
    },
    EditImages: {
        Ready: function () {
            this.OnUploadFile();
            this.OnClickShow();
            this.OnSubmit();
        },
        OnUploadFile: function () {
            $(document).on("change", "div.channel-artwork-images input.file", function () {
                var id = $(this).attr("id");
                if (id === "ArtworkManifestImages") {
                    $("input.theme-images").val("");
                } else {
                    $("input.manifest-images").val("");
                }
            });
        },
        OnSubmit: function () {
            $(document).on("click", "div.channel-artwork-images button.btn.btn-upload", function () {
                $("div.channel-artwork-images").find("input.is-upload").val("true");
            });
        },
        OnClickShow: function () {
            var exists = $("a.show-image");
            if (!exists)
                return false;

            $(document).on("click", 'a.show-image', function () {
                var imgSrc = $(this).prev("div.img-container").find("img").attr("src");
                $(this).attr("href", imgSrc + "?rnd=" + Math.random());
            });
        }
    },
    SelectChannel: {
        OnChangeChannel: function (executeThis) {
            var me = this;
            $("body").on("change", "select.channel-id", function () {
                var channelId = $(this).val();
                if (channelId) {
                    var tagetUrl = basePath + "categories/lists/channel_id:" + channelId;
                    $.ajax({
                        url: tagetUrl,
                        cache: true
                    }).error(function (xhr, ajaxOptions, thrownError) {
                        App.OnAjaxError(xhr.status);
                    }).done(function (data) {
                        var isExist = $("div.onchange-channel-trigger-category").length;
                        var isExistTab = $("ul.storage-tabs").length;
                        if (isExist) {
                            $("div.dropdown-steady").find(".btn.btn-primary").trigger("click");
                            return false;
                        }

                        if ($.trim(parse.action) == "results") {
                            window.location.href = "view";
                        }
                        if (isExistTab >= 1) {
                            window.location.href = "";
                        }

                        executeThis(data);
                        me.FilterVideos.ListAll(channelId);
                    });
                    $("input.channel-id").val(channelId);
                }
            });
            if ($.trim(parse.action) == "results") {
                $('select.channel-id').append($("<option></option>").attr("value", "0").attr("selected", "selected").text("-Select Channel-"));
                $(".dropdown.dropdown-steady").hide();
            }
        },
        FilterVideos: {
            ListAll: function (channelId) {
                var existing = $("div.view-video-contents").length;
                var isNoAjax = $("div.view-video-contents").hasClass("no-ajax");
                if (isNoAjax) {
                    return false;
                }
                var targetUrl = basePath + parse.controller.toLowerCase() + "/" + parse.action + "/filter/channel_id:";

                if (existing >= 1) {
                    var currentId = $("input.current-id").val();
                    var prevousParentId = $("input.previous-parent-id").val();

                    $.ajax({
                        url: targetUrl + channelId + "/category_id:" + currentId + "/previous_parent_id:" + prevousParentId,
                        dataType: "html"
                    }).error(function (xhr, ajaxOptions, thrownError) {
                        App.OnAjaxError(xhr.status)
                    }).done(function (data) {
                        var $target = $("form").find(".ajax-target-video-contents");
                        var panelFooter = $(data).filter(".panel-footer").html();
                        var sortableExist = $(data).contents().filter("table.table-sortable").length;
                        $target.html(data);

                        $(".well-filter").next("div").find("form").animate({opacity: '1'}, 'slow');
                        $(".loader").hide();

                        if (sortableExist >= 1) {
                            App.Initialize.Sortable.Ready();
                        }
                    });
                }
            }
        }
    }
};
$(document).ready(function () {
    if ($.trim(parse.controller) === "Channels") {
        Channels.Ready();
    }
});
