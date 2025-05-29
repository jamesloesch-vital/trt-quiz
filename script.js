// Quiz functionality
class TRTQuiz {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.answers = {};
        this.init();
    }

    init() {
        this.bindEvents();
        // Initially hide all question sections except the first
        document.getElementById('question-2').style.display = 'none';
        document.getElementById('question-3').style.display = 'none';
        document.getElementById('question-4').style.display = 'none';
    }

    bindEvents() {
        // Answer button click handlers for first question
        const firstQuestionButtons = document.querySelectorAll('.first-question-section .answer-btn');
        firstQuestionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectAnswer(e.target);
            });
        });

        // Answer button click handlers for question 2
        this.bindQuestionEvents('question-2');
        
        // Answer button click handlers for question 3
        this.bindQuestionEvents('question-3');
        
        // Answer button click handlers for question 4
        this.bindQuestionEvents('question-4');
    }

    bindQuestionEvents(questionId) {
        const questionButtons = document.querySelectorAll(`#${questionId} .answer-btn`);
        questionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectQuestionAnswer(e.target, questionId);
            });
        });
    }

    selectAnswer(button) {
        // Remove previous selection
        const allButtons = document.querySelectorAll('.first-question-section .answer-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.answers[this.currentStep] = button.textContent;
        
        // Auto-advance to next step after short delay
        setTimeout(() => {
            this.nextStep();
        }, 200);
    }

    selectQuestionAnswer(button, questionId) {
        // Remove previous selection within this question
        const questionButtons = document.querySelectorAll(`#${questionId} .answer-btn`);
        questionButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.answers[this.currentStep] = button.textContent;
        
        // Auto-advance to next step after short delay
        setTimeout(() => {
            this.nextStep();
        }, 200);
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showNextQuestion();
        } else {
            this.completeQuiz();
        }
    }

    showNextQuestion() {
        // Show the appropriate question section
        const nextQuestionId = `question-${this.currentStep}`;
        const nextSection = document.getElementById(nextQuestionId);
        
        if (nextSection) {
            // Show the next section
            nextSection.style.display = 'flex';
            
            // Fast scroll to the next section
            this.fastScrollTo(nextSection);
        }
    }

    fastScrollTo(element) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 400; // 400ms for snappy animation
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation.bind(this));
        }

        requestAnimationFrame(animation.bind(this));
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
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
        
        // Fast scroll to the contact form
        this.fastScrollTo(contactSection);
        
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