document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById("splash");
    const startSplashBtn = document.getElementById("start-splash");
    const app = document.getElementById("app");

    const setTaskPage = document.getElementById("set-task");
    const workPage = document.getElementById("work-timer");
    const breakPage = document.getElementById("break-timer");

    const taskInput = document.getElementById("task-input");
    const durationInput = document.getElementById("task-duration");
    const setTaskBtn = document.getElementById("set-task-btn");

    const currentTask = document.getElementById("current-task");
    const breakTask = document.getElementById("break-task");

    const workTimeDisplay = document.getElementById("work-time");
    const breakTimeDisplay = document.getElementById("break-time");

    const startWorkBtn = document.getElementById("start-work");
    const pauseWorkBtn = document.getElementById("pause-work");
    const resetWorkBtn = document.getElementById("reset-work");

    const startBreakBtn = document.getElementById("start-break");
    const pauseBreakBtn = document.getElementById("pause-break");
    const resetBreakBtn = document.getElementById("reset-break");

    const sessionDots = document.querySelectorAll('.session-dot');

    const alarmSound = new Audio("/static/audio/cute-sound-for-videos-397053.mp3");
    alarmSound.volume = 1.0;

    const workQuotes = [
        "Focus on progress, not perfection",
        "One pomodoro at a time 🍓",
        "Small steps lead to big results", 
        "You're doing great! Keep going 💪",
        "Every great achievement begins with a single pomodoro"
    ];

    const breakQuotes = [
        "Resting is productive too 🍓",
        "Enjoy your break! You earned it",
        "Time to recharge ⚡",
        "Stretch and breathe 🌸",
        "Resting is part of the process 🍓"
    ];

    let taskName = "";
    let timer;
    let timeLeft = 0;
    let isRunning = false;
    let pomodoroCount = 0;

    const SHORT_BREAK = 5 * 60;
    const LONG_BREAK = 15 * 60;

    function goBackToSetTask() {
     pauseTimer();
    
     showPage(setTaskPage);
    
     taskInput.value = taskName;
     durationInput.value = Math.floor(timeLeft / 60);
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    function showPage(page) {
        [setTaskPage, workPage, breakPage].forEach(p => {
          p.style.display = 'none';
        });
        page.style.display = 'flex';

        if (page === workPage) updateMotivationQuote("work");
        if (page === breakPage) updateMotivationQuote("break");
    }

    function updateMotivationQuote(mode) {
        const quotes = mode === "work" ? workQuotes : breakQuotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        const quoteElement = document.querySelector('.motivation-quote p');
        if (quoteElement) {
            quoteElement.textContent = '"' + randomQuote + '"';
        }
    }

    function updateSessionIndicator() {
        sessionDots.forEach((dot, index) => {
            if (index < pomodoroCount % 4) {
                dot.classList.add('completed');
            } else {
                dot.classList.remove('completed');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('back-button')) {
            goBackToSetTask();
        }
    });

    startSplashBtn.addEventListener("click", () => {
        console.log("Start button clicked!");
        splash.style.display = 'none';
        app.style.display = 'block';
        showPage(setTaskPage);
    });

    setTaskBtn.addEventListener("click", () => {
        taskName = taskInput.value.trim() || "Unnamed Task";
        currentTask.textContent = taskName;
        breakTask.textContent = taskName;

        const durationMins = parseInt(durationInput.value);
        timeLeft = (!isNaN(durationMins) && durationMins > 0) ? durationMins * 60 : 25 * 60;

        workTimeDisplay.textContent = formatTime(timeLeft);
        showPage(workPage);
    });

    function startTimer(mode) {
        if (isRunning) return;
        isRunning = true;

        timer = setInterval(() => {
            timeLeft--;

            if (mode === "work") workTimeDisplay.textContent = formatTime(timeLeft);
            else breakTimeDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                
                alarmSound.play();

                if (mode === "work") {
                    pomodoroCount++;
                    updateSessionIndicator();
                    timeLeft = (pomodoroCount % 4 === 0) ? LONG_BREAK : SHORT_BREAK;
                    breakTimeDisplay.textContent = formatTime(timeLeft);
                    showPage(breakPage);
                } else {
                    timeLeft = 25 * 60;
                    workTimeDisplay.textContent = formatTime(timeLeft);
                    showPage(workPage);
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }

    function resetTimer(mode) {
        clearInterval(timer);
        isRunning = false;

        if (mode === "work") {
            const durationMins = parseInt(durationInput.value);
            timeLeft = (!isNaN(durationMins) && durationMins > 0) ? durationMins * 60 : 25 * 60;
            workTimeDisplay.textContent = formatTime(timeLeft);
        } else {
            timeLeft = (pomodoroCount % 4 === 0) ? LONG_BREAK : SHORT_BREAK;
            breakTimeDisplay.textContent = formatTime(timeLeft);
        }
    }

    startWorkBtn.addEventListener("click", () => startTimer("work"));
    pauseWorkBtn.addEventListener("click", pauseTimer);
    resetWorkBtn.addEventListener("click", () => resetTimer("work"));

    startBreakBtn.addEventListener("click", () => startTimer("break"));
    pauseBreakBtn.addEventListener("click", pauseTimer);
    resetBreakBtn.addEventListener("click", () => resetTimer("break"));

    updateSessionIndicator();
});