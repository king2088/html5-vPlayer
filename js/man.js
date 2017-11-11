window.onload = function () {
    var vPlayer = document.getElementById('vPlayer')
    var playerContent = document.getElementById('playerContent')
    var playerControl = document.getElementById('playerControler')
    var play = document.getElementById('play')
    var pause = document.getElementById('pause')
    var reloadProgressDOM = document.getElementById('progressBar')
    var _playerControlHidden,_playTime

    //play
    play.addEventListener('click',vPlayerPlay)
    //pause
    pause.addEventListener('click',vPlayerPause)
    //show player control
    playerContent.addEventListener('mouseover',playerControlShow)
    //hidden player control
    playerContent.addEventListener('mouseleave',playerControlHidden)
    console.log(playerControl.style.opacity)
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
            // console.log(reloadProgressDOM,reloadProgressDOM.children[0])
            //progress time = (playerContent.currentTime/playerContent.duration)*100
            var progressTime = (playerContent.currentTime / playerContent.duration) * 100
            reloadProgressDOM.children[0].children[0].style.width = progressTime + '%'
            // console.log(playerContent.duration,playerContent.currentTime,playerContent.buffered.end(0))
            if(playerContent.currentTime === playerContent.duration){
                clearInterval(_playTime)
                vPlayerPause()
            }
        })


    }
}