/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Redirects = {
    Ready: function () {
        this.Modal.Ready();
    },
    Modal: {
        Ready: function () {
            var modalClass = ".modal.channel-creator";
            $(modalClass).modal({backdrop: 'static', keyboard: false}).show();
            $(modalClass).on('shown.bs.modal', function () {
                $(modalClass).focus();
            });
        }
    }
};

$(document).ready(function () {
    Redirects.Ready();
});

