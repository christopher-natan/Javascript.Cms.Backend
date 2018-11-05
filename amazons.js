/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Amazons = {
    Ready: function () {
        this.Filter.Ready();
        this.Bucket.Ready();
        this.Options.Ready();
    },
    Options: {
        Ready: function () {
            this.OnDelete();
            this.OnEdit();
            this.OnRenameInline();
            this.OnSubmit();
        },
        OnDelete: function () {
            var currentData = {};
            var currentTr = "";
            $(document).on("click", ".object-target .table tr td a.delete", function () {
                App.Alert("Deleting Amazon Item", "Are you sure you want to delete this item in your S3? \n\
                            The video that link to this item will be deleted too. ", "confirm");
                var data = $(this).closest("tr").find("td.hidden").find("input").val();
                currentTr = $(this).closest("tr");
                currentData = $.parseJSON(data);
            });

            $(document).on("click", ".modal-dialog .btn-danger", function () {
                var targetUrl = basePath + "amazon/deleteObject";
                var bucket = $("select.select-bucket").val();
                var amazonId = currentTr.attr("class");
                var key = currentData.file;
                $.ajax({
                    url: targetUrl,
                    type: 'POST',
                    data: {bucket: bucket, key: key, amazon_id: amazonId}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $(currentTr).fadeOut().delay("100").remove();
                });
            });
        },
        OnEdit: function () {
            var currentData = {};
            var currentTr = "";
            $(document).on("click", ".object-target .table tr td a.edit", function () {
                var $parentTr = $(this).closest("tr");
                if ($parentTr.find("td input.input-inline").is(":visible") || $parentTr.find("td img.loader").is(":visible")) {
                    return false;
                }

                var loader = "<img class='loader hide' src='" + basePath + "img/ajax-loader.gif" + "'>";
                var $input = $("<input class='input-inline' />");
                var save = "<a href='javascript:void(1)' class='save-inline'><i class='icon icon-save'></i></a>";
                var $target = $parentTr.find("td:nth-child(2)");
                var text = $.trim($target.text());
                var data = $.parseJSON($parentTr.find("td.hidden").find("input").val());
                var key = $.trim(data.file);
                if ($.trim($parentTr.attr("key")) !== "") {
                    key = $parentTr.attr("key");
                }
                $parentTr.attr("key_name", text).attr("key", key);
                $target.html($input.val(text)).append(save);
                $input.val(text).focus();
            });
        },
        OnSubmit: function () {
            $(document).on("submit", ".amazons3-target form", function () {
                var checked = $(this).find(".table tr td input:checked").length;
                if (checked == 0) {
                    $("img.loader").hide();
                    App.Alert("Please Select Item", "Please select Amazon Items from the list", "error");
                    return false;
                }

                var categoryIds = $.trim($(this).find("input.amazon-category-ids").val());
                if (categoryIds === "") {
                    $("img.loader").hide();
                    App.Alert("Please Select Category", "Please select category item from the left", "error");
                    return false;
                }
            });
        },
        OnRenameInline: function () {
            $(document).on("click", "a.save-inline", function () {
                var me = this;
                var $parentTr = $(this).closest("tr");
                var $input = $(this).prev("input.input-inline");
                var key = $parentTr.attr("key");
                var keyname = $.trim($parentTr.attr("key_name"));
                var loader = " <img class='loader' src='" + basePath + "img/ajax-loader.gif" + "'>";
                var ext = $.trim(key.split('.').pop());
                var targetUrl = basePath + "amazon/renameObject";
                var bucket = $("select.select-bucket").val();

                var keytarget = $.trim($(this).prev("input.input-inline").val());
                var keynew = $.trim(keytarget + "." + ext);
                $(this).hide();

                if ($.trim(keyname) === $.trim(keytarget)) {
                    $(me).closest("td").text(keyname);
                    return false;
                }
                $(me).closest("td").html(keytarget + loader);

                $.ajax({
                    url: targetUrl,
                    type: 'POST',
                    data: {bucket: bucket, key: key, newkey: keynew}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var response = $.parseJSON(data);
                    if ($.trim(response.status) === "error") {
                        if (response.code === 0) {
                            App.Alert("Item Exist", response.message, "error");
                        } else {
                            App.Alert("Error", "Sorry, Error occured while proccessing your request. Please try again", "error");
                        }
                        $(me).parent("td").text(keyname);
                    } else {
                        $(me).parent("td").text(keytarget);
                        var split = key.split("/");
                        split.reverse();
                        split[0] = keynew;
                        split.reverse();
                        var join = split.join("/");
                        $parentTr.attr("key", join);
                        $parentTr.attr("key_name", keytarget);
                    }
                    $("img.loader").hide();
                });
            });
        }
    },
    Filter: {
        Ready: function () {
            this.OnKeyUpFilter();
            this.OnHideItems();
        },
        OnKeyUpFilter: function () {
            $(document).on("keyup", "input.filter-object", function () {
                var filter = $(this).val().toLowerCase();
                if (filter) {
                    $("div.object-target").find(".table tr td span:not(:contains(" + filter + "))").closest("tr").hide();
                    $("div.object-target").find(".table tr td span:contains(" + filter + ")").closest("tr").show();
                } else {
                    $("div.object-target").find(".table tr").show();
                }
            });
        },
        OnHideItems: function () {
            $(document).on("click", "input.hide-added", function () {
                var check = $(this).is(":checked");
                if (check) {
                    $("div.object-target").find(".table tr td").find("img").closest("tr").hide();
                } else {
                    $("div.object-target").find(".table tr td").find("img").closest("tr").show();
                }
            });
        }
    },
    Bucket: {
        Ready: function () {
            this.OnChangeBucket();
            this.OnAddVideoFromBucket();
            this.OnSyncToAmazonS3();
            this.OnReFreshBucket();
        },
        Param: "",
        OnChangeBucket: function () {
            var parent = this;
            var me = this;
            $(".object-content").hide();
            $(document).on('change', '#amazons3 select.select-bucket', function () {
                var select = this;
                var val = $(this).val();
                $("div.object-target").css("opacity", ".5");
                $("a.refresh-bucket").attr("disabled", "disabled");
                $(".amazons3-target").find(".btn.btn-primary").hide();
                $(".hide-added-holder").hide();
                var checked = $(".jstree").jstree("get_checked", null, true);
                var joins = checked.join(",");
                if (joins.length >= 1) {
                    $("input.amazon-category-ids").val(joins);
                } else {
                    me.OpenAndSelectNodGetFromCategoryIds();
                }

                if (val == specialNumber)
                    return window.location.href = basePath + "configuration/general/tab:amazons3";
                if ($.trim(val) != "") {
                    $(".object-content").hide();
                    var href = basePath + "amazon/objects" + me.Param;
                    $(select).attr("disabled", "disabled");
                    $.ajax({
                        url: href,
                        type: 'POST',
                        data: {bucket: val}
                    }).error(function (xhr, ajaxOptions, thrownError) {
                        $(select).next(".loader").hide();
                        $(select).removeAttr("disabled");
                        App.OnAjaxError(xhr.status);
                    }).done(function (data) {
                        $(select).next(".loader").hide();
                        $(select).removeAttr("disabled");
                        $("a.refresh-bucket").removeAttr("disabled");

                        if (data.substr(0, 1) == '{') {
                            var json = $.parseJSON(data);
                            if (json.status == "error") {
                                App.Alert("Amazon S3 Error", json.message, "error");
                                $(".object-target").find(".table").hide();
                                $(".filter-object").hide();
                                return false;
                            }
                        } else {
                            $(".amazons3-target").find(".btn.btn-primary").show();
                            $(".filter-object").show();
                        }
                        $(".amazons3-target").find(".btn.btn-primary").show();
                        $(".hide-added-holder").show();
                        $(".object-content").show();
                        $("#amazons3").find(".object-target").html(data);
                        $("div.object-target").css("opacity", "1");
                        $("div.object-target").find(".table tr td").find("img").closest("tr").hide();
                        var count = $("div.object-target").find(".table tbody tr:visible").length;
                        if (!count) {
                            $("input.hide-added").trigger("click");
                        }
                        $("input.filter-object").removeClass("hide");
                        $(".hide-added").attr("checked", true);
                        App.Initialize.ToolTip.Ready();
                        me.Param = "";
                    });
                } else {
                    $(select).next(".loader").hide();
                }
            });
        },
        OpenAndSelectNodGetFromCategoryIds: function () {
            var categoryIds = $("input.amazon-category-ids").val();
            var split = categoryIds.split(",");
            $(split).each(function (key, val) {
                $(".jstree").jstree("select_node", val);
                $(".jstree").jstree("open_node", val);
            });
        },
        OnAddVideoFromBucket: function () {
            $(document).on('click', '#amazons3 a.add-video', function () {
                $(".videos .nav-tabs").find("li").first().find("a").trigger("click");
                var json = $.parseJSON($(this).closest("tr").find("td.hidden").text());
                $.each(json, function ($key, $value) {
                    if ($.trim($key) != "file" && $.trim($key) != "id") {
                        $("#video").find("." + $key).val($value);
                    }
                });
                var trId = $.trim($(this).closest("tr").attr("class"));
                var keyName = $.trim($(this).closest("tr").attr("key_name"));
                if ($.trim(keyName) != "") {
                    $("#video").find("input.name").val(keyName);
                    $("#video").find("textarea.description").val(keyName);
                    $("#video").find("textarea.synopsis").val(keyName);
                }
                $("#video").find("input.amazon-id").val($.trim(json.bucket) + "+" + trId);
            });
        },
        OnReFreshBucket: function () {
            var me = this;
            $(document).on('click', '#amazons3 a.refresh-bucket', function () {
                me.Param = "?refresh";
                $("select.select-bucket").trigger("change");
            });

        },
        OnSyncToAmazonS3: function () {
            $(document).on('click', '#amazons3 a.sync-to-amazons3', function () {
                var href = basePath + "amazon/s3/sync";
                $.ajax({
                    url: href,
                    type: 'GET',
                    cache: true
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $("#amazons3").html(data);
                    App.SetAjaxLoader.Ready();
                    $(".object-content").hide();
                });
            });
        }
    }
};

$(document).ready(function () {
    Amazons.Ready();
});

