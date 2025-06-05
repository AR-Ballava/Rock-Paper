// Game State Management
class RockPaperScissorsGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.roundNumber = 1;
        this.isPlaying = false;
        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceEmojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        
        this.initializeElements();
        this.bindEvents();
        this.createParticles();
        this.updateDisplay();
    }
    
    initializeElements() {
        // Score elements
        this.playerScoreEl = document.getElementById('playerScore');
        this.computerScoreEl = document.getElementById('computerScore');
        this.roundCounterEl = document.getElementById('roundCounter');
        
        // Result elements
        this.resultMessageEl = document.getElementById('resultMessage');
        this.playerChoiceDisplayEl = document.getElementById('playerChoiceDisplay');
        this.computerChoiceDisplayEl = document.getElementById('computerChoiceDisplay');
        
        // Control elements
        this.choiceButtons = document.querySelectorAll('.choice-btn');
        this.resetButton = document.getElementById('resetBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Effect elements
        this.particlesEl = document.getElementById('particles');
        this.celebrationEl = document.getElementById('celebration');
    }
    
    bindEvents() {
        // Choice button events
        this.choiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.isPlaying) {
                    const choice = button.dataset.choice;
                    this.playRound(choice);
                    this.animateButtonClick(button);
                }
            });
            
            // Add hover sound effect (visual feedback)
            button.addEventListener('mouseenter', () => {
                if (!this.isPlaying) {
                    button.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!this.isPlaying) {
                    button.style.transform = '';
                }
            });
        });
        
        // Reset button event
        this.resetButton.addEventListener('click', () => {
            this.resetGame();
            this.animateButtonClick(this.resetButton);
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) {
                switch(e.key.toLowerCase()) {
                    case 'r':
                        this.playRound('rock');
                        break;
                    case 'p':
                        this.playRound('paper');
                        break;
                    case 's':
                        this.playRound('scissors');
                        break;
                    case 'escape':
                        this.resetGame();
                        break;
                }
            }
        });
    }
    
    async playRound(playerChoice) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.updateStatus('playing', 'Battle in progress...');
        
        // Disable buttons during animation
        this.setButtonsEnabled(false);
        
        // Generate computer choice
        const computerChoice = this.getComputerChoice();
        
        // Animate choice reveal
        await this.animateChoiceReveal(playerChoice, computerChoice);
        
        // Determine winner
        const result = this.determineWinner(playerChoice, computerChoice);
        
        // Update scores and display result
        this.updateScore(result);
        this.displayResult(result, playerChoice, computerChoice);
        
        // Celebration effects for wins
        if (result === 'win') {
            this.triggerCelebration();
        }
        
        // Update round counter
        this.roundNumber++;
        this.updateDisplay();
        
        // Re-enable buttons after delay
        setTimeout(() => {
            this.isPlaying = false;
            this.setButtonsEnabled(true);
            this.updateStatus('ready', 'Ready to play!');
        }, 2000);
    }
    
    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }
    
    updateScore(result) {
        if (result === 'win') {
            this.playerScore++;
            this.animateScoreUpdate(this.playerScoreEl);
        } else if (result === 'lose') {
            this.computerScore++;
            this.animateScoreUpdate(this.computerScoreEl);
        }
    }
    
    displayResult(result, playerChoice, computerChoice) {
        const messages = {
            win: '🎉 You Win! 🎉',
            lose: '💔 You Lose! 💔',
            draw: '🤝 It\'s a Draw! 🤝'
        };
        
        this.resultMessageEl.textContent = messages[result];
        this.resultMessageEl.className = `result-message ${result}`;
        
        // Animate result message
        this.resultMessageEl.style.animation = 'none';
        setTimeout(() => {
            this.resultMessageEl.style.animation = 'pulse 0.5s ease-out';
        }, 10);
    }
    
    async animateChoiceReveal(playerChoice, computerChoice) {
        // Reset choice displays
        const playerIcon = this.playerChoiceDisplayEl.querySelector('.choice-icon');
        const computerIcon = this.computerChoiceDisplayEl.querySelector('.choice-icon');
        
        // Add active class for animation
        this.playerChoiceDisplayEl.classList.add('active');
        this.computerChoiceDisplayEl.classList.add('active');
        
        // Animate thinking phase
        let thinkingCount = 0;
        const thinkingEmojis = ['🤔', '💭', '⚡', '🎯'];
        
        const thinkingInterval = setInterval(() => {
            const emoji = thinkingEmojis[thinkingCount % thinkingEmojis.length];
            playerIcon.textContent = emoji;
            computerIcon.textContent = emoji;
            thinkingCount++;
        }, 200);
        
        // Wait for thinking animation
        await this.delay(1000);
        clearInterval(thinkingInterval);
        
        // Reveal choices with dramatic effect
        await this.delay(200);
        playerIcon.textContent = this.choiceEmojis[playerChoice];
        
        await this.delay(300);
        computerIcon.textContent = this.choiceEmojis[computerChoice];
        
        // Add choice-specific animations
        playerIcon.style.animation = 'bounce 0.6s ease-out';
        computerIcon.style.animation = 'bounce 0.6s ease-out 0.2s';
    }
    
    animateScoreUpdate(scoreElement) {
        scoreElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.classList.remove('score-update');
        }, 600);
    }
    
    animateButtonClick(button) {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    }
    
    setButtonsEnabled(enabled) {
        this.choiceButtons.forEach(button => {
            button.style.opacity = enabled ? '1' : '0.6';
            button.style.pointerEvents = enabled ? 'auto' : 'none';
        });
    }
    
    updateStatus(status, message) {
        this.statusIndicator.className = `status-indicator ${status}`;
        this.statusIndicator.innerHTML = `<i class="fas ${status === 'ready' ? 'fa-play' : 'fa-clock'}"></i> ${message}`;
    }
    
    updateDisplay() {
        this.playerScoreEl.textContent = this.playerScore;
        this.computerScoreEl.textContent = this.computerScore;
        this.roundCounterEl.textContent = `Round ${this.roundNumber}`;
    }
    
    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.roundNumber = 1;
        this.isPlaying = false;
        
        // Reset display elements
        this.updateDisplay();
        this.resultMessageEl.textContent = 'Choose your move!';
        this.resultMessageEl.className = 'result-message';
        
        // Reset choice displays
        const playerIcon = this.playerChoiceDisplayEl.querySelector('.choice-icon');
        const computerIcon = this.computerChoiceDisplayEl.querySelector('.choice-icon');
        
        playerIcon.textContent = '❓';
        computerIcon.textContent = '❓';
        
        this.playerChoiceDisplayEl.classList.remove('active');
        this.computerChoiceDisplayEl.classList.remove('active');
        
        // Re-enable buttons
        this.setButtonsEnabled(true);
        this.updateStatus('ready', 'Ready to play!');
        
        // Add reset animation
        document.querySelector('.game-container').style.animation = 'fadeIn 0.5s ease-out';
    }
    
    triggerCelebration() {
        // Create confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, i * 100);
        }
        
        // Screen flash effect
        document.body.style.background = `linear-gradient(135deg, 
            hsl(var(--success-color) / 0.1), 
            hsl(var(--background)), 
            hsl(var(--success-color) / 0.1)
        )`;
        
        setTimeout(() => {
            document.body.style.background = '';
        }, 500);
    }
    
    createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        this.celebrationEl.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
    
    createParticles() {
        // Create floating particles for ambient effect
        setInterval(() => {
            if (this.particlesEl.children.length < 20) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 4 + 2) + 's';
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                
                this.particlesEl.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 6000);
            }
        }, 500);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissorsGame();
    
    // Add welcome animation
    setTimeout(() => {
        document.querySelector('.game-header').style.animation = 'bounce 1s ease-out';
    }, 1000);
    
    // Add keyboard hints
    console.log('🎮 Keyboard Controls:');
    console.log('R - Rock, P - Paper, S - Scissors, ESC - Reset');
});

// Service Worker for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW registered'))
            .catch(() => console.log('SW registration failed'));
    });
}

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, { passive: true });

// Prevent context menu on long press for better mobile experience
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
    }
});

// Add visual feedback for focus (accessibility)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
}
