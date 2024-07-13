const version = '1.0.0';

let songs;


songs = [
    new Song(["死ぬのがいいわ","藤井風","+3","レ","","音域広すぎ",true]),
    new Song(["Pretender","Official髭男dism","+2","レ","81.287(D)","サビいい感じ。もっと聴いたら上手くなるかも",true]),
];

$(document).ready(function() {
    $('#version').text('Ver.' + version);

    // ポップアップ
    $('#back').click(function() {
        closePopup();
    });

    $('.popup').each(function() {
        $(this).click(function(e) {
            e.stopPropagation();
        });
    });
   
    adjustTextareaHeight()
});