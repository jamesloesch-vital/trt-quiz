// Quiz functionality
class TRTQuiz {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.answers = {};
        this.isFirstQuestion = true;
        this.init();
    }

    init() {
        this.bindEvents();
        // Initially hide the centered section
        document.getElementById('centered-questions').style.display = 'none';
    }

    bindEvents() {
        // Answer button click handlers for first question
        const firstQuestionButtons = document.querySelectorAll('.first-question-section .answer-btn');
        firstQuestionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectAnswer(e.target);
            });
        });
    }

    selectAnswer(button) {
        // Remove previous selection
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.answers[this.currentStep] = button.textContent;
        
        // Auto-advance to next step after short delay
        setTimeout(() => {
            this.nextStep();
        }, 800);
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            
            if (this.currentStep === 2) {
                // Transition to centered layout after first question
                this.showCenteredQuestions();
            } else {
                // Continue with centered questions
                this.updateStepIndicators();
                this.loadQuestion();
            }
        } else {
            this.completeQuiz();
        }
    }

    showCenteredQuestions() {
        // Show the centered section
        const centeredSection = document.getElementById('centered-questions');
        centeredSection.style.display = 'flex';
        
        // Scroll to the centered section
        centeredSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update the step indicators in centered section
        this.updateCenteredStepIndicators();
        
        // Bind events for centered question buttons
        this.bindCenteredEvents();
        
        this.isFirstQuestion = false;
    }

    bindCenteredEvents() {
        // Answer button click handlers for centered questions
        const centeredButtons = document.querySelectorAll('.centered-question-section .answer-btn');
        centeredButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectCenteredAnswer(e.target);
            });
        });
    }

    selectCenteredAnswer(button) {
        // Remove previous selection
        const centeredButtons = document.querySelectorAll('.centered-question-section .answer-btn');
        centeredButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.answers[this.currentStep] = button.textContent;
        
        // Auto-advance to next step after short delay
        setTimeout(() => {
            this.nextStep();
        }, 800);
    }

    updateStepIndicators() {
        // Update first question section steps
        const firstSteps = document.querySelectorAll('.first-question-section .step');
        firstSteps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateCenteredStepIndicators() {
        // Update centered section steps
        const centeredSteps = document.querySelectorAll('.centered-question-section .step');
        centeredSteps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    loadQuestion() {
        // Load questions for the centered section
        const questionTitle = document.querySelector('.centered-question-section .question-title');
        const answerContainer = document.querySelector('.centered-question-section .answer-options');
        
        // Questions for different steps
        const questions = {
            3: {
                title: "Which form of TRT would you be most comfortable taking?",
                answers: [
                    "Injections",
                    "Pills",
                    "Gel",
                    "I'm not sure"
                ]
            },
            4: {
                title: "Are you committed to investing in becoming the strongest version of yourself?",
                answers: [
                    "Yes, my health and performance are my top priority",
                    "Yes, I'm ready to make changes that actually work",
                    "Yes, I want to feel incredible every day",
                    "I want to explore what's possible for me"
                ]
            }
        };

        if (questions[this.currentStep]) {
            questionTitle.textContent = questions[this.currentStep].title;
            
            answerContainer.innerHTML = '';
            questions[this.currentStep].answers.forEach(answer => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                button.addEventListener('click', (e) => {
                    this.selectCenteredAnswer(e.target);
                });
                answerContainer.appendChild(button);
            });
            
            // Update step indicators
            this.updateCenteredStepIndicators();
        }
    }

    completeQuiz() {
        // Handle quiz completion - show contact form
        console.log('Quiz completed!', this.answers);
        this.showContactForm();
    }

    showContactForm() {
        // Show the contact form section
        const contactSection = document.getElementById('contact-form');
        contactSection.style.display = 'flex';
        
        // Scroll to the contact form
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Bind form submit event
        this.bindFormEvents();
    }

    bindFormEvents() {
        const form = document.getElementById('contact-form-element');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const contactInfo = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            answers: this.answers
        };
        
        console.log('Contact form submitted:', contactInfo);
        
        // Here you would typically send the data to your backend
        // For now, we'll just show a success message
        alert('Thank you! We\'ll be in touch with your personalized treatment plan.');
        
        // Optionally reset the form
        form.reset();
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TRTQuiz();
});

// Add selected state styles
const style = document.createElement('style');
style.textContent = `
    .answer-btn.selected {
        background-color: #7A5420;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(144, 99, 35, 0.4);
    }
`;
document.head.appendChild(style); 