
const audio = document.getElementById("audio");
const menu = document.getElementById("click-menu");
const range = document.getElementById("my-range");
const control = document.getElementById("control");
const cdThumb = document.getElementById("cd-thumb");

const timeStart = document.getElementById("time-start");
const timeEnd = document.getElementById("time-end");

const btn_pause = document.getElementById("a-pause");
const btn_continue = document.getElementById("a-continue");
const btn_repeat = document.getElementById("repeat");
const btn_random = document.getElementById("random");
const btn_speed = document.getElementById("speed");
const btn_sleep = document.getElementById("sleep");
const show_speed = document.getElementById("show-speed");

const next = document.getElementById("next");
const back = document.getElementById("back");

const note = document.getElementById("note");
const note_content = document.getElementById("note-content");


const list = document.getElementById("list");
const songName = document.getElementById("song-name");
const singer = document.getElementById("singer");

const app = {
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isSleep: false,

    speedDefault: 1,
    currentIndex: 0,
    storage: function () {
        let currentIndex = 0;
        let currentTime = 0;
        // let isRepeat = 0;
        if (typeof (localStorage.objMusic) == 'undefined') {
            currentIndex = this.currentIndex;

        } else {

            currentIndex = JSON.parse(localStorage.objMusic)["currentIndex"];
            currentTime = JSON.parse(localStorage.objMusic)["currentTime"];

        }

        return { currentIndex, currentTime };
    },

    songs: [
        {
            'songName': "248",
            'singer': "Unknown",
            'path': './media/Hai tám bốn284Winno.mp3',
        },
        {
            'songName': "CHIỀU THU HỌA BÓNG NÀNG",
            'singer': "Khang việt",
            'path': './media/CHIỀU THU HỌA BÓNG NÀNG.mp3',
        },
        {
            'songName': "Dang Dở",
            'singer': "Nal",
            'path': './media/DANG DỞ.mp3',
        },
        {
            'songName': "Tòng Phu",
            'singer': "Keyo",
            'path': './media/BenTrenTangLauVersion2-TangDuyTan-7655070.mp3',
        },
        {
            'songName': "Ghé Qua  Dick x Tofu x PC Official Audio",
            'singer': "Dick x Tofu x PC",
            'path': './media/Ghé Qua  Dick x Tofu x PC Official Audio.mp3',
        },
        {
            'songName': "Già Cùng Nhau Là Được  TeA ft PC  Prod VoVanDuc   Official MV",
            'singer': "TeA ft PC ",
            'path': './media/Già Cùng Nhau Là Được  TeA ft PC  Prod VoVanDuc   Official MV.mp3',
        },
        {
            'songName': "Đố Em Biết Anh Đang Nghĩ Gì  Bản Tình Ca Không Hoàn Thiện  Cover",
            'singer': "Unknown",
            'path': './media/Đố Em Biết Anh Đang Nghĩ Gì  Bản Tình Ca Không Hoàn Thiện  Cover.mp3',
        },
        {
            'songName': "PHÚC DU  đứa nào làm em buồn Ft Hoàng Dũng  Official MV ",
            'singer': "Phuc Du",
            'path': './media/PHÚC DU  đứa nào làm em buồn Ft Hoàng Dũng  Official MV .mp3',
        },
        {
            'songName': "Đen  Lối Nhỏ ft Phương Anh Đào MV",
            'singer': "Den ft Phương Anh Đào",
            'path': './media/Đen  Lối Nhỏ ft Phương Anh Đào MV.mp3',
        },
        {
            'songName': "2G17 Mấy con mèo  Datmaniac",
            'singer': "G-Family",
            'path': './media/2G17 Mấy con mèo  Datmaniac.mp3',
        },
    ],

    //Trả lại danh sách bài hát
    render: function () {
        let listSong = '';
        listSong = this.songs.map((item, index) => {
            return `
            <div class="song list-01 ${index === this.currentIndex ? "active" : ""
                }" data-index = "${index}">
                <div class="primary-song">
                    <p class="">${item.songName}</p>
                    <span class="">${item.singer}</span>
                </div>
                 <div class="current-sonng"></div>
          </div>`
        })
        listSong = listSong.toString().replace(/,/g, '');
        list.innerHTML = listSong;

    },

    //Định đĩnh 1 thuộc tính mới
    defineProperties: function () {
        Object.defineProperty(app, "currentSong",
            {
                get: function () {
                    this.currentIndex = JSON.parse(localStorage.objMusic)["currentIndex"]
                    return this.songs[this.currentIndex];
                }
            });
    },

    // Xử lí các sự kiện
    handleEvents: function () {
        const _this = this;

        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // => Ẩn/hiện danh sách bài hát
        menu.onclick = function () {
            list.classList.toggle("active");
            return;
        }

        // Xử lí khi nhấn vào 1 bài hát trong danh sách
        list.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode) {
                if (songNode) {
                    localStorage.setItem('objMusic', JSON.stringify({
                        "currentIndex": Number(songNode.dataset.index),
                        "currentTime": Math.floor(audio.currentTime),
                    }));
                    JSON.parse(localStorage.objMusic)["currentIndex"] = Number(songNode.dataset.index);
                    // _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
            return;
        };

        // 
        control.onclick = function () {
            _this.isPlaying ? audio.pause() : audio.play();
        };

        audio.onplay = function () {
            range.max = 100;
            _this.isPlaying = true;
            control.classList.add("is-playing");
            audio.playbackRate = _this.speedDefault;
            cdThumbAnimate.play();
            // console.log(audio.currentTime);
            audio.ontimeupdate = function () {
                localStorage.setItem('objMusic', JSON.stringify({
                    "currentIndex": _this.currentIndex,
                    "currentTime": Math.floor(audio.currentTime),
                }));
                // console.log(this.currentTime)
                let currentTime = Math.floor(this.currentTime);
                range.value = currentTime / Math.floor(audio.duration) * 100;
                if (currentTime < 60) {
                    timeStart.innerHTML = (currentTime < 10) ? `00:0${currentTime}` : `00:${currentTime}`;
                } else {
                    let minuteCurrentSong = Math.trunc(currentTime / 60);
                    minuteCurrentSong = (minuteCurrentSong < 10) ? `0${minuteCurrentSong}` : `${minuteCurrentSong}`;
                    let secondCurrentSong = currentTime - minuteCurrentSong * 60;
                    secondCurrentSong = (secondCurrentSong < 10) ? `0${secondCurrentSong}` : `${secondCurrentSong}`;
                    timeStart.innerHTML = `${minuteCurrentSong}:${secondCurrentSong}`;
                }
            };
            // audio.currentTime =  JSON.parse(localStorage.objMusic)["currentTime"]

            return;
        };
        audio.onpause = function () {

            range.max = 100;
            _this.isPlaying = false;
            control.classList.remove("is-playing");
            cdThumbAnimate.pause();
            return;
        };



        // Xử lí khi bài hát kết thúc
        audio.onended = function () {
            // console.log("het bai");
            range.max = 0; // trả về giá trị mặc định khi hết bài những người dùng vẫn nhấn sự kiện "onMouseDown";
            timeStart.innerHTML = `00:00`; // trả về thời gian mặc định khi hết bài những người dùng vẫn nhấn sự kiện "onMouseDown";
            control.classList.add("is-playing");
            _this.check();

            // Xử lí có bật phát ngẫu nhiên hay không?
            if (_this.isRandom) {
                // console.log(`co ram dom`);
                let randomNumber = 0;

                do {
                    randomNumber = _this.getRandomNumber();
                } while (randomNumber == _this.currentIndex);
                _this.currentIndex = randomNumber;
            } else {
                _this.currentIndex == _this.songs.length - 1 ? _this.currentIndex = 0 : _this.currentIndex++;
            }

            JSON.parse(localStorage.objMusic)["currentIndex"] = _this.currentIndex
            localStorage.setItem('objMusic', JSON.stringify({
                "currentIndex": _this.currentIndex,
                "currentTime": Math.floor(audio.currentTime),
            }));

            _this.loadCurrentSong();
            audio.play();
            _this.render();
        }

        // Cập nhập tổng thời gian bài hát
        audio.onloadedmetadata = function () {
            let songTime = Math.floor(audio.duration);
            //Xử lí thời gian trên hoặc dưới 60s(1p)
            if (songTime < 60) {
                timeEnd.innerHTML = (songTime < 10) ? `00:0${songTime}` : `00:${songTime}`;
            } else {
                let minuteCurrentSong = Math.trunc(songTime / 60);
                minuteCurrentSong = (minuteCurrentSong < 10) ? `0${minuteCurrentSong}` : `${minuteCurrentSong}`;
                let secondCurrentSong = songTime - minuteCurrentSong * 60;
                secondCurrentSong = (secondCurrentSong < 10) ? `0${secondCurrentSong}` : `${secondCurrentSong}`;
                timeEnd.innerHTML = `${minuteCurrentSong}:${secondCurrentSong}`;
            }
            return;
        }

        // Xử lí sự kiện onChange
        range.onchange = function () {
            // audio.ontimeupdate = false;
            control.classList.add("is-playing");
            let a = range.oninput();
            // console.log('a', a)
            // console.log(range.value);
            audio.currentTime = Math.floor(a / 100 * audio.duration);
            return;
        };

        // Xử lí sự kiện onmousedown
        range.onmousedown = function () {
            audio.ontimeupdate = false;
            audio.play();
            return;
        }
        // Xử lí sự kiện onmouseup
        range.onmouseup = function () {
            audio.ontimeupdate = function () {
                localStorage.setItem('objMusic', JSON.stringify({
                    "currentIndex": _this.currentIndex,
                    "currentTime": Math.floor(audio.currentTime),
                }));
                // console.log(this.currentTime)
                let currentTime = Math.floor(JSON.parse(localStorage.objMusic)["currentTime"]);
                range.value = currentTime / Math.floor(audio.duration) * 100;
                if (currentTime < 60) {
                    timeStart.innerHTML = (currentTime < 10) ? `00:0${currentTime}` : `00:${currentTime}`;
                } else {
                    let minuteCurrentSong = Math.trunc(currentTime / 60);
                    minuteCurrentSong = (minuteCurrentSong < 10) ? `0${minuteCurrentSong}` : `${minuteCurrentSong}`;
                    let secondCurrentSong = currentTime - minuteCurrentSong * 60;
                    secondCurrentSong = (secondCurrentSong < 10) ? `0${secondCurrentSong}` : `${secondCurrentSong}`;
                    timeStart.innerHTML = `${minuteCurrentSong}:${secondCurrentSong}`;
                }
            };
        };
        // Xử lí sự kiện oninput(thay đổi giá trị của input);
        range.oninput = function () {
            // console.log(range.value)
            // timeStart.innerHTML = this.value;
            let currentTime = Math.floor(this.value / 100 * audio.duration);
            if (currentTime < 60) {
                timeStart.innerHTML = (currentTime < 10) ? `00:0${currentTime}` : `00:${currentTime}`;
            } else {
                let minuteCurrentSong = Math.trunc(currentTime / 60);
                minuteCurrentSong = (minuteCurrentSong < 10) ? `0${minuteCurrentSong}` : `${minuteCurrentSong}`;
                let secondCurrentSong = currentTime - minuteCurrentSong * 60;
                secondCurrentSong = (secondCurrentSong < 10) ? `0${secondCurrentSong}` : `${secondCurrentSong}`;
                timeStart.innerHTML = `${minuteCurrentSong}:${secondCurrentSong}`;
            }
            return this.value;
        }

        // Cập nhập thời gian thực của bài hát
        audio.ontimeupdate = function () {
            // audio.play();
            this.currentTime = JSON.parse(localStorage.objMusic)["currentTime"];
            localStorage.setItem('objMusic', JSON.stringify({
                "currentIndex": _this.currentIndex,
                "currentTime": Math.floor(this.currentTime),
            }));
            let currentTime = Math.floor(this.currentTime);
            range.value = (currentTime / Math.floor(audio.duration) * 100);
            if (currentTime < 60) {
                timeStart.innerHTML = (currentTime < 10) ? `00:0${currentTime}` : `00:${currentTime}`;
            } else {
                let minuteCurrentSong = Math.trunc(currentTime / 60);
                minuteCurrentSong = (minuteCurrentSong < 10) ? `0${minuteCurrentSong}` : `${minuteCurrentSong}`;
                let secondCurrentSong = currentTime - minuteCurrentSong * 60;
                secondCurrentSong = (secondCurrentSong < 10) ? `0${secondCurrentSong}` : `${secondCurrentSong}`;
                timeStart.innerHTML = `${minuteCurrentSong}:${secondCurrentSong}`;
            }
        };

        // Nhấn nút tiến
        next.onclick = function () {

            audio.onended();
            return;
        };

        // Nhấn nút lùi
        back.onclick = function () {
            
            range.max = 0;
            _this.currentIndex <= 0 ? _this.currentIndex = _this.songs.length - 1 : _this.currentIndex--;
            localStorage.setItem('objMusic', JSON.stringify({
                "currentIndex": _this.currentIndex,
                "currentTime": 0,
            }));
            // localStorage.setItem('objMusic', JSON.stringify({ "currentIndex": _this.currentIndex }));
            // console.log(_this.currentIndex)
            _this.loadCurrentSong();
            audio.play();
            _this.render();
            return true;
        };

        // LXử lí khi chế độ lặp lại bài hát được bật
        btn_repeat.onclick = function (e) {

            btn_repeat.classList.toggle("is-active");
            const repeatNode = e.target.closest(".is-active")
            _this.isRepeat = repeatNode ? true : false;
            audio.loop = _this.isRepeat;
            return;
        };

        // Tốc độ bài hát
        btn_speed.onclick = () => {

            _this.speedDefault += 0.25;
            if (_this.speedDefault >= 4.5) {
                _this.speedDefault = 1;
            }
            // console.log(_this.speedDefault);
            audio.playbackRate = _this.speedDefault;
            show_speed.innerHTML = _this.speedDefault;
            return ;
        }

        // Xử lí khi chế độ thời gian ngủ được bật
        btn_sleep.onclick = function (e) {
            this.classList.toggle("is-active");
            note.classList.toggle("note-active")
            const sleepNode = e.target.closest(".is-active");
            _this.isSleep = (sleepNode) ? true : false;
            if (sleepNode) {

                // console.log(sleepNode);
                let setMinute = 5000;
                note_content.innerHTML = 'Dừng phát nhạc sau: ' + setMinute / 1000 + ' giay';
                const myTimeout = setTimeout(myGreeting, setMinute);
                function myGreeting() {
                    if (_this.isSleep) {

                        audio.pause();
                        btn_sleep.classList.remove("is-active");
                        note.classList.remove("note-active");
                    } else {

                        clearTimeout(myTimeout);
                    }
                    return;
                };
            }
        };

        // Xử lí khi chế độ phát ngẫu nhiên được bật

        btn_random.onclick = function (e) {

            this.classList.toggle("is-active");
            const randomNode = e.target.closest(".is-active");
            _this.isRandom = (randomNode) ? true : false;
            return;
        };

    },
    // Lấy số ngãu nhiên 
    getRandomNumber: function () {

        return Math.floor(Math.random() * this.songs.length);
    },

    // Kiểm tra các chế độ được bật hay không?
    check: function () {
        if (this.isRepeat) {
            btn_repeat.classList.add("is-active");

        }
        if (this.isRandom) {
            btn_random.classList.add("is-active");

        }
        return;
    },



    loadConfig: function () {
        // console.log(typeof(localStorage.objMusic))
        if (typeof (localStorage.objMusic) == 'undefined') {
            // console.log(`dung`)
            localStorage.setItem('objMusic', JSON.stringify(this.storage()));
        } else {
            localStorage.setItem('objMusic', JSON.stringify(this.storage()));
        }


    },


    // Tải bài hát
    loadCurrentSong: function () {
        // console.log(this.currentIndex);
        songName.innerText = this.currentSong.songName;
        singer.innerText = this.currentSong.singer;
        audio.src = this.currentSong.path;
        // audio.loop= true;
        return;
    },


    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        this.check();
        return;

    }
}
app.start();