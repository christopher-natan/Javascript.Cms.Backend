/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Videos = {
    Ready: function () {
        this.AddEdit.Ready();
        this.View.Ready();
    },
    AddEdit: {
        Ready: function () {
            this.Youtube.Ready();
            this.Video.Ready();
            this.Category.Ready();
            this.Tab.Ready();
            this.ButtonGroup.Ready();
            this.PinEntry.Ready();
            this.Initialize.Ready();
        },
        Initialize: {
            Ready: function () {
                if ($('.datetimepicker').length >= 1) {
                    $('.datetimepicker').datetimepicker();
                }
            }
        },
        PinEntry: {
            Ready: function () {
                this.KeyUp();
                this.Change();
            },
            KeyUp: function () {
                $(document).on('keyup', 'input.pin', function (event) {
                    var pintTotal = $("select.pin-total").val();
                    var v = this.value;
                    if (v.length > parseInt(pintTotal)) {
                        this.value = this.value.slice(0, -1);
                    }
                    if ($.isNumeric(v) === false) {
                        this.value = this.value.slice(0, -1);
                    }
                });
            },
            Change: function () {
                $(document).on('change', 'select.pin-total', function (event) {
                    $('input.pin').trigger("keyup");
                });
            }
        },
        Category: {
            Ready: function () {
                this.OnClickAdd();
            },
            OnClickAdd: function () {
                var parent = this;
                $(document).on('click', 'a.add-category', function () {
                    $(".modal-popup").modal("show");
                });
            }
        },
        ButtonGroup: {
            Ready: function () {
                this.OnClick();
            },
            OnClick: function () {
                var parent = this;
                $(document).on('click', 'div.btn-group button', function () {
                    var param = $(this).attr("param");
                    $(this).parent().find("button").removeClass("active");
                    $(this).addClass("active");
                    $("div.shows").hide();
                    $("div." + param).show();
                });
                $('div.btn-group button').first().trigger("click");
            }
        },
        Video: {
            Ready: function () {
                this.OnClickDownloadXML();
                this.OnSelectCustomBitrate();
                this.OnSelectContentType();
            },
            OnClickDownloadXML: function () {
                var parent = this;
                $(document).on('click', 'a.download-xml', function () {
                    var href = basePath + "videos/download";
                    window.location = href;
                    return false;
                });
            },
            OnSelectCustomBitrate: function () {
                var parent = this;
                $(document).on('change', 'select.bitrate', function () {
                    var val = $(this).val();
                    var $formGroup = $(this).closest("div.form-group").next("div.form-group");
                    if (val === specialNumber) {
                        $formGroup.show();
                        $formGroup.find("input").focus();
                    }
                    else
                        $(this).closest("div.form-group").next("div.form-group").hide();
                });
                $("select.bitrate").trigger("change");
            },
            OnSelectContentType: function () {
                var parent = this;
                $(document).on('change', 'select.content-type', function () {
                    var val = $(this).val();
                    var $chapter = $("select.chapter-count");
                    var $episode = $("select.episode-count");
                    var $movieType = $("div.movie-type");
                    var $episodeType = $("div.episode-type");
                    if ($episodeType.length <= 0)
                        return false;
                    if (val == "episode") {
                        $chapter.closest(".form-group").hide();
                        $episode.closest(".form-group").fadeIn();
                        $movieType.hide();
                        $episodeType.fadeIn();
                    }
                    else {
                        $chapter.closest(".form-group").fadeIn();
                        $episode.closest(".form-group").hide();
                        $movieType.fadeIn();
                        $episodeType.hide();
                    }
                });
                $("select.content-type").trigger("change");
            }
        },
        Youtube: {
            Ready: function () {
                this.OnSelectAddType();
            },
            OnSelectAddType: function () {
                var parent = this;
                var val = $('div#youtube select.add-type').val();
                parent.PerformShowHide(val);
                $(document).on('change', 'div#youtube select.add-type', function () {
                    var val = $(this).val();
                    parent.PerformShowHide(val);
                });
            },
            PerformShowHide: function (val) {
                $('div#youtube .dynamic').hide();
                if (val) {
                    $('div#youtube .' + val).show();
                }
                if (val == 1)
                    $("select.max-results").closest(".form-group").show();
                else
                    $("select.max-results").closest(".form-group").hide();
                $('div#youtube').find("textarea").focus();
            }
        },
        Tab: {
            IsLoaded: false,
            Ready: function () {

            },
            OnClick: function () {
                var parent = this;
                $(document).on('click', '.videos .nav-tabs li.active a', function () {
                    var attr = $(this).attr("href");
                    $(".tab-content").find("input.category-ids").attr("disabled", true);
                    $(attr).find("input.category-ids").removeAttr("disabled");
                });
            },
            Trigger: function () {
                $('.nav-tabs li.active a').trigger("click");
            }
        }
    },
    View: {
        Ready: function () {
            this.FilterByCategory.Ready();
            this.OnSortUpdate.Ready();
            this.OnDelete();
            this.OnChangeDisplayItem.Ready();
            this.OnClickSortBy();
            this.OnChangeFilterBySubscription();
            this.OnAssignSelectedItem();
            this.OnChangeChannel();
            this.OnTransferSelected();
        },
        OnTransferSelected: function () {
            $(document).on('click', 'a.link-transfer-selected', function (e, data) {
                var isChecked = $(".ajax-target-video-contents table.table tbody tr td").find('input:checkbox:checked').length;
                
                if (isChecked) {
                    e.stopPropagation();
                    $("#dropdown-1").dropdown('toggle');
                } else {
                    App.Alert("Select Items", "Please select media items from the table list", "error");
                }
            });
        },
        OnAssignSelectedItem: function () {
            $(document).on('click', '.dropdown-steady-on .dropdown-menu div.checkbox', function (e) {
                e.stopPropagation();
            });

            $(document).on('click', 'a.assign-selected-item', function (e, data) {
                var itemChecked = $("div.ajax-target-video-contents").find("table").find('input:checkbox:checked').length;
                var subscriptionChecked = $("div.dropdown-steady-on").find(".dropdown-menu").find('input:checkbox:checked').length;
                if (itemChecked <= 0) {
                    App.Alert("Select Items", "Please select media items from the table list", "error");
                    return true;
                }
                if (subscriptionChecked <= 0) {
                    App.Alert("Select Subscription", "Please select subscription(s) to assign.", "error");
                    e.stopPropagation();
                    return false;
                }

                var selectedItems = $("div.ajax-target-video-contents").find("table").find('input:checkbox:checked');
                var itemsI = new Array();
                $.each(selectedItems, function (i, d) {
                    itemsI[i] = $(this).val();
                });
                if (itemsI.length <= 0)
                    return false;

                var selectedSubscriptions = $("div.dropdown-steady-on").find(".dropdown-menu").find('input:checkbox:checked');
                var itemsS = new Array();
                $.each(selectedSubscriptions, function (i, d) {
                    itemsS[i] = $(this).val();
                });
                if (itemsS.length <= 0)
                    return false;

                $.ajax({
                    url: basePath + "items/assignSubscription",
                    data: {subscriptions: itemsS, items: itemsI}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    App.Dialog.Show("Success", "Records successfully updated", "success");
                    if (App.IsJsonFormat(data)) {
                        var results = $.parseJSON(data);
                        if (results.success !== undefined) {
                            window.location.href = basePath + "items/by_subscription/" + results.redirect;
                        }
                    }
                });

            });
        },
        OnChangeChannel: function () {
            $(document).on('change', '.filter-channels select.select-channel', function (e, data) {
                var val = $(this).val();
                var url = basePath + "items/by_subscription/channel_id:" + val;
                window.location.href = url;
            });
            
            $(document).on('change', 'select.select-channel.filter', function (e, data) {
                var val = $(this).val();
                var url = basePath + "items/view/channel_id:" + val;
                window.location.href = url;
            });
        },
        OnClickSortBy: function () {
            $(document).on('change', 'select.sort-by', function (e, data) {
                var sortBy = $(this).val();
                var splits = sortBy.split("-");
                var url = basePath + "items/view/sort:" + splits[0] + "/direction:" + splits[1];
                window.location.href = url;
            });
        },
        OnChangeFilterBySubscription: function () {
            $(document).on('change', 'select.subscription-id', function (e, data) {
                var val = $(this).val();
                var url = basePath + "items/by_subscription/key_id:" + val;
                window.location.href = url;
            });
        },
        FilterByCategory: {
            Ready: function () {
                this.OnFilter();
            },
            OnFilter: function () {
                $('.jstree').on('select_node.jstree', function (e, data) {
                    var categoryId = data.node.id;
                    var parentCategoryId = data.node.parents;
                    $("input.category-id").val(categoryId);
                    $("input.parent-category-id").val(parentCategoryId.join(","));
                });
            }
        },
        OnChangeDisplayItem: {
            Ready: function () {
                $(document).on("change", "select.display-item", (function () {
                    var value = $(this).val();
                    $("input.limit-items").val(value);
                    $("button.filter-items").trigger("click");
                }));
            }
        },
        OnSortUpdate: {
            Ready: function () {
                var exists = $(".table th.th-sort-order").length;
                $(document).on('click', '.panel-footer .btn-sorts', function () {
                    var ids = $("table.table-sortable").find("tbody").find("tr");
                    var id = [];
                    var val = {};
                    var href = "";
                    var self = this;
                    var page = 0;
                    var index = 0;
                    var paginationExist = $(this).closest("div.panel-admin").find("ul.pagination").length;
                    if (paginationExist) {
                        page = $(this).closest("div.panel-admin").find("ul.pagination").find("li.active").find("a").text();
                    }
                    if (exists === 1) {

                        /* loop through tr and get class as ID */
                        $(ids).each(function (k, v) {
                            var id = $(v).attr("class");
                            var sort = parseInt($(v).find("input.input-sort-order").val());
                            val[sort] = {id: id};
                        });
                        var id = [];
                        $.each(val, function (k, v) {
                            id[index] = v.id;
                            ++index;
                        });
                    } else {
                        var ids = $(".table-sortable").find("tbody").find("tr");
                        $(ids).each(function (k, v) {
                            id[k] = $(v).attr("class");
                        });
                    }

                    $.ajax({
                        url: basePath + "items/order",
                        data: {ids: id.join(","), page: 0}
                    }).error(function (xhr, ajaxOptions, thrownError) {
                        App.OnAjaxError(xhr.status);
                    }).done(function (data) {
                        $(self).next(".loader").hide();
                        App.Dialog.Show("Success", "Records successfully updated", "success");
                    });

                });
            }
        },
        OnDelete: function () {
            $(document).on('click', "button.delete-items", function () {
                var $currentActiveTable = $("div.view-video-contents").find("table.table-custom tr td");
                var totalCheckBoxes = $currentActiveTable.find("input[type='checkbox']:checked").length;
                var $buttonYes = $("div.modal-dialog").find(".btn-danger.confirm");
                var $buttonNo = $("div.modal-dialog").find(".btn-success.confirm");
                var $buttonClose = $("div.modal-dialog").find(".btn-default.success");
                if (totalCheckBoxes <= 0) {
                    App.Alert("No Selected Item(s)", "Please select item(s) from the list", "error");
                    $buttonYes.hide();
                    $buttonClose.show();
                    $buttonClose.removeClass("btn-danger");
                    $buttonClose.text("Close");
                } else {
                    App.Alert("Delete Items", "Are you sure you want to delete the selected item(s)?", "confirm");
                    var isVisible = $buttonNo.is(":visible");
                    $buttonYes.hide();
                    $buttonClose.show();
                    $buttonClose.addClass("btn-danger");
                    $buttonClose.text("Yes");
                }
            });
            $(document).on('click', "div.modal-dialog .btn-default.success", function () {
                var isVisible = $("div.modal-dialog .btn-success.confirm").is(":visible");
                if (!isVisible) {
                    return false;
                }
                var $currentActiveTable = $("div.view-video-contents").find("table.table-custom tr td");
                var $checboxes = $currentActiveTable.find("input[type='checkbox']:checked");
                var checked = [];
                var targetUrl = basePath + "items/deleteIds";
                $($checboxes).each(function () {
                    checked.push($(this).val());
                });
                $.ajax({
                    url: targetUrl,
                    method: "POST",
                    data: {ids: checked, "category_id": $("input.current-id.category-id").val()}
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    $("body").css("opacity", .4);
                    window.location.href = "";
                });
                return false;
            });
        },
        Transfer: function (element) {
            var $currentActiveTable = $("div.view-video-contents").find("table.table-custom tr td");
            var totalCheckBoxes = $currentActiveTable.find("input[type='checkbox']:checked").length;
            var $checboxes = $currentActiveTable.find("input[type='checkbox']:checked");
            var checked = [];
            var categoryId = $.trim($("input.current-id.category-id").val());
            if (categoryId === "parent_all") {
                App.Alert("No Category", "Please select category from the list", "error");
                return false;
            }
            if (totalCheckBoxes <= 0) {
                App.Alert("No Selected Item(s)", "Please select item(s) from the list", "error");
                $("img.loader").hide();
                $(element).removeAttr("disabled");
                return false;
            }
            $("body").css("opacity", .4);
            var targetUrl = basePath + "items/transfer";
            $($checboxes).each(function () {
                checked.push($(this).val());
            });
            $.ajax({
                url: targetUrl,
                method: "POST",
                data: {ids: checked, "category_id": categoryId}
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                window.location.href = "";
            });
        }
    },
    Lists: {
        Ready: function () {
            var existing = $("div.ajax-video-contents").length;
            if (existing >= 1) {
                this.OnKeyUpFilter();
                this.OnClickViewSelected();
                this.OnCheckVideo();
            }
        },
        ByChannelId: function (by, channelId, func) {
            if (typeof by == "undefined") {
                by = "channel_id";
                var channelId = $("select.channel-id").val();
            }
            if ($("div.ajax-video-contents").length >= 1) {
                var targetUrl = basePath + "videos/lists/" + by + ":" + channelId;
                $.ajax({
                    url: targetUrl,
                    cache: true
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                    var contents = $("div.ajax-video-contents").html(data);
                    if ($.trim($("input.video-ids").val()) != "") {
                        var videoIds = $.trim($("input.video-ids").val());
                        var splits = videoIds.split(",");
                        $.each(splits, function (i, v) {
                            $("div.ajax-video-contents").find("input[value='" + v + "']").attr("checked", true);
                        });
                    }
                    var checked = $("div.ajax-video-contents :checkbox:checked");
                    if (checked.length <= 0) {
                        $("input.video-ids").val("");
                    }
                    if (typeof func != "undefined") {
                        func();
                    }
                    /*hide button or link if video is empty*/
                    var noRecord = $("div.ajax-video-contents").find("div.no-records-found").length;

                    if (noRecord >= 1) {
                        $("a.save-selected").hide();
                    } else {
                        $("a.save-selected").show();
                    }
                });
            }
        },
        ByCategoryId: function (by, channelId) {
            this.ByChannelId(by, channelId);
        },
        OnKeyUpFilter: function () {
            $(document).on("keyup", "input.filter-videos", function () {
                var filter = $(this).val().toLowerCase();
                if (filter) {
                    $("div.ajax-video-contents").find(".form-group a:not(:contains(" + filter + "))").closest(".form-group").hide();
                    $("div.ajax-video-contents").find(".form-group a:contains(" + filter + ")").closest(".form-group").show();
                } else {
                    $("div.ajax-video-contents").find(".form-group").show();
                }
            });
        },
        OnClickViewSelected: function () {
            var viewSelected = "View Selected Videos";
            var viewAll = "View All Videos";

            $(document).on("click", "a.view-selected", function () {
                var count = $("div.ajax-video-contents").find(".form-group input:checked").length;
                if (count >= 1) {
                    if ($.trim($(this).text()) === viewSelected) {
                        $(this).text(viewAll)
                        $("div.ajax-video-contents").find(".form-group input:not(:checked)").closest(".form-group").hide();
                        $("div.ajax-video-contents").find(".form-group input:checked").closest(".form-group").show();
                    } else {
                        $(this).text(viewSelected)
                        $("div.ajax-video-contents").find(".form-group").show();
                    }
                } else {
                    App.Alert("No Selected", "There are no video(s) selected", "error");
                }
            });
        },
        OnCheckVideo: function () {
            $(document).on("change", "div.ajax-video-contents :checkbox", (function () {
                var checked = $("div.ajax-video-contents :checkbox:checked");
                var ids = [];
                var names = [];

                $.each(checked, function (i, v) {
                    ids[i] = $(v).val();
                    names[i] = "<span class='label label-default'>" + $(this).next("span").text() + "</span>";
                });
                $("input.video-ids").val(ids.join(","));
                $("div.videos-added").html(names.join(" "));
            }));
        }
    }
};

$(document).ready(function () {
    if ($.trim(parse.controller) === "Videos") {
        Videos.Ready();
    }
});