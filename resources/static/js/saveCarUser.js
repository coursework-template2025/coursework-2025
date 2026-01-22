$(document).ready(function () {
    $('#marks').change(function () {
        var marksId = $(this).val();
        alert("I am here")
        var s = '<option value=' + -1 + '>SELECT</option>';
        if (marksId > 0) {
            $.ajax({
                url: 'getModelsCar',
                data: {"marksId": marksId},
                success: function (result) {
                    var result = JSON.parse(result);
                    for (var i = 0; i < result.length; i++) {
                        s += '<option value="' + result[i][0] + '">' + result[i][1] + '</option>';
                    }
                    $('#models').html(s);
                }
            });
        }
        $('#models').html(s);
    });
});
