window.onload = function () {
    var vPlayer = document.getElementById('vPlayer')
    var playerContent = document.getElementById('playerContent')
    var playerControl = document.getElementById('playerControler')
    var play = document.getElementById('play')
    var pause = document.getElementById('pause')
    var reloadProgressDOM = document.getElementById('progressBar')
    var progressTimeShowDOM = document.getElementById('vplayerTimeLine')
    var _playerControlHidden,_playTime

    //3000ms hidden player
    playerControlHidden()
    //play
    play.addEventListener('click',vPlayerPlay)
    //pause
    pause.addEventListener('click',vPlayerPause)
    //show player control
    playerContent.addEventListener('mouseover',playerControlShow)
    //hidden player control
    playerContent.addEventListener('mouseleave',playerControlHidden)
    function vPlayerPlay() {
        progressBar()
        playerContent.play()
        play.style.display = 'none';
        pause.style.display = 'block';
    }
    function vPlayerPause() {
        if(_playTime){
            clearInterval(_playTime)
        }
        playerContent.pause()
        pause.style.display = 'none';
        play.style.display = 'block';
    }
    function playerControlShow() {
        if(_playerControlHidden){
            clearTimeout(_playerControlHidden)
        }
        if(!playerControl.style.opacity) return
        playerControl.style.display = 'block'
        playerControl.style.animation = 'fadeIn 1s'
        playerControl.style.opacity = 1
    }
    function playerControlHidden() {
        _playerControlHidden = setTimeout(function () {
            playerControl.style.animation = 'fadeOut 1s'
            playerControl.style.opacity = 0
            playerControl.style.display = 'none'
        },3000)
    }
    function progressBar() {
        _playTime = setInterval(function () {
            playerContent.duration
            //reload progress time (加载的时间/总时间)*100 = 加载的百分比
            var reloadProgressTime = (playerContent.buffered.end(0) / playerContent.duration) * 100
            reloadProgressDOM.children[0].style.width = reloadProgressTime + '%'

            //progress time = (playerContent.currentTime/playerContent.duration)*100
            var progressTime = (playerContent.currentTime / playerContent.duration) * 100
            reloadProgressDOM.children[0].children[0].style.width = progressTime + '%'

            //progress time show
            progressTimeShowDOM.innerText = secToTime(progressTime)+' | '+secToTime(playerContent.duration)
            // console.log(playerContent.duration,playerContent.currentTime,playerContent.buffered.end(0))
            if(playerContent.currentTime === playerContent.duration){
                clearInterval(_playTime)
                vPlayerPause()
                reloadProgressDOM.children[0].children[0].style.width = 0
            }
        },0)


    }

    /**
     * 时间秒数格式化
     * @param s 秒数
     * @returns {*} 格式化后的时分秒
     */
    var secToTime = function (s) {
        var t;
        if(s > -1){
            var hour = Math.floor(s/3600);
            var min = Math.floor(s/60) % 60;
            var sec = s % 60;
            if(hour < 10) {
                t = '0'+ hour + ":";
            } else {
                t = hour + ":";
            }
            if(min < 10){t += "0";}
            t += min + ":";
            if(sec < 10){t += "0";}
            t += sec.toFixed(0);
        }
        return t;
    }
}