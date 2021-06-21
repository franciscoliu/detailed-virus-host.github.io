$(function() {
    var usercenter = {
        init: function() {
            this.modal();
        },
        modal: function() {
            $("#right").click(function() {
                ///Display the box based on the status of arrow
                if (document.getElementById('info').style.display == "block") {
                    document.getElementById('info').style.display = "";
                    document.getElementById('right').style.marginRight = "0px";

                } else if (document.getElementById('info').style.display == "") {
                    document.getElementById('info').style.display = "block";
                    document.getElementById('right').style.marginRight = "300px";
                }

                if ($(this).hasClass("rotate")) { //click the arrow to rotate it
                    $(this).removeClass("rotate");
                    $(this).addClass("rotate1");
                } else {
                    $(this).removeClass("rotate1"); //rotate back
                    $(this).addClass("rotate");
                }

            })
        },

    }
    usercenter.init();

})