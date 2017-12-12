"use strict"
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
    var fullscreen = document.getElementById('fullScreen')
    var vPlayerErrorDOM = document.getElementById('vPlayerError')
    var _playerControlHidden,_playTime

    //click vPlayer element play or pause video
    playerContent.onclick = function(){
        if(!playerContent.paused){
            vPlayerPause()
        }else{
            vPlayerPlay()
        }
    }

    var isSupportTouch = 'ontouchend' in document ? true : false;
    // console.log('isSupportTouc',isSupportTouch)
    playerContent.controls = false
    playerContent.preload = 'auto'

    //3000ms hidden player
    playerControlHidden()
    //play
    play.onclick = function () {
        vPlayerPlay()
    }
    // play.ontouchstart = function () {
    //     vPlayerPlay()
    // }

    //pause
    pause.onclick = function () {
        vPlayerPause()
    }
    // pause.ontouchstart = function () {
    //     vPlayerPause()
    // }
    //show player control
    if(!isSupportTouch){
        playerContent.addEventListener('mouseover',playerControlShow)
    }else{
        playerContent.addEventListener('touchstart',playerControlShow)
    }

    //hidden player control
    if(!isSupportTouch){
        playerContent.addEventListener('mouseleave',playerControlHidden)
    }else{
        playerContent.addEventListener('touchend',playerControlHidden)
    }

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
        // console.log('start')
        if(_playerControlHidden){
            clearTimeout(_playerControlHidden)
        }
        if(!playerControl.style.opacity) return
        playerControl.style.display = 'block'
        playerControl.style.animation = 'fadeIn 1s'
        playerControl.style.opacity = 1
    }

    function playerControlHidden() {
        // console.log('hidden')
        _playerControlHidden = setTimeout(function () {
            playerControl.style.animation = 'fadeOut 1s'
            playerControl.style.opacity = 0
            playerControl.style.display = 'none'
        },3000)
    }

    function progressBar() {
        _playTime = setInterval(function () {
            // console.log(playerContent.buffered.end(0))
            //reload progress time (加载的时间/总时间)*100 = 加载的百分比
            var reloadProgressTime = (playerContent.buffered.end(0) / playerContent.duration) * 100
            reloadProgressDOM.children[0].style.width = reloadProgressTime + '%'
            console.log('reloadProgressTime',reloadProgressTime)
            //progress time = (playerContent.currentTime/playerContent.duration)*100
            var progressTime = playerContent.currentTime
            reloadProgressDOM.children[0].children[0].style.width = (progressTime / playerContent.duration) * 100 + '%'

            //progress time show
            progressTimeShowDOM.innerText = secToTime(progressTime)+' | '+secToTime(playerContent.duration)
            // console.log(playerContent.duration,playerContent.currentTime,playerContent.buffered.end(0))
            if(playerContent.currentTime === playerContent.duration){
                clearInterval(_playTime)
                vPlayerPause()
                reloadProgressDOM.children[0].children[0].style.width = 0
            }
        },1)
    }

    //init volume drag control to 50%
    playerContent.volume = 0.5
    dragMaskDOM.style.width = '50%'
    dragBarDOM.style.left = '50%'

    if(!isSupportTouch) {
        dragBarDOM.onmousedown = function (event) {
            drag(event, this)
        }

    }else {
        dragBarDOM.ontouchstart = function (event) {
            console.log(event)
            drag(event, this)
        }
    }

    /**
     * drag element
     * @param event event
     * @param ele element
     */
    function drag(event,ele) {
        var event = event || window.event;
        var lengthX
        if(!isSupportTouch){
            lengthX = event.clientX - ele.offsetLeft;
        }else{
            lengthX = event.touches[0].clientX - ele.offsetLeft;
        }

        if(!isSupportTouch) {
            document.onmousemove = function (event) {
                dragMove(event,ele,lengthX)
            }
        }else{
            document.ontouchmove = function (event) {
                dragMove(event,ele,lengthX)
            }
        }
    }

    /**
     * drag move volume: volume+ volume-
     * @param event event
     * @param ele element
     * @param x lengthX:clientX
     */
    function dragMove(event,ele,x) {
        var event = event || window.event;
        var barleft
        if(!isSupportTouch) {
            barleft = event.clientX - x;
        }else {
            barleft = event.touches[0].clientX - x;
        }
        if(barleft < 0)
            barleft = 0;
        else if(barleft > vPlayVolumeDOM.offsetWidth - dragBarDOM.offsetWidth)
            barleft = vPlayVolumeDOM.offsetWidth - dragBarDOM.offsetWidth;
        dragMaskDOM.style.width = barleft +'px' ;
        ele.style.left = barleft + 'px';
        var volumeValue = barleft/(vPlayVolumeDOM.offsetWidth-dragBarDOM.offsetWidth)
        // console.log(volumeValue)
        playerContent.volume = parseFloat(volumeValue)
        //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }

    document.onmouseup = function(){
        document.onmousemove = null; //移除事件
    }
    document.ontouchend = function () {
        document.ontouchstart = null
        document.ontouchmove = null
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

    //video fullscreen
    fullscreen.onclick = function () {
        playerContent.removeAttribute('controls')
        if(playerContent.webkitRequestFullScreen){
            playerContent.webkitRequestFullScreen()
        }else if(playerContent.mozRequestFullScreen){
            playerContent.mozRequestFullScreen()
        }else {
            playerContent.requestFullscreen()
        }
    }
    // console.log('networkState',playerContent.networkState)

    playerContent.addEventListener('error',vPlayerError)
    
    //error case
    function vPlayerError(){
        var error = playerContent.error
        switch (error.code) {
            case 1:
                vPlayerErrorDOM.innerText = 'MEDIA ERR ABORTED'
            break
            case 2:
                vPlayerErrorDOM.innerText = 'MEDIA ERR NETWORK'
            break
            case 3:
                vPlayerErrorDOM.innerText = 'MEDIA ERR DECODE'
            break
            case 4:
                vPlayerErrorDOM.innerText = 'MEDIA ERR SRC NOT SUPPORTED'
            break
        }
    }

    /**
     * format second to hh:mm:ss
     * @param second second
     * @returns {*} format time to 00:00:00
     */
    var secToTime = function (second) {
        var t
        if(second > -1){
            var hour = Math.floor(second/3600)
            var min = Math.floor(second/60) % 60
            var sec = second % 60
            if(hour < 10) {
                t = '0'+ hour + ":"
            } else {
                t = hour + ":"
            }
            if(min < 10){t += "0"}
            t += min + ":"
            if(sec < 10){t += "0"}
            t += sec.toFixed(0)
        }
        return t
    }
}