/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Categories = {
    Ready: function () {
        this.OnChangeChannel.Ready();
        this.OnClickUpdateSortOrder();
        this.File.Ready();
        Videos.Lists.Ready();
        this.Defaults.Ready();
        this.View.Ready();
    },
    Defaults: {
        Ready: function () {
            var height = $("div.categories").find("div.layout-divide-left").height();
            $("div.categories").find("div.layout-divide-right").find("div.ajax-video-contents").css("max-height", height - 200 + "px");
        }
    },
    View: {
        Ready: function () {
            this.OnChangeScreenType();
        },
        OnChangeScreenType: function () {
            $(document).on('change', 'select.screen-type', function () {
                var val = $.trim($(this).val());
                if (val === "List") {
                    $("select.display-poster-image").closest("div.form-group").show();
                } else {
                    $("select.display-poster-image").closest("div.form-group").hide();
                }
            });
        }
    },
    File: {
        Ready: function () {
            this.OnChangeFile();
        },
        OnChangeFile: function () {
            $(document).on('change', 'input.file', function () {
                var accept = $(this).attr("accept");
                var types = {image: /\.(gif|jpg|jpeg|tiff|png)$/i, xml: /\.(xml)$/i};
                var current = types.image;
                $(".fileupload-preview").find("img").show();
                if ($(this).val() !== "") {
                    var $maxByte = 1048576;
                    if (this.files[0].size > $maxByte) {
                        App.Alert("Image Size Invalid", 'Please upload image size less than or equal 1MB', "error");
                        $(this).val("");
                        $(".fileupload-preview").find("img").hide();
                        return false;
                    }
                }

                if (accept.length >= 1) {
                    if (accept === "text/xml")
                        current = types.xml;
                }
                var filename = $(this).val();
                if (!(current).test(filename.toLowerCase())) {
                    App.Alert("Invalid", 'Please select ' + accept + ' file only', "error");
                    $(this).val("");
                    return false;
                }
                $(this).nextAll("div").removeClass("bg-white").text("");
            });
        }
    },
    OnAddVideo: {
        Validate: function () {
            var existing = $(".tab-pane.active").length;
            $("input.category-ids").closest(".form-group").hide();
            if (existing) {
                var errorMessage = $(".tab-pane.active").find("input.category-ids").next(".help-block").text();
                $("div.category.help-block").text(errorMessage);
                return false;
            }

            return true;
        },
        AssignCategoryIds: function () {
            var existing = $("input.category-ids").length;
            if (existing >= 1) {
                var checked = $(".jstree").jstree("get_checked", null, true);
                var joins = checked.join(",");
                $("input.category-ids").val(joins);
            }
        },
        IsCategoryIdsAndNotEmpty: function () {
            if ($("input.category-ids").length <= 0) {
                return false;
            }
            if ($.trim($("input.category-ids").val()) == "") {
                return false;
            }
            return true;
        },
        SetDefaultSelected: function ($jstree) {
            var isCheckBoxPluginExist = $.inArray("checkbox", Categories.Tree.Plugins) + 1;
            var me = this;
            if (me.IsCategoryIdsAndNotEmpty() == false && isCheckBoxPluginExist >= 1) {
                var previousParentId = $("input.previous-parent-id").val();
                if (parseInt(previousParentId) >= 1) {
                    $($jstree).jstree("select_node", previousParentId);
                }
                $(me).jstree('deselect_all');
                /* if no selected */
                var selected = $(".jstree").jstree("get_selected", null, true);
                if ($.trim(selected) == "") {
                    $(".jstree").jstree("select_node", "parent_all");
                }
            }

        }
    },
    ParentProperties: {
        Ready: function () {
            this.ShowHide();
            this.PinEntry.Ready();
        },
        ShowHide: function (data) {
            var existing = $("div.parent-properties").length;
            if (existing) {
                $("button.assign-photo").click(function () {
                    if ($("table.table-sortable").is(":visible")) {
                        $("div.sort-properties").hide();
                        $("div.parent-properties").removeClass("hidden").show();
                        $(this).closest("div.parent-sub-categories").prev(".panel-note").hide();
                        $("div.parent-properties").find("h4").text("Add More Details To Category " + $(".jstree").find(".jstree-clicked").text());
                    } else {
                        $("div.sort-properties").removeClass("hidden").show();
                        $("div.parent-properties").hide();
                        $(this).closest("div.parent-sub-categories").prev(".panel-note").show();
                    }
                });
                if ($("table.table-sortable").is(":visible") === false) {
                    $("div.parent-properties").find("h4").text("Add More Details To Category " + $(".jstree").find(".jstree-clicked").text());
                    $("div.sort-properties").hide();
                    $("div.parent-properties").removeClass("hidden").show();
                    $("div.parent-properties").find(".assign-photo").hide();
                    $(this).closest("div.parent-sub-categories").prev(".panel-note").hide();
                }
            }
        },
        PinEntry: {
            Ready: function () {
                var exist = $('input.pin').length;
                if(!exist) return false;
                
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
        }
    },
    Tree: {
        Plugins: [],
        Initialize: function (data, plugin, element) {
            var me = this;
            var plugins = me.GetPlugins(plugin);
            me.Plugins = plugins;
            var contextMenu = me.GetContextMenu;
            var $jstree = $(".jstree").jstree({
                'plugins': plugins,
                "checkbox": {"three_state": false},
                'core': {
                    'data': data,
                    'themes': {
                        'name': 'proton',
                        'responsive': true
                    },
                    "check_callback": true
                },
                "contextmenu": contextMenu
            });
            me.OnEvents.Execute($jstree);
        },
        GetPlugins: function (plugins) {
            if (typeof plugins == "undefined") {
                var plugins = [];
            }
            return plugins;
        },
        GetContextMenu: {
            "select_node": true,
            "items": function ($node) {
                var tree = $(".jstree").jstree(true);
                return {
                    createItem: {
                        "label": "Create",
                        "action": function (obj) {
                            $node = tree.create_node($node);
                            tree.edit($node);
                        },
                        "_class": "class"
                    },
                    renameItem: {
                        "label": "Rename",
                        "action": function (obj) {
                            if ($node.parent != "#") {
                                tree.edit($node);
                            }
                        },
                        "icon": "icon-edit"
                    },
                    deleteItem: {
                        "label": "Delete",
                        "action": function (obj) {
                            Categories.Tree.OnEvents.OnDeleteNode(this, $node);
                        },
                        "separator_before": true,
                        "separator_after": false,
                        "icon": "icon-remove"
                    }
                };
            }
        },
        OnEvents: {
            SelectedNodeText: "",
            ShouldAlwaysOneNodeSelected: function ($jstree) {
                $jstree.bind('ready.jstree', function (e, data) {
                    // invoked after jstree has loaded
                    var selected = $(this).jstree("get_selected");
                    if (selected.length == 0) {
                        $(this).jstree("select_node", "parent_all");
                    }
                    if (selected.length >= 2) {
                        $(this).jstree("deselect_node", "parent_all");
                    }
                });
            },
            Execute: function ($jstree) {
                var $tree = $(".jstree").jstree(true);
                var me = this;
                $jstree.on('loaded.jstree', function (e, data) {
                    $(this).jstree("open_node", "parent_all");
                    var isValidationErrorOnAddingVideo = Categories.OnAddVideo.Validate();
                    if (Categories.OnAddVideo.IsCategoryIdsAndNotEmpty()) {
                        Categories.Tree.Set.OpenAndSelectNodGetFromCategoryIds(this);
                    } else {
                        Categories.Tree.Set.OpenAndSelectNodGetFromCurrentId(this);
                    }
                    Categories.OnAddVideo.SetDefaultSelected(this);
                    //Categories.OnChangeChannel.OnToggleFilter();
                    Categories.Load.VideoList();
                    Categories.OnFilterVideo.AssignText();
                }).on('select_node.jstree', function (e, data) {
                    var parentNodeId = data.node.parent;
                    var currentNodeId = data.node.id;
                    me.SelectedNodeText = data.node.text;

                    $("input.children-id").val(data.node.children_d);
                    $(this).jstree("open_node", currentNodeId);
                    Categories.Tree.Set.AssignCurrentAndParentId(currentNodeId, parentNodeId);
                    Categories.Load.ParentOrSubCategories(currentNodeId, parentNodeId);

                    Categories.OnAddVideo.AssignCategoryIds();
                    me.OnCheckNodeNodeParentAllNotAllowed(this, data);
                }).on('deselect_node.jstree', function (e, data) {
                    Categories.OnAddVideo.AssignCategoryIds();
                }).on('move_node.jstree', function (e, data) {
                    me.OnMoveNodeToOther($tree, data);
                }).on('create_node.jstree', function (e, data) {

                }).on('changed.jstree', function (e, data) {

                }).on('refresh.jstree', function (e, data) {
                    me.OnRefreshNode(this);
                    Categories.OnFilterVideo.AssignText();
                }).on('rename_node.jstree', function (e, data) {
                    me.OnRenameNode(this, data);
                });
                me.ShouldAlwaysOneNodeSelected($jstree);
            },
            OnMoveNodeToOther: function ($jstree, data) {
                var parentId = data.node.parent;
                var parentIds = data.node.parents;
                var currentId = data.node.id;

                /* get the children for sorting */
                var parentSortId = data.node.parent;
                var childSortId = [];
                var childSortIdJoin = "";
                var i = 0;
                if (parentSortId === "#") {
                    parentSortId = "parent_all";
                }
                $("#" + parentSortId).find("ul").children().each(function () {
                    childSortId[i] = $(this).attr("id");
                    ++i;
                });
                childSortIdJoin = childSortId.join("-");
                /* get the children for sorting */
                if ($.trim(parentId) === "#") {
                    $jstree.refresh();
                    return false;
                }
                var href = basePath + "categories/move/parent:" + parentId + "/current:" + currentId + "/sort:" + childSortIdJoin;
                $.ajax({
                    url: href
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {
                });
            },
            OnCheckNodeNodeParentAllNotAllowed: function ($jstree, data) {
                var isCheckBoxPluginExist = $.inArray("checkbox", Categories.Tree.Plugins) + 1;
                if (isCheckBoxPluginExist >= 1) {
                    if ($.trim(data.node.id) == "parent_all") {
                        $($jstree).jstree("deselect_node", data.node.id);
                    }
                }
            },
            OnRefreshNode: function ($jstree) {
                var isCheckBoxPluginExist = $.inArray("checkbox", Categories.Tree.Plugins) + 1;

                $($jstree).jstree('deselect_all');
                var previousParentId = $("input.previous-parent-id").val();
                if (parseInt(previousParentId) >= 1) {
                    $($jstree).jstree("select_node", previousParentId);
                }
                var selected = $($jstree).jstree("get_selected");
                if ($.trim(selected) == "" && isCheckBoxPluginExist <= 0) {
                    $($jstree).jstree("select_node", "parent_all");
                }
            },
            OnRenameNode: function ($jstree, data) {
                var nodeData = data;
                var channelId = $("select.channel-id").val();
                var href = basePath + "categories/add";
                var nodeId = data.node.id;
                var parentId = $("input.parent-id").val();
                var currentId = $("input.current-id").val();
                var result = {"id": nodeId, "parent_id": data.node.parent, "name": data.node.text, "channel_id": channelId};
                $.ajax({url: href, method: "POST", data: result}).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status)
                }).done(function (data) {
                    var data = $.parseJSON(data);
                    if (data.success != undefined) {
                        if (data.success.id) {
                            nodeData.instance.set_id(nodeId, data.success.id);
                        }
                    } else {
                        var message = [];
                        var index = 0;
                        $.each(data.error, function (field, error) {
                            message[index] = error[0];
                            ++index;
                        });
                        var errors = message.join("/");
                        App.Dialog.Show(notifications.SaveError.header, message[0], "error");
                        $(".jstree").jstree("set_text", nodeId, Categories.Tree.OnEvents.SelectedNodeText);
                    }
                });
            },
            OnDeleteNode: function ($jstree, $node) {
                ;
                if ($node.parent != "#") {
                    var msg = notifications.DeleteCategory.text;
                    var title = notifications.DeleteCategory.header;
                    var parentId = $("input.parent-id").val();
                    App.Dialog.Show(title, msg, "confirm");
                    $(".modal.modal-notification").find(".notification").hide();
                    $(".modal.modal-notification").find(".instant").removeClass("hidden");
                    $(".modal.modal-notification .instant button.btn-danger").off();
                    $(".modal.modal-notification .instant button.btn-danger").click(function (event) {
                        var confirm = $(this).attr("value");
                        if (confirm == 1) {
                            var id = $node.id;
                            var children = $("input.children-id").val();
                            var targetUrl = basePath + "categories/delete/id:" + id + "/category_id:" + parentId + "/children:" + children;
                            $.ajax({
                                url: targetUrl,
                                cache: false
                            }).error(function (xhr, ajaxOptions, thrownError) {
                                App.OnAjaxError(xhr.status);
                            }).done(function (data) {
                                if (App.IsJsonFormat(data)) {
                                    var json = $.parseJSON(data);
                                    if (json.error === 1) {
                                        setTimeout(function () {
                                            App.Alert("Delete Not Allowed", "Sorry, you can't delete the selected category. Please remove first all sub categories under the selected category.", "error");
                                            $(".modal.modal-notification").find("button.btn-success").text("Close").show();
                                        }, 500);
                                        return false;
                                    }
                                }
                                var tree = $(".jstree").jstree(true);
                                tree.delete_node($node);
                                $(".jstree").find("li a.jstree-clicked").removeClass("jstree-clicked");
                                $(".jstree").jstree("select_node", parentId);
                                /* if no selected */
                                var selected = $(".jstree").jstree("get_selected", null, true);
                                if (selected.length <= 0) {
                                    //$jstree.refresh();
                                }
                            });
                        } else {
                            $(".modal").modal("hide");
                        }
                    });
                }
            }
        },
        Set: {
            OpenAndSelectNodGetFromCurrentId: function ($jstree) {
                var currentNodeId = $("input.current-id").val();
                if ($.trim(currentNodeId) == "") {
                    currentNodeId = $("input.parent-id").val();
                }

                /*prevent from checking all checkbox if there's checkbox plugin*/
                var isCheckBoxPluginExist = $.inArray("checkbox", Categories.Tree.Plugins) + 1;
                if (isCheckBoxPluginExist) {
                    if (currentNodeId <= 0) {
                        currentNodeId = "parent_all";
                        $($jstree).jstree("open_node", currentNodeId);
                        $($jstree).jstree("select_node", currentNodeId);
                    }
                    return false;
                }
                if (parse.action != "edit" || $.trim(currentNodeId) == "parent_all") {
                    $($jstree).jstree("open_node", currentNodeId);
                    $($jstree).jstree("select_node", currentNodeId);
                }
            },
            OpenAndSelectNodGetFromCategoryIds: function ($jstree) {
                var categoryIds = $("input.category-ids").val();
                var split = categoryIds.split(",");
                $(split).each(function (key, val) {
                    $($jstree).jstree("select_node", val);
                    $($jstree).jstree("open_node", val);
                });
            },
            AssignCurrentAndParentId: function (currentNodeId, parentNodeId) {
                if ($.trim(currentNodeId) == "parent_all") {
                    //currentNodeId = 0;
                }
                $("input.current-id").val(currentNodeId);
                $("input.parent-id").val(parentNodeId);
            }
        },
        Reset: function () {
            $(document).on("click", "a.reset-tree", function () {
                $(".jstree").jstree('deselect_all');
                $(".jstree").jstree('close_all');
            });
        }
    },
    OnFilterVideo: {
        AssignText: function () {
            var existing = $(".filter-toggle").length;
            if (existing >= 1) {
                var categoryName = $(".jstree .jstree-clicked").text();
                if ($.trim(categoryName).length <= 0 || $.trim(categoryName) == "Categories") {
                    categoryName = "All Categories";
                }
                $(".filter-toggle").text(categoryName);
            }
        }
    },
    OnChangeChannel: {
        Ready: function () {
            Channels.SelectChannel.OnChangeChannel(this.AjaxCallback);
        },
        ReAddSortPropertiesClass: function () {
            var existing = $("div.sort-properties").length;
            if (existing) {
                $("div.sort-properties").removeAttr("class").addClass("sort-properties");
            }
        },
        AjaxCallback: function (data) {
            var me = this;
            if ($.fn.jstree !== undefined) {
                var $jstree = $(".jstree").jstree(true);
                $jstree.settings.core.data = $.parseJSON(data);

                Categories.OnChangeChannel.ReAddSortPropertiesClass();
                Categories.Load.VideoList();
                Categories.OnFilterVideo.AssignText();
                $jstree.refresh();
            }
        }
    },
    OnClickUpdateSortOrder: function () {
        App.PerformSort("categories/order", function (data) {
            var $jstree = $(".jstree").jstree(true);
            $("input.previous-parent-id").val($("input.current-id").val());
            $("select.select-channel").trigger("change");
        });
    },
    Load: {
        PreviousNodeId: "",
        VideoList: function () {
            var existing = $("div.videos-content").length;
            if (existing) {
                Videos.Lists.ByChannelId();
            }
        },
        ParentOrSubCategories: function (currentNodeId, parentNodeId) {
            var existing = $("div.parent-sub-categories").length;
            if (this.PreviousNodeId == currentNodeId) {
                this.PreviousNodeId = "";
                return false;
            }
            this.PreviousNodeId = currentNodeId;
            var existingElem = $("div.cid_" + currentNodeId).length;
            if (existingElem) {
                return false;
            }

            if (existing >= 1) {
                var isSubmit = $("div.form-submit").length;
                var data = {};
                if (isSubmit) {
                    var location = window.location.href;
                    var exist = location.indexOf("submit=true");
                    $("div.form-submit").removeClass("form-submit");
                    data = {submit: true};
                }
                var href = basePath + "categories/show/parent_id:" + currentNodeId;
                $("div.loader").show();
                $("div.parent-sub-categories").css("opacity", ".3");
                $.ajax({
                    url: href,
                    data: data,
                    cache: true
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status);
                }).done(function (data) {

                    var htmls = $("div.parent-sub-categories").html(data);
                    if (currentNodeId == "parent_all") {
                        $(htmls).find("button.assign-photo").hide();
                    }

                    App.Initialize.Sortable.Ready();
                    App.SetAjaxLoader.Ready();
                    App.Initialize.HelpOver.Ready();
                    Categories.ParentProperties.Ready();
                    $("div.loader").hide();
                    $("div.parent-sub-categories").css("opacity", "1");
                    $("select.screen-type").trigger("change");
                });
            }
        }
    }
};

$(document).ready(function () {
    Categories.Ready();
});

