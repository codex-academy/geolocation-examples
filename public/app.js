

$(function(){

    $("#get_distance").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;
        var to = selected[1].value;

        $.getJSON('/api/distance/' + from + '/' + to, function(data){
            $("#distance").html("Distance from <strong>" + data.from + "</strong> to <strong>" + data.to + "</strong> is " +  data.distance + " meters")
        });

    });

    $("#in_circle").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;
        var to = selected[1].value;

        var distance = $("#slider").val();

        $.getJSON('/api/in_circle/' + from + '/' + to + '/' + distance, function(data){
            $("#distance").html(JSON.stringify(data));
        });

    });

    $("#get_closest").click(function(){

        var selected = $('input[name="selected"]:checked');
        var from = selected[0].value;

        $.getJSON('/api/nearest/' + from, function(data){
            $("#distance").html(JSON.stringify(data));
        });

    });

    $("#get_center").click(function(){

        $.getJSON('/api/center', function(data){
            $("#distance").html(data.center.latitude + ", " + data.center.longitude);
        });

    });

    $("#slider").on("change", function(evt){
        $("#circleSize").text(evt.target.value);
    });

});
