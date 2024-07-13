const dbName = 'aquaDB';
const dbVersion = 1;
const storeName = 'songs';

let db;

init();

async function init() {
    db = await idb.openDb(dbName, dbVersion, db => {
      db.createObjectStore(storeName, {keyPath: 'uuid'});
    });
  
    loadSongs();
}

async function loadSongs() {
    const tx = db.transaction(storeName);
    const songStore = tx.objectStore(storeName);
  
    const songs = await songStore.getAll();
  
    let songArr = [];
    if (songs.length) {
        songArr = songs.map(song => new Song(song));
    }

    return songArr;
}

function loadSongsFromJson(jsonString) {
    const songs = JSON.parse(jsonString);
    let songArr = [];
    for (const song of songs) {
        songArr.push(new Song(song));
    }

    return songArr;
}

async function saveSongs(songs, overwrite=false) {
    async function addSong(song) {
        const tx = db.transaction(storeName, 'readwrite');
        if (overwrite) {
            try {
                await tx.objectStore(storeName).put(song.toDict());
            } catch(err) {
                throw err;
            }
        } else {
            try {
                await tx.objectStore(storeName).add(song.toDict());
            } catch(err) {
                // すでに同じuuidの曲がある場合はuuidを変更して保存
                if (err.name == 'ConstraintError') {
                    song.uuid = self.crypto.randomUUID();
                    addSong(song, overwrite);
                } else {
                    throw err;
                }
            }
        }
    }

    for (let song of songs) {
        await addSong(song, overwrite);
    }
}

async function deleteSongs() {
    let tx = db.transaction(storeName, 'readwrite');
    await tx.objectStore(storeName).clear();
}