/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Storages = {
    storageParent: "div.storage-parent",
    storageContainer: "div.storage-container",
    storageButtons: "div.storage-buttons",
    storageSettings: "div.storage-settings",
    storageContents: "div.storage-contents",
    storageSubContents: "div.storage-sub-contents",
    storageTable: "div.storage-table",
    storageScroller: "div.storage-scroller",
    storageOptions: "div.storage-options",
    storageTabs: "div.storages ul.storage-tabs li a",
    storageSection: "div.my-storage-section",
    addMoreForm: "div.add-more-form",
    centerLoader: "div.text-center.loader",
    noContentsFound: "div.no-contents-found",
    targetUrl: {loadContents: "storages/loadContents", saveContents: "storages/saveContents", loadForm: "items/extend", saveHttpAccess: "storages/saveHttpAccess"},
    Ready: function () {
        this.Defaults.Ready();
        this.ButtonGroup.Ready();
        this.Contents.Ready();
        this.Parent.Ready();
        this.Paginate.Ready();
        this.Checkbox.Ready();
        this.AddSelectedItems.Ready();
        this.AddMore.Ready();
        this.Tab.Ready();
        this.HttpAccess.Ready();
        this.Connect.Ready();
        this.SelectCredentialType.Ready();
        this.StorageSection.Ready();
        this.YoutubeSection.Ready();
    },
    IsJsonFormat: function (data) {
        if (data.substr(0, 1) === '{') {
            return true;
        }
        return false;
    },
    Defaults: {
        Ready: function () {
            $(Storages.centerLoader).hide();
        },
        AssignCategoryIds: function () {
            var existing = Storages.Current.GetStorageContainer().find("input.category-ids").length;
            if (existing >= 1) {
                var checked = $(".jstree").jstree("get_checked", null, true);
                var joins = checked.join(",");
                Storages.Current.GetStorageContainer().find("input.category-ids").val(joins);
            }
        }
    },
    Current: {
        GetStorageContainer: function () {
            var $currentStorageContainer = $(Storages.storageParent).find(Storages.storageContainer + ".active");
            return $currentStorageContainer;
        },
        GetStorageContent: function () {
            var $currentStorageContainer = $(Storages.storageParent).find(Storages.storageContainer + ".active");
            return $currentStorageContainer.find(Storages.storageContents + ":visible");
        },
        GetCenterLoader: function () {
            var $currentStorageContainer = this.GetStorageContainer();
            var $centerLoader = $currentStorageContainer.find(Storages.centerLoader);
            return $centerLoader;
        },
        GetStorageScroller: function () {
            var $currentStorageContainer = this.GetStorageContainer();
            var $storageScroller = $currentStorageContainer.find(Storages.storageScroller);
            return $storageScroller;
        },
        GetActiveStorageTable: function () {
            var $currentStorageContainer = this.GetStorageContainer();
            var $storageActiveStorageTable = $currentStorageContainer.find(Storages.storageTable + ":visible");
            return $storageActiveStorageTable;
        }

    },
    GetStorageName: function () {
        var name = this.Current.GetStorageContainer().attr("id");
        return name.replace("my", "");
    },
    ButtonGroup: {
        Ready: function () {
            this.OnClick();
            this.AutoConnect();
        },
        OnClick: function () {
            var me = this;
            $(document).on("click", Storages.storageButtons + " button.btn", function () {
                var $currentStorageContents = Storages.Current.GetStorageContainer();
                var recordsLoaded = $currentStorageContents.find(Storages.storageTable).length;

                var buttonName = $(this).attr("target");
                me.SetActive(this);
                me.SetShowHideStorage(this);

                /*check if there is a signal synchronize-now*/
                var isSyncNow = $currentStorageContents.find(".synchronize-now").length;

                if (isSyncNow >=1)
                    window.location.href=  "/client/storages/index/tab:myyoutube";

                if (recordsLoaded)
                    return false;
                if ($.trim(buttonName) === "storage-contents") {
                    Storages.Contents.Load(this);
                }
            });
        },
        SetActive: function (element) {
            var $storageButtons = $(element).parent(Storages.storageButtons);
            $storageButtons.find("button.active").removeClass("active");
            $(element).addClass("active");
        },
        /*Show/Hide storage settings or contents */
        SetShowHideStorage: function (element) {
            var storageType = $(element).attr("target");
            var $storageContainer = $(element).closest(Storages.storageContainer);
            $storageContainer.find("div.storage").hide();
            $storageContainer.find("div.storage." + storageType).show();
        },
        AutoConnect: function () {
            var $currentStorageContents = Storages.Current.GetStorageContainer();
            var connectionStatus = $currentStorageContents.find("input.connection-status").val();
            if (connectionStatus >= 1) {
                $currentStorageContents.find(Storages.storageButtons).find("button").last().trigger("click");
            }
        },
        Disable: function (type) {
            var $currentStorageContents = Storages.Current.GetStorageContainer();
            var $currentButtonGroup = $currentStorageContents.find(Storages.storageButtons).find("button");
            if (type)
                $currentButtonGroup.removeAttr("disabled");
            else
                $currentButtonGroup.attr("disabled", true);
        }
    },
    Block: {
        StorageScroller: function (block) {
            var $currentStorageScroller = Storages.Current.GetStorageScroller();
            if (block >= 1)
                $currentStorageScroller.animate({opacity: 1});
            else
                $currentStorageScroller.animate({opacity: .1});
            this.ShowHideStorageOptions(block);
            this.ShowHideCenterLoader(block);
            this.EnableDisableStorageSection(block);
        },
        ShowHideStorageOptions: function (block) {
            var $currentStorageContainer = Storages.Current.GetStorageContainer();
            if ($currentStorageContainer.find(Storages.noContentsFound).length >= 1) {
                return false;
            }
            if (block >= 1)
                $currentStorageContainer.find(Storages.storageOptions).show();
            else
                $currentStorageContainer.find(Storages.storageOptions).hide();
        },
        ShowHideCenterLoader: function (block) {
            var $centerLoader = Storages.Current.GetCenterLoader();
            if (block >= 1)
                $centerLoader.hide();
            else
                $centerLoader.show();
        },
        EnableDisableStorageSection: function (block) {
            var $storageSectionButton = $(Storages.storageSection).find("button");
            if (block >= 1)
                $storageSectionButton.removeAttr("disabled");
            else
                $storageSectionButton.attr("disabled", "disabled");
        }
    },
    Parent: {
        Ready: function () {
            this.OnChange();
        },
        OnChange: function () {
            var me = this;
            $(document).on("change", "select.parent-id", function () {
                var selectedParent = $.trim($(this).val());
                var param = {
                    targetUrl: Storages.targetUrl.loadContents,
                    data: {parent: selectedParent},
                    afterRequest: me.AfterRequest,
                    beforeRequest: me.BeforeRequest
                };
                Storages.Request.Ajax(this, param);
            });
        },
        BeforeRequest: function (element) {
            $(element).next("img.loader").show();
            Storages.Block.StorageScroller(0);
        },
        AfterRequest: function (data) {
            if (Storages.IsJsonFormat(data)) {
                Storages.Current.GetStorageContent().find(Storages.centerLoader).hide();
                return false;
            }
            var storageSubContents = $(data).filter(Storages.storageSubContents).html();
            var storageOptions = $(data).filter(Storages.storageOptions).html();
            var $currentStorageContent = Storages.Current.GetStorageContent();
            var exist = $currentStorageContent.find(Storages.storageSubContents).length;

            if (!exist) {
                $currentStorageContent.find(Storages.noContentsFound).parent("div").addClass("storage-scroller storage-sub-contents");
            }
            $currentStorageContent.find(Storages.storageSubContents).html(storageSubContents);
            $currentStorageContent.find(Storages.storageOptions).html(storageOptions);
            Storages.Block.StorageScroller(1);

            if ($(data).find(Storages.noContentsFound).length >= 1) {
                $currentStorageContent.find(Storages.storageOptions).hide();
                $currentStorageContent.find(Storages.storageSubContents).html(data);
                return false;
            }
        }
    },
    Contents: {
        Ready: function () {
        },
        IsStillLoading: function () {
            if (Storages.Current.GetCenterLoader().is(":visible")) {
                return true;
            }
            return false;
        },
        HasRecords: function (element) {
            var $storageContainer = $(element).closest(Storages.storageContainer);
            var tableExist = $storageContainer.find(Storages.storageTable).length;

            return tableExist;
        },
        Load: function () {
            var me = this;
            Storages.Defaults.Ready();
            if (!this.HasRecords()) {
                if (!this.IsStillLoading()) {
                    var param = {
                        targetUrl: Storages.targetUrl.loadContents,
                        afterRequest: me.AfterRequest,
                        beforeRequest: me.BeforeRequest
                    };
                    Storages.Request.Ajax(this, param);
                }
            }
        },
        BeforeRequest: function (elem) {
            Storages.Current.GetCenterLoader().show();
        },
        AfterRequest: function (data) {
            var responseData = data;
            if (Storages.IsJsonFormat(data)) {
                var jsonData = $.parseJSON(data);
                responseData = jsonData.message;
            }
            Storages.Current.GetStorageContent().html(responseData);
            Storages.Current.GetCenterLoader().hide();
            Storages.Defaults.AssignCategoryIds();
        }
    },
    Paginate: {
        MaxPages: 15,
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            var me = this;
            $(document).on("click", "ul.pagination li a", function () {
                var $currentActiveStorageTable = Storages.Current.GetActiveStorageTable();
                var $currentStorageContent = Storages.Current.GetStorageContent();
                var isHiddenExist = $currentActiveStorageTable.find("tr").last().find("td.hidden input").length;
                var hiddenData = {};
                if (isHiddenExist) {
                    hiddenData = $.parseJSON($currentActiveStorageTable.find("tr").last().find("td.hidden input").val());
                } else {
                    hiddenData = {Marker: 0};
                }
                var page = $.trim($(this).text());
                var existing = $currentStorageContent.find(Storages.storageTable + "-" + page).length;

                var param = {
                    targetUrl: Storages.targetUrl.loadContents,
                    data: {page: page, marker: hiddenData.Marker, parent: $currentStorageContent.find("select.parent-id").val()},
                    afterRequest: me.AfterRequest,
                    beforeRequest: me.BeforeRequest
                };
                me.SetActiveInActive(this, existing);
                if (existing >= 1) {
                    Storages.Checkbox.ChangeText();
                    return false;
                }
                Storages.Request.Ajax(this, param);
            });
        },
        SetActiveInActive: function (element, existing) {
            if (existing) {
                var $currentStorageContent = Storages.Current.GetStorageContent();
                Storages.Paginate.ShowHideStorageTables($currentStorageContent, element);
            }
            $(element).closest("ul").find("li.disabled").removeClass("disabled");
            $(element).parent("li").addClass("disabled");
        },
        BeforeRequest: function (element) {
            Storages.Block.StorageScroller(0);
        },
        ReturnPrevious: function (element) {
            $(element).parent("li").prev("li").find("a").trigger("click");
            Storages.Block.StorageScroller(1);
            Storages.Messages(4);
        },
        AfterRequest: function (data, element) {
            if (Storages.IsJsonFormat(data)) {
                var jsonData = $.parseJSON(data);
                if (typeof jsonData.status !== "undefined" && jsonData.status === "error") {
                    Storages.Paginate.ReturnPrevious(element);
                    return false;
                }
            }
            if ($(data).find(Storages.noContentsFound).length >= 1) {
                Storages.Paginate.ReturnPrevious(element);
                return false;
            }
            var $currentStorageContent = Storages.Current.GetStorageContent();
            $currentStorageContent.find(Storages.storageSubContents).append($(data).html());

            Storages.Paginate.ShowHideStorageTables($currentStorageContent, element);
            Storages.Paginate.CloneNext(element, $currentStorageContent);
            Storages.Block.StorageScroller(1);
            Storages.Checkbox.ChangeText();
        },
        ShowHideStorageTables: function ($currentStorageContent, element) {
            var page = $.trim($(element).text());
            $currentStorageContent.find(Storages.storageTable + ":visible").hide();
            $currentStorageContent.find(Storages.storageTable + "-" + page).show();
        },
        CloneNext: function (element, $currentStorageContent) {
            var isLastPage = $(element).parent("li").next("li").length;
            if (isLastPage)
                return false;
            var $pagination = $currentStorageContent.find("ul.pagination");
            var $page = $pagination.find("li").last();
            var totalPage = $pagination.find("li").length + 1;
            var clone = $page.clone();

            $pagination.removeClass("hide").show();
            clone.find("a").text(totalPage);
            clone.removeClass("disabled");
            $pagination.append(clone);
        },
        Restructure: function (element, $currentStorageContent) {
            if (parseInt($(element).text()) <= Storages.Paginate.MaxPages) {
                return false;
            }
            var $pagination = $currentStorageContent.find("ul.pagination");
            var escape = parseInt($(element).text()) - Storages.Paginate.MaxPages;

            $.each($pagination.find("li"), function () {
                var currentPage = parseInt($(this).find("a").text());
                $(this).find("a").text(currentPage + escape);
            });
        }
    },
    AddSelectedItems: {
        Ready: function () {
            this.OnClickAdd();
        },
        OnClickAdd: function () {
            var me = this;
            $(document).on("click", "button.add-selected-item", function () {
                var $currentStorageContents = Storages.Current.GetStorageContent();
                var totalSelectedItems = $currentStorageContents.find("tr td input:checked").length;
                var categoryIds = $.trim($currentStorageContents.find("input.category-ids").val());

                if (totalSelectedItems <= 0) {
                    Storages.Messages(1);
                    return false;
                }
                if (categoryIds === "") {
                    Storages.Messages(3);
                    return false;
                }
                Storages.Block.StorageScroller(0);
                me.SaveItems($currentStorageContents);
            });
        },
        SaveItems: function ($currentStorageContents) {
            var serializeData = this.SerializeData();
            var categoryIds = $.trim($currentStorageContents.find("input.category-ids").val());
            var param = {
                targetUrl: Storages.targetUrl.saveContents,
                data: {data: serializeData, category_ids: categoryIds},
                afterRequest: this.AfterRequest,
                beforeRequest: this.BeforeRequest
            };
            Storages.Request.Ajax(this, param);
        },
        AfterRequest: function (data, element) {
            if (data.length >= 1) {
                var returnedData = $.parseJSON(data);
                if (returnedData.status === "error") {
                    App.Alert("Error", returnedData.message, "error");
                    Storages.Block.StorageScroller(1);
                    return false;
                }
            }
            Storages.Block.StorageScroller(1);
            Storages.AddSelectedItems.AssignCheckImage();
            Storages.Messages(2);
        },
        BeforeRequest: function (elem) {

        },
        AssignCheckImage: function () {
            var $currentStorageContents = Storages.Current.GetStorageContent();
            var $imgChecked = $currentStorageContents.find("img.checked");
            $imgChecked.prev("div").remove();
            $imgChecked.closest("div").removeClass("form-group");
            $imgChecked.removeClass("hide").show();
        },
        SerializeData: function () {
            var $currentStorageContents = Storages.Current.GetStorageContent();
            var $checkedBoxes = $currentStorageContents.find(".table tr td input:checked");
            var imgCheck = "<img src='" + basePath + "img/check.png" + "' class='checked hide' />";

            var serialize = new Array();
            $.each($checkedBoxes, function (e, v) {
                var $closestTr = $(this).closest("tr");
                serialize[e] = $closestTr.find("td.hidden").find("input").val();
                $(this).parent().after(imgCheck);
            });
            return serialize;
        }
    },
    Messages: function (type) {
        if (type === 1)
            App.Alert("Please Select Items", "Please tick the checkbox to select the items that you want to add", "error");
        if (type === 2)
            App.Alert("Success", "Records has been successfully saved", "success");
        if (type === 3)
            App.Alert("Please Select Category", "You need to assign category for your selected items. Please select one or more category", "error");
        if (type === 4)
            App.Alert("No Records Found", "Sorry, no records found on this page. You were returned to previous page", "error");
        if (type === 5)
            App.Alert("No Streaming Url", "Sorry, this video is invalid because there is no streaming url found", "error");
    },
    Checkbox: {
        Ready: function () {
            this.OnCheckAll();
        },
        OnCheckAll: function () {
            $(document).on("click", "a.check-all", function () {
                var $currentActiveStorageTable = Storages.Current.GetActiveStorageTable();
                var text = $.trim($(this).text());
                var $checkBoxes = $currentActiveStorageTable.find("input[type='checkbox']");
                if (text === "Check All") {
                    $checkBoxes.prop("checked", true);
                    $(this).text("Uncheck All");
                } else {
                    $checkBoxes.prop("checked", false);
                    $(this).text("Check All");
                }
            });
        },
        ChangeText: function () {
            var $currentActiveStorageTable = Storages.Current.GetActiveStorageTable();
            var totalCheckBoxes = $currentActiveStorageTable.find("input[type='checkbox']:checked").length;
            var $currentStorageContainer = Storages.Current.GetStorageContainer();

            if (totalCheckBoxes >= 1) {
                $currentStorageContainer.find("a.check-all").text("Uncheck All");
            } else {
                $currentStorageContainer.find("a.check-all").text("Check All");
            }
        }
    },
    Request: {
        Ajax: function (element, param) {
            var name = Storages.GetStorageName();
            var me = this;
            Storages.Tab.Disable(0);
            Storages.ButtonGroup.Disable(0);

            if (typeof (param["beforeRequest"]) !== "undefined") {
                param["beforeRequest"](element);
            }
            var tagetUrl = basePath + param["targetUrl"] + "?name=" + name;
            var data = {};
            if (typeof (param["data"]) !== "undefined") {
                data = param["data"];
            }
            $.ajax({
                url: tagetUrl,
                method: "POST",
                data: data
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                Storages.Tab.Disable(1);
                Storages.ButtonGroup.Disable(1);
                if (Storages.IsJsonFormat(data)) {
                    var jsonData = $.parseJSON(data);
                    if (typeof jsonData.status !== "undefined" && jsonData.status === "error") {
                        App.Alert("Error", jsonData.message, "error");
                    }
                }
                param["afterRequest"](data, element);
            });
        },
        SetLoader: function () {
            var img = $("<img>");
            var $loaderClass = Storages.Current.GetStorageContainer().find(".set-loader");
            var src = basePath + "img/ajax-loader.gif";
            img.attr({
                "class": "loader",
                "src": src
            });
            var existing = $loaderClass.next("img.loader").length;
            if (!existing) {
                $(img).insertAfter($loaderClass).hide();
            }
        }
    },
    AddMore: {
        STORAGE_AWS_S3_AUDIO: 4,
        STORAGE_DEFAULT_AUDIO: 4,
        Ready: function () {
            this.LoadForm();
            this.OnClickAdd();
            this.OnClickReturn();
        },
        LoadForm: function () {
            var param = {
                targetUrl: Storages.targetUrl.loadForm,
                data: {},
                afterRequest: AfterRequest
            };
            Storages.Request.Ajax(this, param);
            function AfterRequest(data, element) {
                var $addMoreForm = $(Storages.addMoreForm);
                $addMoreForm.html(data);
                $addMoreForm.hide();
            }
        },
        OnClickAdd: function () {
            var me = this;
            $(document).on("click", "a.add-more-details", function () {
                var $parentTr = $(this).closest("tr");
                var hiddenData = $.parseJSON($parentTr.find("td.hidden").find("input").val());
                var $addMoreForm = $(Storages.addMoreForm);
                var $currentTab = me.EnableAudioOrVideoTab($addMoreForm, hiddenData);
                var $video = $addMoreForm.find(".tab-pane.active");
                var $storagePanel = $("div.storages.panel-name").last().parent("div").parent("div");
                var photo = basePath + "img/place-holder.jpg";

                $storagePanel.hide();
                $addMoreForm.show();
                $addMoreForm.find("input.category-ids").val(Storages.Current.GetStorageContainer().find("input.category-ids").val());
                $.each(hiddenData, function (e, v) {
                    if (e !== "id" && e !== "file") {
                        e = e.replace("_", "-");
                        if ($video.find("input." + e).length)
                            $video.find("input." + e).val($.trim(v));
                        if ($video.find("textarea." + e).length)
                            $video.find("textarea." + e).text($.trim(v));
                        if ($video.find("select." + e).length)
                            $video.find("select." + e).val($.trim(v));
                    }
                });

                photo = $.trim(hiddenData.photo);
                $video.find("div.fileupload-new.thumbnail").find("img").attr("src", photo);
                $video.find("input.photo-hidden").val($.trim(photo));
                $video.find("input.category-ids").hide();
                if ($currentTab === "audio") {
                    $video.find("input.type").val(me.STORAGE_DEFAULT_AUDIO);
                }
            });
        },
        EnableAudioOrVideoTab: function ($addMoreForm, hiddenData) {
            if (typeof hiddenData.streaming_url === "undefined") {
                Storages.Messages(5);
                return false;
            }
            var streamUrl = hiddenData.streaming_url;
            var ext = streamUrl.substring(streamUrl.lastIndexOf('.') + 1);
            var $tabContent = $addMoreForm.find(".tab-content");
            $tabContent.find(".tab-pane").removeClass("active");
            if ($.trim(ext) === "mp3" || $.trim(ext) === "wma") {
                $tabContent.find("#audio").addClass("active");
                return "audio";
            } else {
                $tabContent.find("#video").addClass("active");
                return "video";
            }
        },
        OnClickReturn: function () {
            var $addMoreForm = $(Storages.addMoreForm);
            var $storagePanel = $("div.storages.panel-name").last().parent("div").parent("div");
            $(document).on("click", "a.back-to-storage", function () {
                $storagePanel.show();
                $addMoreForm.hide();
                document.body.scrollTop = document.documentElement.scrollTop = 250;
            });
        }
    },
    Tab: {
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            $(document).on("click", Storages.storageTabs, function () {
                Storages.ButtonGroup.AutoConnect();
            });
        },
        Disable: function (type) {
            var $tab = $("div.storages ul.storage-tabs").find("li a");
            if (!type) {
                $tab.removeAttr("data-toggle");
                $tab.css("opacity", .4);
                $tab.closest("ul").find("li.active").find("a").css("opacity", 1);
            }
            else {
                $tab.attr("data-toggle", "tab");
                $tab.closest("ul").find("li").find("a").css("opacity", 1);
            }
        },
        OnSlideNext: function () {
            var $storageTabs = $("div.storages ul.storage-tabs");
            $storageTabs.css("position", "relative");
            $(document).on("click", Storages.storageTabs + ".navigate", function (event) {
                var $ul = $(this).closest("ul");
                var layoutOffsetWidth = $ul.find("li").first().width();
                event.preventDefault();
                $(this).closest("ul").animate({
                    left: 130 + 'px'
                });
            });
            $storageTabs.css("left", "-170px");
        }
    },
    HttpAccess: {
        Ready: function () {
            this.OnClick();
        },
        OnClick: function () {
            var me = this;
            $(document).on("click", "a.update-http-access", function () {
                var httpAccess = $(this).closest(Storages.storageSettings).find("input.http-access").val();
                var httpAccessHidden = $(this).closest(Storages.storageSettings).find("input.http-access-hidden").val();
                var param = {
                    targetUrl: Storages.targetUrl.saveHttpAccess,
                    data: {http_access: httpAccess, http_access_hidden: httpAccessHidden},
                    afterRequest: me.AfterRequest,
                    beforeRequest: me.BeforeRequest
                };
                Storages.Request.Ajax(this, param);
            });
        },
        AfterRequest: function (data, elem) {
            Storages.Block.StorageScroller(1);
            Storages.HttpAccess.HideButtonShowLoader(elem, 1);
            Storages.Current.GetStorageContainer().find(Storages.storageScroller).empty();
            Storages.Current.GetStorageContainer().find(Storages.storageOptions).hide();
            App.Alert("Saved", "Ftp access url succesfully saved", "success");
        },
        BeforeRequest: function (elem) {
            Storages.Block.StorageScroller(0);
            Storages.HttpAccess.HideButtonShowLoader(elem, 0);
        },
        HideButtonShowLoader: function (elem, type) {
            if (type === 0) {
                $(elem).next("img.loader").show();
                $(elem).hide();
            }
            if (type === 1) {
                $(elem).next("img.loader").hide();
                $(elem).show();
            }
        }
    },
    Connect: {
        Ready: function () {
            this.OnSubmit();
        },
        OnSubmit: function () {
            var me = this;
            $(Storages.Current.GetStorageContainer()).find("form").on("submit", function () {
                Storages.Tab.Disable(0);
                Storages.Block.EnableDisableStorageSection(0);
            });
        }
    },
    SelectCredentialType: {
        IsTrigger: true,
        Ready: function () {
            this.OnChange();
        },
        OnChange: function () {
            var me = this;
            $(document).on("change", "select.credential-type", function () {
                var type = $(this).val();
                var $content = $(this).closest("form");
                var $credentialTypes = $content.find("div.credential-types");
                $credentialTypes.hide();
                $credentialTypes.find("input").attr("disabled", true);

                $content.find("div.credential-type-" + type).show();
                $content.find("div.credential-type-" + type).find("input").removeAttr("disabled");
                me.Growl(this);
            });

            $("select.credential-type").trigger("change");
        },
        Growl: function (element) {
            var me = this;
            if (!this.IsTrigger) {
                var attr = $(element).attr('readonly');
                if (typeof attr !== typeof undefined && attr !== false) {
                    $.growl({duration: 4000, title: "Change Credential Type", message: "You need to disconnect your current connection if you want to change the credential type."});
                }
            }
            me.IsTrigger = false;
        }
    },
    StorageSection: {
        storageSection: "div.my-storage-section",
        storageTab: "div.storages ul.storage-tabs",
        Ready: function () {
            this.OnClick();
            this.Defaults();
        },
        Defaults: function () {
            var $selectedStorage = $(this.storageSection + " ul.dropdown-menu").find("li.selected");
            $selectedStorage.find("a").trigger("click");
        },
        OnClick: function () {
            var me = this;
            $(document).on("click", this.storageSection + " a.my-storage-button", function () {
                var text = $(this).text();
                var param = $(this).attr("param");
                var $liStorage = $(me.storageTab).find("li.storage-" + param);
                $(this).closest(me.storageSection).find("button.btn-danger").find("span.current").text(text);
                $(me.storageTab).find("li:visible").hide();
                $liStorage.removeClass("hide").show();
                $liStorage.first().find("a").trigger("click");
            });
        }
    },
    YoutubeSection: {
        targetFormGroup: "div.form-group",
        Ready: function () {
            this.OnClickAdd();
            this.OnCheck();
        },
        OnClickAdd: function () {
            var me = this;
            $(document).on("click", "a.add-channel-id", function () {
                var $target = $(this).closest(me.targetFormGroup).prev(me.targetFormGroup);
                var isNotEmpty = $target.find("input").val();
                var $check = '<a class="man check-channel-id" href="javascript:void(1)"> save </a>';

                if ($.trim(isNotEmpty) === "") {
                    App.Alert("Enter Channel Id", "Please don't forgot to enter your channel ID above", "error");
                    return false;
                }

                var $cloned = $target.clone();
                var $isCheckExist = $cloned.find("a.check-channel-id").length;
                var $inserted = $($cloned).insertAfter($target);
                var $input = $inserted.find("input");
                $input.val("");
                $input.attr("name", "data[Storage][channel_id][]");
                $input.removeAttr("readonly");
                if ($isCheckExist <= 0) {
                    var $checkAppend = $input.closest("div.form-group").append($check);
                } else {
                    $cloned.find("a.check-channel-id").show();
                }
                $(this).hide();
            });
        },
        OnCheck: function () {
            var me = this;
            $(document).on("click", "a.check-channel-id", function () {
                var $target = $(this).closest(me.targetFormGroup)
                var channelId = $target.find("input").val();
                var $check = '<a class="man check-channel-id" href="javascript:void(1)"> save </a>';

                if ($.trim(channelId) === "") {
                    App.Alert("Enter Channel Id", "Please don't forgot to enter your channel ID", "error");
                    return false;
                }
                $(this).text("checking..");
                me.Check(channelId, this, $target);
            });
        },
        Check: function (channelId, element, $target) {
            var targetUrl = basePath + "storages/checkYoutubeChannelId";
            var $myYoutube = $("#myyoutube");
            $.ajax({
                url: targetUrl,
                method: "POST",
                data: {"channel_id": channelId}
            }).error(function (xhr, ajaxOptions, thrownError) {
                App.OnAjaxError(xhr.status);
            }).done(function (data) {
                $(element).text("save");
                if (App.IsJsonFormat(data)) {
                    var result = $.parseJSON(data);
                    if (result.error !== undefined) {
                        App.Alert("Error", result.message, "error");
                        return false;
                    }
                }
                $(element).hide();
                $("a.add-channel-id").show();
                $target.find("input").attr("readonly", "readonly");
                $target.find("input").addClass("synchronize-now");
                //$myYoutube.find(".text-center.loader").show();
                //$myYoutube.find("div.storage-sub-contents").remove();
            });
        }
    }
};

$(document).ready(function () {
    Storages.Ready();
});

