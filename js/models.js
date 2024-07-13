class Song {
    constructor(data=null) {
        if(data instanceof Object) {
            if(data instanceof Array) {
                // 配列から作る場合
                const keys  = ['-6', '-5', '-4', '-3', '-2', '-1', '原曲キー', '+1', '+2', '+3', '+4', '+5', '+6'];
                const tones = ['ド','ド♯','レ','レ♯','ミ','ファ','ファ♯','ソ','ソ♯','ラ','ラ♯','シ'];

                this.title = data[0];
                this.artist = data[1];
                this.key = keys.indexOf(data[2]);
                this.highestTone = tones.indexOf(data[3]);
                this.highestScore = data[4];
                this.comment = data[5];
                this.sang = data[6];
                this.uuid = self.crypto.randomUUID();
                this.createdAt = new Date().getTime();
            }else {
                // 辞書から作る場合
                this.title = data.title;
                this.artist = data.artist;
                this.key = data.key;
                this.highestTone = data.highestTone;
                this.highestScore = data.highestScore;
                this.comment = data.comment;
                this.sang = data.sang;
                this.uuid = data.uuid;
                this.createdAt = data.createdAt;
            }
        }else {
            // 新しく作る場合
            this.title = '';
            this.artist = '';
            this.key = 6;
            this.highestTone = 0;
            this.highestScore = '';
            this.comment = '';
            this.sang = false;
            this.uuid = self.crypto.randomUUID();
            this.createdAt = new Date().getTime();
        }
    }

    getKey() {
        const keys  = ['-6', '-5', '-4', '-3', '-2', '-1', '原曲キー', '+1', '+2', '+3', '+4', '+5', '+6'];
        return keys[this.key];
    }

    getHighestTone() {
        const tones  = ['ド','ド♯','レ','レ♯','ミ','ファ','ファ♯','ソ','ソ♯','ラ','ラ♯','シ'];
        return tones[this.highestTone];
    }

    toDict() {
        const dict = {
            title: this.title,
            artist: this.artist,
            key: this.key,
            highestTone: this.highestTone,
            highestScore: this.highestScore,
            comment: this.comment,
            sang: this.sang,
            uuid: this.uuid,
            createdAt: this.createdAt,
        };
        return dict;
    }
}