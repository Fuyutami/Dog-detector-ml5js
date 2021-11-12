const video = document.querySelector('#video')
const canvas = document.querySelector('#canvas')
const message = document.querySelector('.msg')

const objectDetector = ml5.objectDetector('cocossd', {}, modelLoaded)
const ctx = canvas.getContext('2d')
const sound = new Audio('snd.mp3')

function modelLoaded() {
    message.style.display = 'none'
    init()  
}

function init() {
    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(function (stream) {
            video.srcObject = stream
        })
        .catch(function (err) {
            console.log(err)
        })
    }

    video.addEventListener('play', function () {
        (function drawVideo() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            setTimeout(drawVideo, 100) 
        })()
    })

    video.addEventListener('loadeddata', function () {
        detectObjects()
    })
}

function detectObjects() {
    objectDetector.detect(video, gotResults)
    setTimeout(detectObjects, 100)
}

function gotResults(error, results) {
    if(error) {
        console.error(error)
    } else {
        console.log(results)
        results.forEach(object => {
            if(object.label == 'dog') {
                drawAnnotation(object.x, object.y, object.width, object.height, 'Dog detected')
                if(sound.paused) playSound()
            }
        })
    }
}

function drawAnnotation(x, y, w, h, name) {
    console.log(x, y, w, h)
    console.log(canvas.width)
    console.log(name)
    ctx.beginPath()
    ctx.rect(x, y, 300, 200)
    ctx.lineWidth = '3'
    ctx.strokeStyle = 'red'
    ctx.stroke()
    ctx.font = "30px Arial"
    ctx.fillStyle = 'red'
    ctx.fillText(name, x, y-10)
}

function playSound() {
    sound.play()
}