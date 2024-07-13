// ---------------------------------ポップアップ関連---------------------------------
function openFilter() {
    $('#filter').css('display', 'block');
    $('#settings').css('display', 'none');
    $('#back').css('display', 'flex');
}

function openSettings() {
    $('#filter').css('display', 'none');
    $('#settings').css('display', 'block');
    $('#back').css('display', 'flex');
}

function closePopup() {
    $('#back').css('display', 'none');
}

// ---------------------------------テーブル関連---------------------------------
// 全てのテキストエリアの高さを自動調整するようにする
function adjustTextareaHeight() {
    $('textarea').each(function() {
        const textarea = $(this);

        textarea.on('input', function() {
            textarea.css('height', '5px');
            const sh = textarea.get(0).scrollHeight;
            textarea.css('height', (sh - 5) + 'px');
        });
        textarea.css('height', '5px');
        const sh = textarea.get(0).scrollHeight;
        textarea.css('height', (sh - 5) + 'px');
    });
}

// ---------------------------------曲関連---------------------------------
async function readJsonString() {

}

async function writeJsonString() {

}

