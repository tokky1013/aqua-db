const version = '1.0.0';


$(document).ready(async function() {
    $('#version').text('Ver.' + version);

    // ポップアップ
    $('#back').click(function() {
        closePopup();
    });

    $('.popup').click(function(e) {
        e.stopPropagation();
    });

    $("[type='checkbox']").on('click', function() {
        if ($(this).prop('checked')){
            $("[type='checkbox']").prop('checked', false);
            $(this).prop('checked', true);
        }
    });
});