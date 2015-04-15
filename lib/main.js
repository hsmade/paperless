/**
 * Created by wfournier on 4/12/15.
 */
var api = 'http://192.168.54.106:5000';
//var api = 'http://localhost:5000';
var image = '';
var destinations = [];
var resolution = 300;

function show_notification(text) {
    console.log("Notification called with: " + text);
    var dialog = $("#dialog");
        //.find("p").text(text)
        dialog.html(
            "<p>" + text + "</p>"
        )
        .attr("class", "notification")
        .attr("heading", "Notification")
        .toggle();
    return dialog;
}

function show_error(text) {
    console.log("Error called with: " + text);
    var dialog = $("#dialog");
        //.find("p").text(text)
        dialog.html(
            "<p>" + text + "</p>" +
            "<paper-button affirmative=\"\" autofocus=\"\" role=\"button\" tabindex=\"0\">Ok</paper-button>"
        )
        .attr("class", "error")
        .attr("heading", "Error")
        .toggle()
        .find("paper-button").click(function() {
            $(this).parent().toggle();
        });
    return dialog;
}

function scan() {
    console.log("Scan called");
    var notification = show_notification("Please wait while the scanner is scanning...");
    $.get(api + '/scan?resolution=' + resolution, function(data) {
    //$.get(api + '/test', function(data) {
        console.log(data);
        image = data;
        $("#preview").attr("src", api + "/view?id=" + data);
        $("#save")
            .removeAttr("disabled")
            .removeAttr("aria-disabled")
            .attr("class", "colored");
    })
        .done(function(data) {
            console.log('Scan.done called');
            notification.toggle();
            $("#scan").attr("class", "succeeded");
            setTimeout(function(){
                $("#scan").attr("class", "colored");
            }, 2000);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Scan.fail called');
            notification.toggle();
            $("#scan").attr("class", "failed");
            show_error("Scan failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);

        });
}

function save_dialog() {
    document.querySelector("#save-dialog").toggle_dialog();
}

function save() {
    console.log('Save called');
    document.querySelector("#save-dialog").toggle_dialog();
    var location = $(".core-selected").text();
    if (location == '') {
        show_error("Please select a destination first...");
        return false;
    }
    var file_name = document.querySelector('#save-dialog').file_name;
    console.log('file_name :' + file_name);
    if (file_name == '') {
        console.log('file_name empty');
        show_error("Please put in a file_name...");
        return false;
    }
    $.get(api + "/save?id=" + image + "&location=" + location + "&name=" + file_name,
        function(data) {})
        .done(function(data) {
            console.log('Save ok');
            $("#save").attr("class", "succeeded");
            $("#preview").attr("src", "");
            setTimeout(function(){
                $("#save")
                    .attr("disabled", "")
                    .attr("aria-disabled","")
                    .removeAttr("class");
            }, 2000);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Save failed');
            $("#save").attr("class", "failed");
            show_error("Save failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);
        });
}

function populate_locations() {
    console.log('populate_locations called');
    $.get(api + '/destinations', function(data) {
        console.log(data);
        destinations = JSON.parse(data).sort();
        for (var i in destinations) {
            $("#destination_list").append("<paper-item>"+ destinations[i] +"</paper-item>");
        }
    })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('populate_locations failed');
            show_error("Populate of locations failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);
        });
}
