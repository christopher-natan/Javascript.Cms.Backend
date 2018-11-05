/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Configurations = {
    Ready: function () {
        this.OnSaving.Ready();
    },
    OnSaving: {
        Ready: function () {
            this.OnEmailTypeChange();
            this.OnClickTestConnection();
            this.AssignTab();
        },
        AssignTab: function () {
            $(document).on('click', "ul.nav.nav-tabs li a", function () {
                var href = $(this).attr("href");
                var cleaned = href.replace("#", "");
                $("input.tab").val(cleaned.replace("_", "-"));
            });
        },
        OnEmailTypeChange: function () {
            var emailType = '.form-horizontal select.email-type';
            var parent = this;
            var options = this.GetEmailTypeOptions(emailType);
            $(document).on('change', emailType, function () {
                parent.ShowHideGroup(options, $(this).val());
            });
            $(emailType).trigger('change');
        },
        GetEmailTypeOptions: function (emailType) {
            var index = [];

            $($(emailType + " option")).each(function (key, value) {
                index[key] = $(value).val();
            });
            return index;
        },
        ShowHideGroup: function (options, showGroup) {
            $.each(options, function (key, value) {
                $("." + value + ":visible").hide();
            });
            $("." + showGroup).fadeIn("slow");
        },
        OnClickTestConnection: function () {
            $(document).on('click', 'a.test-connection', function () {
                $("span.test-connection-status").removeClass("hide").show();
                var href = basePath + "configuration/testConnection"
                $.ajax({
                    url: href,
                    type: "POST",
                    data: $(this).closest("form").serialize()
                }).error(function (xhr, ajaxOptions, thrownError) {
                    App.OnAjaxError(xhr.status)
                }).done(function (data) {
                    var response = $.parseJSON(data);
                    if (!response.connected)
                        App.Dialog.Show("Invalid Access/Secret Key", "The Access Key or Secret Key is invalid or your account is not allowed to connect to the selected Region.", "error");
                    if (response.connected)
                        App.Dialog.Show("Valid Keys", "You have valid keys and we are able to connect to AmazonS3", "success");
                    $("span.test-connection-status").hide();
                });
            });
        }
    }
};

$(document).ready(function () {
    Configurations.Ready();
});

