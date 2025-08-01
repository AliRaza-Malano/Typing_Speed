  
        // Lessons data
        const lessons = {
            programming: "Like the notes app organizes memories, my life arranges experiences into meaningful patterns. Each day becomes a new element in my personal array - some entries brief like simple variables, others complex like nested objects. The forEach loop mirrors how I revisit past moments, while createElement represents my constant growth. Challenges act like error handlers, making me more resilient.",
            literature: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
            tech: "Artificial intelligence is transforming industries across the globe. Machine learning algorithms can now predict consumer behavior with remarkable accuracy. Quantum computing promises to revolutionize data processing speeds. Blockchain technology provides secure decentralized transaction systems. The Internet of Things connects everyday devices to the digital world.",
            random: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Bright vixens jump; dozy fowl quack. Jackdaws love my big sphinx of quartz. The five boxing wizards jump quickly. Crazy Fredrick bought many very exquisite opal jewels."
        };

        // DOM elements
        const paragraphElement = document.getElementById('paragraph');
        const highlightElement = document.getElementById('highlight-paragraph');
        const typingInput = document.getElementById('typing-input');
        const timeInput = document.getElementById('time');
        const decreaseTimeBtn = document.getElementById('decrease-time');
        const increaseTimeBtn = document.getElementById('increase-time');
        const startBtn = document.getElementById('start-btn');
        const lessonSelect = document.getElementById('lesson-select');
        const timeDisplay = document.getElementById('time-display');
        const resultCard = document.getElementById('result-card');
        const wpmStat = document.getElementById('wpm-stat');
        const accuracyStat = document.getElementById('accuracy-stat');
        const timeStat = document.getElementById('time-stat');
        const restartBtn = document.getElementById('restart-btn');

        // Variables
        let timer;
        let timeLeft;
        let isTestRunning = false;
        let startTime;
        let endTime;
        let correctChars = 0;
        let totalChars = 0;

        // Initialize
        function init() {
            // Set initial paragraph
            updateParagraph();
            
            // Event listeners
            decreaseTimeBtn.addEventListener('click', decreaseTime);
            increaseTimeBtn.addEventListener('click', increaseTime);
            startBtn.addEventListener('click', toggleTest);
            typingInput.addEventListener('input', checkTyping);
            lessonSelect.addEventListener('change', updateParagraph);
            restartBtn.addEventListener('click', resetTest);
            
            // Prevent non-numeric input in time field
            timeInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value < 1) this.value = 1;
                if (this.value > 10) this.value = 10;
                updateTimerDisplay();
            });
        }

        // Update paragraph based on selected lesson
        function updateParagraph() {
            const lesson = lessonSelect.value;
            paragraphElement.textContent = lessons[lesson];
            highlightElement.textContent = lessons[lesson];
        }

        // Adjust time
        function decreaseTime() {
            if (timeInput.value > 1) {
                timeInput.value--;
                updateTimerDisplay();
            }
        }

        function increaseTime() {
            if (timeInput.value < 10) {
                timeInput.value++;
                updateTimerDisplay();
            }
        }

        // Start or stop test
        function toggleTest() {
            if (isTestRunning) {
                stopTest();
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            } else {
                startTest();
                startBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            }
            isTestRunning = !isTestRunning;
        }

        // Start the typing test
        function startTest() {
            // Reset variables
            correctChars = 0;
            totalChars = 0;
            timeLeft = timeInput.value * 60; // Convert minutes to seconds
            startTime = new Date();
            
            // Enable typing input
            typingInput.value = '';
            typingInput.disabled = false;
            typingInput.focus();
            
            // Hide result card
            resultCard.style.display = 'none';
            
            // Reset highlights
            highlightElement.innerHTML = paragraphElement.textContent;
            
            // Start timer
            updateTimerDisplay();
            timer = setInterval(function() {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    stopTest();
                    showResults();
                }
            }, 1000);
        }

        // Stop the typing test
        function stopTest() {
            clearInterval(timer);
            endTime = new Date();
            typingInput.disabled = true;
            
            if (timeLeft <= 0) {
                showResults();
            }
        }

        // Update timer display
        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        // Check typing against original text
        function checkTyping() {
            const typedText = typingInput.value;
            const originalText = paragraphElement.textContent;
            
            // Reset highlights
            let highlightHTML = '';
            correctChars = 0;
            totalChars = 0;
            
            for (let i = 0; i < originalText.length; i++) {
                if (i < typedText.length) {
                    // Mark extra characters as incorrect
                    if (typedText.length > originalText.length && i === originalText.length - 1) {
                        const extraChars = typedText.substring(originalText.length);
                        highlightHTML += `<span class="extra">${extraChars}</span>`;
                        totalChars += extraChars.length;
                        break;
                    }
                    
                    if (typedText[i] === originalText[i]) {
                        highlightHTML += `<span class="correct">${originalText[i]}</span>`;
                        correctChars++;
                    } else {
                        highlightHTML += `<span class="incorrect">${originalText[i]}</span>`;
                    }
                    totalChars++;
                    
                    // Highlight current position
                    if (i === typedText.length - 1) {
                        highlightHTML += `<span class="active">${originalText.substring(i+1, i+2)}</span>`;
                        i++; // Skip the next character since we added it
                    }
                } else {
                    highlightHTML += originalText[i];
                }
            }
            
            highlightElement.innerHTML = highlightHTML;
        }

        // Show results
        function showResults() {
            const timeTaken = (timeInput.value * 60) - timeLeft;
            const words = typingInput.value.trim() === '' ? 0 : 
                         typingInput.value.split(/\s+/).filter(word => word.length > 0).length;
            const wpm = timeTaken > 0 ? Math.round((words / timeTaken) * 60) : 0;
            const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
            
            wpmStat.textContent = wpm;
            accuracyStat.textContent = `${accuracy}%`;
            timeStat.textContent = timeTaken;
            
            resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }

        // Reset test
        function resetTest() {
            isTestRunning = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            typingInput.value = '';
            typingInput.disabled = true;
            timeLeft = timeInput.value * 60;
            updateTimerDisplay();
            highlightElement.innerHTML = paragraphElement.textContent;
            resultCard.style.display = 'none';
        }

        // Initialize the app
        window.addEventListener('DOMContentLoaded', init);
    