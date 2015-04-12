/**
 * Created by wfournier on 4/12/15.
 */
var api = 'http://localhost:5000';
var image = '';
var destinations = [];
var resolution = 300;

function error(text) {
    console.log("Error calleed with: " + text);
    //console.log($("#dialog").find("p"));
    console.log($("#dialog"));
    $("#dialog")
        //.find("p").text(text)
        .html(
            "<p>" + text + "</p>" +
            "<paper-button affirmative=\"\" autofocus=\"\" role=\"button\" tabindex=\"0\">Ok</paper-button>"
        )
        .attr("class", "error")
        .toggle()
        .find("paper-button").click(function() {
            $(this).parent().toggle();
        })

}

function scan() {
    console.log('Scan called');
    //$.get(api + '/scan?resolution=' + resolution, function(data) {
    $.get(api + '/test', function(data) {
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
            $("#scan").attr("class", "succeeded");
            setTimeout(function(){
                $("#scan").attr("class", "colored");
            }, 2000);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Scan.fail called');
            $("#save").attr("class", "failed");
            error("Save failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);
        });
}

function save() {
    console.log('Save called');
    var location = $(".core-selected").text();
    if (location == '') {
        error("Please select a destination first...");
        return false;
    }
    $.get(api + "/save?id=" + image + "&location=" + location,
        function(data) {})
        .done(function(data) {
            $("#save").attr("class", "succeeded");
            setTimeout(function(){
                $("#save")
                    .attr("disabled", "")
                    .attr("aria-disabled","")
                    .removeAttr("class");
            }, 2000);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#save").attr("class", "failed");
            error("Save failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);
        });
}

function populate_menu() {
    console.log('populate_menu called');
    $.get(api + '/destinations', function(data) {
        console.log(data);
        destinations = JSON.parse(data).sort();
        for (var i in destinations) {
            //console.log('Adding dest: '+destinations[i]);
            $("#destination_list").append("<paper-item>"+ destinations[i] +"</paper-item>");
        }
    })
        .fail(function(jqXHR, textStatus, errorThrown) {
            error("Populate of locations failed with: " + textStatus + "\n" + errorThrown + "\n" + jqXHR.responseText);
        });
}
