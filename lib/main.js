/**
 * Created by wfournier on 4/12/15.
 */
var api = 'http://localhost:5000';
var image = '';
var destinations = []
var resolution = 300;

function scan() {
    console.log('Scan called');
    //$.get(api + '/scan?resolution=' + resolution, function(data) {
    $.get(api + '/test', function(data) {
        console.log(data);
        image = data;
        $("#preview").attr("src", api + "/view?id=" + data);
        $("#save").removeAttr("disabled");
        $("#save").removeAttr("aria-disabled");
        $("#save").attr("class", "colored");
        //$("#destination").removeAttr("disabled");
    })
}

function save() {
    console.log('Save called');
    var location = $(".core-selected").text();
    if (location == '') {
        $("#dialog").text("Please select a destination first...")
            .attr("class", "error")
            .attr("opened", "true");
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
            $("#dialog").text("Save failed with: " + textStatus + "\n" + errorThrown)
                .attr("class", "error")
                .attr("opened", "true");
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
}
