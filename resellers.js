/**
 * Copyright (c) 2014  Christopher Natan
 * Developer Christopher Natan
 * chris.natan@gmail.com
 */
var Resellers = {
    Ready: function () {
        if ($("div.join").length >= 1) {
            $("div.modal-terms").modal("show");
        }
        this.OnClickViewAgreement();
        this.OnClickSelectText();
    },
    OnClickViewAgreement:function() {
        $(document).on("click", ".view-agreement", function() {
           $("div.modal-terms").modal("show"); 
           $("div.modal-terms").find(".modal-footer").find("a.agree").hide();
        });
    },
     OnClickSelectText:function() {
        $(document).on("click", "textarea.select", function() {
              $(this).select();
        });
    }
};

$(document).ready(function () {
    Resellers.Ready();
});

