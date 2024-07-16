const version = '1.1.1';


$(document).ready(async function() {
    $('#version').text('Ver. ' + version);

    // ポップアップ
    $('#back').click(function() {
        closePopup();
    });

    $('.popup').click(function(e) {
        e.stopPropagation();
    });

    $('.filter-input').keypress(function(e) {
        if(e.keyCode === 13) {
            filter();
        }
    });

    $("[type='checkbox']").on('click', function() {
        if ($(this).prop('checked')){
            $("[type='checkbox']").prop('checked', false);
            $(this).prop('checked', true);
        }
        filter();
    });

    $('.filter-select').change(function() {
        filter();
    });
});