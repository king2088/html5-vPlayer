window.onload = function () {
    var vPlayer = document.getElementById('vPlayer')
    var playerContent = document.getElementById('playerContent')
    var playerControl = document.getElementById('playerControler')
    var play = document.getElementById('play')
    var pause = document.getElementById('pause')
    var reloadProgressDOM = document.getElementById('progressBar')
    var progressTimeShowDOM = document.getElementById('vplayerTimeLine')
    var volumeIconDOM = document.getElementById('volumeIcon')
    var vPlayVolumeDOM = document.getElementById('vPlayVolume')
    var dragBarDOM = document.getElementById('dragBar')
    var dragMaskDOM = document.getElementById('dragMask')
    var _playerControlHidden,_playTime

    //3000ms hidden player
    playerControlHidden()
    //play
    play.addEventListener('click',vPlayerPlay)
    //pause
    pause.addEventListener('click',vPlayerPause)
    //show player control
    playerContent.addEventListener('mouseover',playerControlShow)
    playerControl.addEventListener('mouseover',playerControlShow)
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


    //progress drag control


    //volume drag control
    playerContent.volume = 0.5
    dragMaskDOM.style.width = '50%'
    dragBarDOM.style.left = '50%'

    dragBarDOM.onmousedown = function (event) {
        var event = event || window.event;
        var leftVal = event.clientX - this.offsetLeft;
        var that = this;
        // 拖动一定写到 down 里面才可以
        document.onmousemove = function(event){
            var event = event || window.event;
            barleft = event.clientX - leftVal;
            if(barleft < 0)
                barleft = 0;
            else if(barleft > vPlayVolumeDOM.offsetWidth - dragBarDOM.offsetWidth)
                barleft = vPlayVolumeDOM.offsetWidth - dragBarDOM.offsetWidth;
            dragMaskDOM.style.width = barleft +'px' ;
            that.style.left = barleft + 'px';
            var volumeValue = barleft/(vPlayVolumeDOM.offsetWidth-dragBarDOM.offsetWidth)
            console.log(volumeValue)
            playerContent.volume = volumeValue
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    }
    document.onmouseup = function(){
        document.onmousemove = null; //移除事件
    }

    volumeIconDOM.onclick = function () {
        if(playerContent.volume != 0){
            playerContent.volume = 0
            dragMaskDOM.style.width = '0'
            dragBarDOM.style.left = '0'
        }else{
            playerContent.volume = 0.5
            dragMaskDOM.style.width = '50%'
            dragBarDOM.style.left = '50%'
        }

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