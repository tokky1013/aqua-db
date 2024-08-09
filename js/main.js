const version = '1.1.2';


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

async function checkPersist() {
    const permanent = await window.navigator.storage.persist()
    if(permanent) {
        alert('ストレージが永続化されています。')
    }else {
        alert('ストレージが永続化されていません。')
    }
}
checkPersist();