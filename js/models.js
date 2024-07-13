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
                this.score = data[4];
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
                this.score = data.score;
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
            this.score = '';
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

    getCreatedAt() {
        const createdAt = new Date(this.createdAt);
        const now = new Date();
        const diff = now - createdAt;

        if (diff >= 1000 * 60 * 60 * 24) return createdAt.toLocaleDateString();
        else if (diff >= 1000 * 60 * 60) return Math.floor(diff / 1000 / 60 / 60) + '時間前';
        else if (diff >= 1000 * 60) return Math.floor(diff / 1000 / 60) + '分前';
        else if (diff >= 1000) return Math.floor(diff / 1000) + '秒前';
        else return '今';
    }

    toDict() {
        const dict = {
            title: this.title,
            artist: this.artist,
            key: this.key,
            highestTone: this.highestTone,
            score: this.score,
            comment: this.comment,
            sang: this.sang,
            uuid: this.uuid,
            createdAt: this.createdAt,
        };
        return dict;
    }

    // 自分の方が早ければtrueを返す
    compare(other, field) {
        switch (field) {
            case 'adding-date':
                return this.createdAt >= other.createdAt;

            case 'title':
                return this.title <= other.title;

            case 'artist':
                return this.artist <= other.artist;

            case 'score':
                let score1 = this.score.replace(/\(.\)/, '');
                let score2 = other.score.replace(/\(.\)/, '');
                score1 = !isNaN(score1) ? score1-0 : 0;
                score2 = !isNaN(score2) ? score2-0 : 0;
    
                if(score1 == score2) return this.compare(other, 'title');
                return score1 >= score2;
        
            default:
                break;
        }
    }

    contains(conditions) {
        for (const key in conditions) {
            if(Array.isArray(conditions[key])) {
                for (const keyword of conditions[key]) {
                    if(this[key].toLowerCase().indexOf(keyword.toLowerCase()) == -1) return false;
                }
            }else {
                if(this[key] !== conditions[key]) return false;
            }
        }
        return true;
    }
}