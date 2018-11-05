/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var body = $("body").attr("param");
var parse = $.parseJSON(body);
var basePath = parse.baseURL;
var specialNumber = 888;
var once = false;
var App = {
    Ready: function () {
        this.SetAjaxLoader.Ready();
        this.Dialog.Ready();
        this.SetSideNav.Ready();
        this.Initialize.Ready();
        this.Table.Ready();
        this.Guide.Ready();
        this.Notifications.Ready();
        this.Shortcut.Ready();
        this.CheckAll.Ready();
    },
    Shortcut: {
        Ready: function () {
            $("div.shortcut-tab").find("a").on("mouseover", function () {
                $("div.shortcut-menu").slideDown("fast");
            });
            $("div.shortcut-menu").on("mouseleave", function () {
                $("div.shortcut-menu").slideUp("fast");
            });
            $("div.shortcut-menu").slideUp("fast");
        }
    },
    Param: function () {
        var $body = $.parseJSON($("body").attr("param"));
        return $body;
    },
    Notifications: {
        Ready: function () {
            this.OnClickNotificationMenu();
            this.Count();
        },
        OnClickNotificationMenu: function () {
            var targetUrl = basePath + "notifications/show";
            $(document).on("click", "ul li.notifications-menu a", function () {
                var $targetContent = $(this).parent("li").find("ul");
                var $isLoadNewContent = $targetContent.find("li").length;
                if ($isLoadNewContent > 1) {
                    return false;
                }
                $.ajax({
                    url: targetUrl,
                    type: 'GET'
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $targetContent.html(data);
                });
            });
        },
        Count: function () {
            var targetUrl = basePath + "notifications/count";
            var $notificationsMenu = $("ul li.notifications-menu");
            if (!$notificationsMenu.length)
                return false;
            $.ajax({
                url: targetUrl,
                type: 'GET'
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                var jsonData = $.parseJSON(data);
                if (jsonData.count >= 1) {
                    $notificationsMenu.find("span.badge-warning").text(jsonData.count);
                }
            });
        }
    },
    IsJsonFormat: function (data) {
        if (data.substr(0, 1) === '{') {
            return true;
        }
        return false;
    },
    Initialize: {
        Ready: function () {
            this.DatePicker.Ready();
            this.PopOver.Ready();
            this.ColorPalette.Ready();
            this.DropDown.Ready();
            this.Sortable.Ready();
            this.AutoSize.Ready();
            this.HelpOver.Ready();
            this.ToolTip.Ready();
            this.VideoJs.Ready();
        },
        DatePicker: {
            Ready: function () {
                if ($.fn.datepicker === undefined)
                    return false;
                $('.datepicker').datepicker({
                    format: 'MM d, yyyy',
                    autoclose: true
                });
            }
        },
        PopOver: {
            Ready: function () {
                if ($.fn.popover === undefined)
                    return false;
                $("a[data-toggle='popover']").popover({trigger: "hover", html: true});
            }
        },
        HelpOver: {
            Ready: function () {
                if ($.fn.popover === undefined) {
                    return false;
                }
                var exist = $(".helpover").length;
                if (exist >= 1) {
                    $(".helpover").popover({trigger: "focus", delay: {"show": 10, "hide": 1000}});
                    $(".helpover").popover("show");

                    if ($(".helpover").hasClass("no-destroy"))
                        return false;
                    $('.helpover').on('shown.bs.popover', function () {
                        setTimeout(function () {
                            $('.helpover').popover('hide').popover('destroy');
                        }, 4000);
                    });
                }
            }
        },
        ColorPalette: {
            Ready: function () {
                if ($.fn.colorPalette === undefined)
                    return false;
                $('.color-palette').colorPalette().on('selectColor', function (e) {
                    var $palette = $(this);
                    var $input = $palette.closest('div.form-group').find("input");
                    $input.val(e.color);
                });
            }
        },
        DropDown: {
            Ready: function () {
                if ($.fn.dropdown === undefined)
                    return false;
                $('.dropdown-steady .dropdown-menu').on({
                    "click": function (e) {
                        e.stopPropagation();
                    }
                });
            }
        },
        Sortable: {
            Ready: function () {
                if ($.fn.sortable === undefined)
                    return false;
                $('.table-sortable').sortable({
                    containerSelector: 'table',
                    itemPath: '> tbody',
                    itemSelector: 'tr',
                    placeholder: '<tr class="placeholder"/>'
                });
            }
        },
        AutoSize: {
            Ready: function () {
                if ($.fn.autosize === undefined)
                    return false;

                $('textarea.autosize').ready(function () {
                    $('textarea.autosize').autosize();
                });
            }
        },
        ToolTip: {
            Ready: function () {
                if ($.fn.tooltip === undefined) {
                    return false;
                }
                //$('.tooltip').tooltip({delay: {"show": 1, "hide": 1000}});
                $('[data-toggle="tooltip"]').tooltip();
            }
        },
        VideoJs: {
            Ready: function () {
                if (typeof videojs === "undefined") {
                    return false;
                }
                videojs.options.flash.swf = "../media/video-js.swf?32";
            }
        }
    },
    SetAjaxLoader: {
        loaderClass: ".ajax-loader",
        Ready: function () {
            this.InsertImageLoader();
            this.OnEvent();
            this.HideOnAjaxStop();
        },
        InsertImageLoader: function () {
            var img = $("<img>");
            var src = basePath + "img/ajax-loader.gif";
            img.attr({
                "class": "loader",
                "src": src
            });
            var existing = $(this.loaderClass).next("img.loader").length;
            $(img).insertAfter($(this.loaderClass)).hide();
        },
        OnEvent: function () {
            var me = this;
            if ($(this.loaderClass).prop('tagName') === undefined)
                return false;

            var obj = $(this.loaderClass);
            $(obj).each(function () {
                var type = $(this).prop('tagName');
                var event = "";

                type = type.toLowerCase();
                if (type === "select")
                    event = "change";
                if (type === "button")
                    event = "click";

                $(this).on(event, function () {
                    var button = this;
                    $(this).next("img").show();
                    if ($(this).hasClass("no-disabled") === false) {
                        var elementType = $(this).prop('tagName');
                        if (elementType.toLowerCase() == "button") {
                            setTimeout(function () {
                                $(button).attr("disabled", "disabled");
                            }, 300);
                        }
                    }
                });
            });
        },
        HideOnAjaxStop: function () {
            var me = this;
            $(document).ajaxStop(function () {
                $(me.loaderClass).next("img.loader").hide();
            });
        }
    },
    Dialog: {
        Ready: function () {
            this.TriggerClick();
        },
        TriggerClick: function () {
            var getMessage = $.trim($(".modal.modal-notification").find(".modal-body").text());
            if (getMessage !== "") {
                $(".modal.modal-notification").find("button.confirm").hide();
                $(".modal-trigger").trigger('click');
            }
        },
        Show: function (title, message, type) {
            if (type === "undefined") {
                type = "";
            }
            $(".modal.modal-notification").removeClass("success error confirm");
            $(".modal.modal-notification").find("button.btn").hide();
            $(".modal.modal-notification").find(".modal-body").html(message);
            $(".modal.modal-notification").find(".modal-title").text(title);
            $(".modal.modal-notification").addClass(type);
            $(".modal.modal-notification").find("button." + type).show();
            $(".modal-notification").modal('show');
        }
    },
    Alert: function (title, message, type) {
        this.Dialog.Show(title, message, type);
    },
    SetSideNav: {
        Ready: function () {
            this.OnClickRedirect();
            this.OnLoadShowDefaultMenu();
            this.OnCollapseMakeActive();
        },
        OnClickRedirect: function () {
            $('.side-nav .panel-heading').on('click', function () {
                var url = $(this).find('a').attr("href");
                if (url !== undefined) {
                    window.location.href = url;
                }
            });
        },
        OnCollapseMakeActive: function () {
            $('.side-nav .collapse').on('show.bs.collapse', function () {
                $("div.panel-heading").removeClass('active');
                $(this).closest('div').prev("div.panel-heading").addClass("active");

            });
        },
        OnLoadShowDefaultMenu: function () {
            /* trigger to toggle selected nav */
            var href = $('.side-nav .panel-heading.active').attr("href");
            if (href !== undefined) {
                $('.side-nav .panel-heading.active').trigger("click");
                $('.side-nav .panel-heading.active').next().find("a.active").addClass("on");
            } else {
                $('.panel-body').find("a.active").addClass("on").closest(".panel-collapse").prevAll(".panel-heading").trigger('click');
            }
        }
    },
    PerformSort: function (path, callback) {
        var id = new Array();
        if (once === true)
            return null;
        once = true;
        $(document).on('click', '.panel-footer .btn-sort', function () {
            var ids = $(".table-sortable").find("tbody").find("tr");
            var self = this;
            var page = 0;
            var exist = $(this).closest("div.panel-admin").find("ul.pagination").length;
            if (exist) {
                page = $(this).closest("div.panel-admin").find("ul.pagination").find("li.active").find("a").text();
            }
            $(ids).each(function (k, v) {
                id[k] = $(v).attr("class");
            });
            var href = basePath + path;
            $.ajax({
                url: href,
                data: {ids: id.join(","), page: page}
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status)
            }).done(function (data) {
                $(self).next(".loader").hide();
                App.Dialog.Show("Success", "Records successfully updated", "success");
                if (typeof callback !== "undefined") {
                    var c = callback(data);
                }
            });
            return false;
        });
    },
    OnAjaxError: function (status) {
        if (status == 403) {
            App.Alert("Session Expired", "Your session has expired. Please login again", "error");
            parent.window.location.href = basePath + "users/login";
        }
    },
    AjaxValidation: function ($form, invalid) {
        $($form).find(".help-block").remove();
        $.each(invalid.error, function (index, value) {
            var $helpBlock = $('<span class="help-block"></span>');
            $helpBlock.text(value[0]);
            $($form).find(".input-sm." + index).after($helpBlock);
        });
    },
    Guide: {
        Ready: function () {
            var isExist = $("a.panel-help").length;
            $(".modal-guide").modal("hide");
            if(isExist) {
                $(".modal-guide").modal({backdrop:"static"});
                $(".modal-guide").modal("hide");
            }
        }
    },
    CheckAll: {
        Ready: function () {
            this.OnCheckAll();
        },
        OnCheckAll: function () {
            var exists = $(".table thead tr th").find("input.check-all").length;
            if (exists) {
                $(document).on("change", "input.check-all", function (event) {
                    $(".table tbody").find("input:checkbox").prop('checked', $(this).prop("checked"));
                });
            }
        }
    },
    Table: {
        Ready: function () {
            this.OnDelete();
        },
        OnDelete: function () {
            var id = 0;
            var keyId = 0;
            var href = "";
            var exists = $(".table-bordered tr a.delete").length;
            if (!exists)
                return false;

            $(document).on("click", ".table-bordered tr a.delete", function (event) {
                id = $(this).attr("id");
                keyId = $(this).attr("key_id");
                href = $(this).attr("link");
                var msg = $(this).attr("message");
                var title = $(this).attr("title");
                var head = $(this).attr("alt");
                if ($.trim(title) === "") {
                    title = head;
                }
                App.Dialog.Show(title, msg, "confirm");
                event.preventDefault();
                $("table.table-bordered").find("tr." + id).css({"background-color": '#FCEDED'}, 'slow');
                return false;
            });
            $(document).on("click", ".modal.modal-notification .notification button", function (event) {
                var confirm = $(this).attr("value");
                if (confirm == 1) {
                    if (href != "undefined") {
                        $("table.table-bordered").find("tr." + id).animate({opacity: '.30'}, 'slow');
                        window.location.href = basePath + href + "/key_id:" + keyId + "/id:" + id;
                    }
                } else {
                    return false;
                }
            });
            $('.modal').on('hidden.bs.modal', function () {
                $("table.table-bordered").find("tr." + id).css({"background-color": '#FFFFFF'}, 'slow');
            });
        }
    },
    isVisible: function (classOrId) {
        var element = $(classOrId);
        if (element.length > 0 && element.css('visibility') !== 'hidden' && element.css('display') !== 'none') {
            return true;
        } else {
            return false;
        }
    },
    isContainsURLParam: function (url) {
        var split = url.split(":");
        return split.length == 2 ? false : true;
    },
    parseURL: function (url) {
        var parser = document.createElement('a'),
                searchObject = {},
                queries, split, i;
        parser.href = url;

        queries = parser.search.replace(/^\?/, '').split('&');
        for (i = 0; i < queries.length; i++) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    },
    isValidEmail: function (email) {
        var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        return filter.test(email);
    },
    Download: function (url, data) {
        var $iframe,
                iframe_doc,
                iframe_html;
        if (($iframe = $('#download_iframe')).length === 0) {
            $iframe = $("<iframe id='download_iframe'" +
                    " style='display: none' src='about:blank'></iframe>"
                    ).appendTo("body");
        }
        iframe_doc = $iframe[0].contentWindow || $iframe[0].contentDocument;
        if (iframe_doc.document) {
            iframe_doc = iframe_doc.document;
        }
        iframe_html = "<html><head></head><body><form method='POST' action='" +
                url + "'>";
        Object.keys(data).forEach(function (key) {
            iframe_html += "<input type='hidden' name='" + key + "' value='" + data[key] + "'>";

        });
        iframe_html += "</form></body></html>";
        iframe_doc.open();
        iframe_doc.write(iframe_html);
        $(iframe_doc).find('form').submit();
    },
    iFrameResize: function () {
        var level = document.location.search.replace(/\?/, '') || 0;
        $('#nested').attr('href', 'frame.nested.html?' + (++level));
    }
};

$(document).ready(function () {
    App.Ready();
});

