//TODO:
// 1 - button z opcjami
// 2 - zmiana koloru przed nową sesją

const WORK_SESSION_COLOR = '#C62828'
const WORK_SESSION_TIME = 25
const SHORT_BREAK_SESSION_COLOR = '#4A148C'
const SHORT_BREAK_SESSION_TIME = 5
const LONG_BREAK_SESSION_COLOR = 'rgb(47, 166, 212)'
const LONG_BREAK_SESSION_TIME = 20


let timerSession = 1
let notificationsAllowed = true 
let isTimerRunning = false
let hasSessionEnd = true
let currentTimerTime = null

let isTimeForBreak = () => timerSession%2==0 
let isTimeForLongBreak =() => timerSession % 6 ==0 //jak 3 i długa przerwa to 6 a nie 4 to 8


window.onload = () =>  {

    changeTimerMode()

    if (!("Notification" in window)) {

        console.log(`your browser doesn't support notification`)
        notificationsAllowed = false

    } else if (Notification.permission !== "denied") {

        Notification.requestPermission( (permission) => {
          
            if (permission === "granted") 
                console.log('now we can serve you notifications')
            else if (permission === "denied")
            {
                console.log(`we can't serve you notifications without your permission `)
                notificationsAllowed = false
            }

        })
      }
}


function timerInitializer(){
    
    let prepareStart = () =>{
        const button = document.getElementById("start")
        button.style.color = '#ffffff'
        
        timerSession++
    }


        if(isTimerRunning)
            isTimerRunning = false
        else{

            if(hasSessionEnd){
                prepareStart()
                hasSessionEnd = false
            }
            startTimer(currentTimerTime)
            isTimerRunning = true
        }

}

function changeTimerMode(){

    const button = document.getElementById("start")
    let timerTime = null

    console.log(timerSession)

    if(isTimeForLongBreak()){
        
        timerTime = new Time(LONG_BREAK_SESSION_TIME,0)
        changeButton(LONG_BREAK_SESSION_COLOR,timerTime.toString())
    }else if(isTimeForBreak()){
        
        timerTime = new Time(SHORT_BREAK_SESSION_TIME,0)
        changeButton(SHORT_BREAK_SESSION_COLOR,timerTime.toString())
    }else{

        timerTime = new Time(WORK_SESSION_TIME,0)
        changeButton(WORK_SESSION_COLOR,timerTime.toString())
    }

    button.style.color = '#c0bcbc'

    currentTimerTime = timerTime

}



function changeButton(color,sessionTime){
    const button = document.getElementById("start")
    button.style.backgroundColor = color
    button.innerHTML = sessionTime
}

function startTimer(time){
    const button = document.getElementById("start")
    button.innerHTML = time.toString()
    
    let i=0
    let lastTime = Date.now()
    const interval = setInterval(()=>{

        let currentTime = Date.now()

        if(lastTime + 1000 <= currentTime){

            const n = Math.floor((currentTime - lastTime)/1000)
            console.log(n)
            time.cutSeconds(n)
            const timeString = time.toString()
            document.title = timeString
            button.innerHTML = timeString

            lastTime = Date.now()

            if(time.isZero())
            {
                endSession()
                endTimer(interval)
            }
        }
        
        // if(i==10)
        // {
        //     time.cutOneSecond()

        //     const timeString = time.toString()
        //     document.title = timeString
        //     button.innerHTML = timeString

        //     i=0

        //     if(time.isZero())
        //     {
        //         endSession()
        //         endTimer(interval)
        //     }
        // }
        
        // i++

        if(!isTimerRunning)
            endTimer(interval)

    },100)
}

function endSession(){
    createNotification()
    changeTimerMode()
    hasSessionEnd = true
}

function endTimer(interval){

    clearInterval(interval)
    isTimerRunning = false
}

function createNotification() {

    const audio = new Audio('alarm.mp3')
    audio.play()

    const options = {
        body: 'czas na przerwe',
        icon: 'logo.png',
    }
    const notification = new Notification("MATERIALO", options);
    
  }


class Time {
    constructor(minutes,seconds){
        
        this.seconds = seconds
        //convert minuses to seconds
        this.seconds += minutes*60
    }

    toString(){
        const minutes = Math.floor(this.seconds / 60)
        const seconds = this.seconds % 60

        const minutesString = minutes>9 ? `${minutes}` : `0${minutes}`
        const secondsString = seconds>9 ? `${seconds}` : `0${seconds}`
        
        return `${minutesString}:${secondsString}`
    }

    cutSeconds(n){
        this.seconds-=n
    }

    cutOneSecond(){

        this.seconds--
    }

    isZero (){ 

        return this.seconds == 0  
    } 
}


