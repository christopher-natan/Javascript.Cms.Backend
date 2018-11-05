/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Rokus = {
    Ready: function () {
        this.Modal.Ready();
    },
    Modal: {
        Ready: function () {
            var modalClass = ".modal.roku-linking";
            $(modalClass).modal({backdrop: 'static', keyboard: false}).show();
            $(modalClass).on('shown.bs.modal', function () {
                $(modalClass).focus();
            });
        }
    }
};

$(document).ready(function () {
    Rokus.Ready();
});

