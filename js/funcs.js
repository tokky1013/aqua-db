let deletedSongs = [];          // DBへの保存時に削除された曲をDBから消すためのもの
let notDisplayedSongs = [];     // filterとresetFilter以外では変更されないはず
let editedSongs = [];           // 参照される時は常にnotDisplayedSongsとテーブルに表示された曲(getDisplayedSongsで取得できるもの)の和になっているはず
let isEditMode = false;

// 編集モードを終了する時等
function init() {
    exitEditMode();
    resetFilterInput();
    filter();
}
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

function resetFilterInput() {
    $('#filter-title').val('');
    $('#filter-artist').val('');
    $('#check1').prop('checked', false);
    $('#check2').prop('checked', false);
    $('#order').val('adding-date');
}

async function readJson() {
    if(isEditMode) {
        if(!confirm('データを読み込みますか？\n保存していないデータは失われます。')) return;
    }
    const jsonString = $('#json-input-content').val();
    if(!jsonString) return;

    await saveSongs(loadSongsFromJson(jsonString), $('#overwrite').prop('checked'));
    songs = await loadSongs();
    init();
    alert('データを読み込みました');
}

function clearJson() {
    $('#json-input-content').val('');
}

function writeJson() {
    $('#json-output').removeClass('d-none')
    const dictArr = songs.map(song => song.toDict());
    const jsonString = JSON.stringify(dictArr);
    $('#json-output-content').text(jsonString);
}

function copyJson() {
    navigator.clipboard.writeText($('#json-output-content').text());
}

async function deleteData() {
    if(confirm('データを消去しますか？')) {
        songs = [];
        init();
        await deleteSongs();
    }
}
// ---------------------------------テーブル関連---------------------------------
// 全てのテキストエリアの高さを自動調整するようにする
function adjustTextareaHeight() {
    $('td > textarea').each(function() {
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

function showTable(songs) {
    let html = `
    <table id="table" class="table table-striped m-0">
        <tr class="table-dark">
            <th style="width: 120px;">曲名</th>
            <th style="width: 120px;">アーティスト名</th>
            <th style="width: 80px;">キー</th>
            <th style="width: 75px;">最高音※1</th>
            <th style="width: 100px;">最高得点※2</th>
            <th>コメント</th>
            <th style="width: 80px">追加日</th>
            <th style="width: 25px" class="only-normal-mode"></th>
            <th style="width: 30px" class="only-edit-mode"></th>
            <th style="width: 30px" class="only-edit-mode"></th>
        </tr>
    `;

    songs.forEach(song => {
        html += getTableRow(song);
    });

    html += '</table>';

    $('main').html(html);
    $('#songs-count').text(songs.length + ' songs');
    adjustTextareaHeight();
}

function getTableRow(song) {
    const keys  = ['-6', '-5', '-4', '-3', '-2', '-1', '原曲キー', '+1', '+2', '+3', '+4', '+5', '+6'];
    const tones = ['ド','ド♯','レ','レ♯','ミ','ファ','ファ♯','ソ','ソ♯','ラ','ラ♯','シ'];

    const dict = song.toDict();
    let html = `<tr id="row-${dict.uuid}">`;

    html += `
    <td><textarea id="title-${dict.uuid}">${dict.title}</textarea></td>
    <td><textarea id="artist-${dict.uuid}">${dict.artist}</textarea></td>
    `

    html += `<td><select id="key-${dict.uuid}">`
    for (let i = 0; i < keys.length; i++) {
        html += `<option value="${i}"${dict.key === i ? ' selected' : ''}>${keys[i]}</option>`
    }
    html += `</select></td>`

    html += `<td><select id="highest-tone-${dict.uuid}">`
    for (let i = 0; i < tones.length; i++) {
        html += `<option value="${i}"${dict.highestTone === i ? ' selected' : ''}>${tones[i]}</option>`
    }
    html += `</select></td>`

    html += `
    <td><input id="score-${dict.uuid}" type="text" value="${dict.score}"></td>
    <td><textarea id="comment-${dict.uuid}">${dict.comment}</textarea></td>
    <td id="created-at-${dict.uuid}" class="text-center" data-created-at="${dict.createdAt}">${song.getCreatedAt()}</td>
    <td class="only-normal-mode"><i id="check-${dict.uuid}" class="fa-solid fa-check fa-lg text-success${dict.sang ? '' : ' d-none'}"></i></td>
    <td class="only-edit-mode"><input id="sang-${dict.uuid}" type="checkbox" class="form-check-input"${dict.sang ? ' checked' : ''}></td>
    <td class="only-edit-mode"><label onclick="deleteTableRow('${dict.uuid}');"><i class="fa-solid fa-trash-can fa-lg text-danger"></i></label></td>
    `;

    html += `</tr>`;
    
    return html;
}
// ---------------------------------編集モード関連---------------------------------
function startEditMode() {
    $(':root').get(0).style.setProperty('--btn-container-height', '80px');
    $('#btn-container').css('display', 'flex');
    $('.only-normal-mode').css('display', 'none');
    $('.only-edit-mode').css('display', 'table-cell');
    $('td > input, td > textarea').prop('readonly', false);
    $('td > select').prop('disabled', false);
    $('#switch-edit-mode').css('display', 'none');
    isEditMode = true;
}
function exitEditMode() {
    $(':root').get(0).style.setProperty('--btn-container-height', '0px');
    $('#btn-container').css('display', 'none');
    $('.only-normal-mode').css('display', 'table-cell');
    $('.only-edit-mode').css('display', 'none');
    $('td > input, td > textarea').prop('readonly', true);
    $('td > select').prop('disabled', true);
    $('#switch-edit-mode').css('display', 'inline');
    isEditMode = false;
}

// テーブルに表示されている曲を取得
function getDisplayedSongs() {
    let disabledSongs = [];
    const trs = $('#table tr');

    trs.each(function(){
        if (this.id) {
            const uuid = this.id.replace('row-', '');
            
            const disabledSong = new Song({
                title: $('#title-' + uuid).val(),
                artist: $('#artist-' + uuid).val(),
                key: $('#key-' + uuid).val() - 0,
                highestTone: $('#highest-tone-' + uuid).val() - 0,
                score: $('#score-' + uuid).val(),
                comment: $('#comment-' + uuid).val(),
                sang: $('#sang-' + uuid).prop('checked'),
                uuid: uuid,
                createdAt: $('#created-at-' + uuid).data('created-at') - 0,
            });

            disabledSongs.push(disabledSong);
        }
    });
    return disabledSongs;
}

function updateEditedSongs() {
    editedSongs = notDisplayedSongs.concat(getDisplayedSongs());
}

// テーブルの行を削除する
function deleteTableRow(uuid) {
    if(confirm('この曲を削除しますか？')) {
        $('#row-' + uuid).remove();
        deletedSongs.push(uuid);
    }
}

// テーブルの行を追加する
function addTableRow() {
    const html = getTableRow(new Song());
    $('#table').append(html);
    adjustTextareaHeight();
    startEditMode();
    $('#main-container').scrollTop($('#main-container')[0].scrollHeight);
}

// 編集内容を削除して編集モードを終了
function cancel() {
    if(confirm('編集内容を破棄しますか？')) {
        init();
    }
}

async function save() {
    if(confirm('編集内容を保存しますか？')) {
        updateEditedSongs();
        await saveSongs(editedSongs, overwrite=true);
        deletedSongs.forEach(deletedSong => {
            deleteSongs(deletedSong);
        });
        deletedSongs = [];
        songs = await loadSongs();
        showTable(getDisplayedSongs());
        exitEditMode();
    }
}

// ---------------------------------フィルタリング/ソーティング---------------------------------
function filter() {
    if(isEditMode) updateEditedSongs();
    else editedSongs = songs;

    notDisplayedSongs = [];
    let displayedSongs = [];

    const titleVal = $('#filter-title').val().replace('　', ' ');
    const artistVal = $('#filter-artist').val().replace('　', ' ');
    const check1Val = $('#check1').prop('checked');
    const check2Val = $('#check2').prop('checked');
    const order = $('#order').val();

    let conditions = {};

    if(titleVal) conditions.title = titleVal.split(' ');
    if(artistVal) conditions.artist = artistVal.split(' ');
    if(check1Val) conditions.sang = true;
    else if(check2Val) conditions.sang = false;

    editedSongs.forEach(song => {
        if(song.contains(conditions)) displayedSongs.push(song);
        else notDisplayedSongs.push(song);
    });

    displayedSongs = sort(displayedSongs, order);

    showTable(displayedSongs);
    if(isEditMode) startEditMode();
    else exitEditMode();
}

function sort(songs, order) {
    function merge(left, right, order) {
        let result = [];
        let i = 0;
        let j = 0;
    
        while (i < left.length && j < right.length) {
            if (left[i].compare(right[j], order)) result.push(left[i++]);
            else result.push(right[j++]);
        }
    
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    if (songs.length < 2) {
        return songs;
    }

    let middle = Math.floor(songs.length / 2);
    let left = songs.slice(0, middle);
    let right = songs.slice(middle);

    return merge(sort(left, order), sort(right, order), order);
}

function resetFilter() {
    resetFilterInput();
    if(isEditMode) updateEditedSongs();
    else editedSongs = songs;

    notDisplayedSongs = [];
    
    const order = $('#order').val();
    editedSongs = sort(editedSongs, order);
    showTable(editedSongs);
    if(isEditMode) startEditMode();
    else exitEditMode();
}