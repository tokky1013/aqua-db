const version = '1.1.4';


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

if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(granted => {
        if (granted) {
            console.log("Storage will not be cleared except by explicit user action");
            $('#warning').css('display', 'none');
        } else {
            console.log("Storage may be cleared by the UA under storage pressure.");
        }
    });
}else {
    console.log("Storage may be cleared by the UA under storage pressure.");
}
