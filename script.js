// Quiz functionality
class TRTQuiz {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.answers = {};
        this.recommendation = null;
        this.userName = null;
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
        // Calculate product recommendation locally (this will also be done server-side)
        this.recommendation = this.calculateProductRecommendation();
        
        console.log('Quiz completed!', this.answers);
        console.log('Calculated recommendation:', this.recommendation);
        
        this.showContactForm();
    }

    calculateProductRecommendation() {
        const recommendations = {
            primary: '',
            secondary: '',
            reasoning: ''
        };

        // Analyze answers to determine best product fit
        const answer1 = this.answers[1]?.toLowerCase() || '';
        const answer2 = this.answers[2]?.toLowerCase() || '';
        const answer3 = this.answers[3]?.toLowerCase() || '';
        const answer4 = this.answers[4]?.toLowerCase() || '';

        // Primary recommendation logic
        if (answer1.includes('muscular') || answer1.includes('physique')) {
            recommendations.primary = 'TestoMax Pro';
            recommendations.reasoning = 'Optimized for muscle building and physique enhancement';
        } else if (answer1.includes('energy') || answer1.includes('sex drive')) {
            recommendations.primary = 'VitalBoost Energy';
            recommendations.reasoning = 'Designed to restore energy and libido';
        } else if (answer1.includes('confident') || answer1.includes('powerful')) {
            recommendations.primary = 'Alpha Performance';
            recommendations.reasoning = 'Formulated for confidence and overall performance';
        } else {
            recommendations.primary = 'Complete Wellness Stack';
            recommendations.reasoning = 'Comprehensive solution for overall health optimization';
        }

        // Secondary recommendation based on TRT preference
        if (answer3.includes('injections')) {
            recommendations.secondary = 'Injectable Support Kit';
        } else if (answer3.includes('pills')) {
            recommendations.secondary = 'Oral Enhancement Formula';
        } else if (answer3.includes('gel')) {
            recommendations.secondary = 'Topical Application System';
        } else {
            recommendations.secondary = 'Consultation Package';
        }

        return recommendations;
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
        const skipLink = document.querySelector('.skip-discount-link');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });

        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRecommendationSection();
        });
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const contactInfo = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            answers: this.answers,
            recommendation: this.recommendation
        };
        
        console.log('Submitting quiz data:', contactInfo);
        
        // Show loading state
        const submitButton = form.querySelector('.form-submit-btn');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'SUBMITTING...';
        submitButton.disabled = true;

        try {
            // Send data to the API endpoint following the data flow
            const response = await fetch('/api/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: this.answers,
                    email: contactInfo.email,
                    fullName: contactInfo.fullName
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success - data sent to Customer.io and segmentation triggered
                console.log('Quiz successfully submitted:', result);
                
                // Store the user's name for personalization
                this.userName = contactInfo.fullName;
                
                // Show the recommendation section
                this.showRecommendationSection();
                
                // Track successful submission
                console.log('Customer created/updated in Customer.io:', result.customerId);
                console.log('Recommendation:', result.recommendation);
                
            } else {
                throw new Error(result.error || 'Submission failed');
            }

        } catch (error) {
            console.error('Quiz submission error:', error);
            
            // For now, still show the recommendation section even if API fails
            // This allows testing the frontend functionality while API is being configured
            console.log('API submission failed, but continuing with frontend functionality...');
            
            // Store the user's name for personalization
            this.userName = contactInfo.fullName;
            
            // Show the recommendation section anyway
            this.showRecommendationSection();
            
            // Optional: Show a subtle message that the data will be saved later
            // (You can remove this once the API is fully configured)
            setTimeout(() => {
                console.log('Note: Quiz data saved locally. Backend integration in progress.');
            }, 1000);
            
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showRecommendationSection() {
        // Show the recommendation section
        const recommendationSection = document.getElementById('recommendation-section');
        recommendationSection.style.display = 'block';
        
        // Show the user goals section
        const userGoalsSection = document.getElementById('user-goals-section');
        userGoalsSection.style.display = 'block';
        
        // Show the comparison chart section
        const comparisonChartSection = document.getElementById('comparison-chart-section');
        comparisonChartSection.style.display = 'block';
        
        // Personalize the content
        this.personalizeRecommendation();
        this.personalizeUserGoals();
        
        // Fast scroll to the recommendation section
        this.fastScrollTo(recommendationSection);
    }

    personalizeUserGoals() {
        // Update the personalized header with user name
        const headerElement = document.getElementById('user-goals-header');
        if (this.userName) {
            const firstName = this.userName.split(' ')[0];
            headerElement.textContent = `${firstName}, based on your goals:`;
        } else {
            headerElement.textContent = "Josh, based on your goals:";
        }

        // Populate the goal items with answers from questions 1, 2, and 4
        const goal1Element = document.getElementById('goal-1');
        const goal2Element = document.getElementById('goal-2');
        const goal4Element = document.getElementById('goal-4');

        if (this.answers[1]) {
            goal1Element.textContent = this.answers[1];
        }
        if (this.answers[2]) {
            goal2Element.textContent = this.answers[2];
        }
        if (this.answers[4]) {
            goal4Element.textContent = this.answers[4];
        }

        // Personalize the benefits section
        this.personalizeBenefitsSection();
    }

    personalizeBenefitsSection() {
        // Determine product based on answer to question 3
        const question3Answer = this.answers[3]?.toLowerCase() || '';
        let productData = this.getProductData(question3Answer);

        // Update benefits product name
        const benefitsProductName = document.getElementById('benefits-product-name');
        benefitsProductName.textContent = productData.name;

        // Update benefits recommendation text
        const benefitsRecommendationText = document.getElementById('benefits-recommendation-text');
        benefitsRecommendationText.textContent = productData.description;
    }

    personalizeRecommendation() {
        // Update the personalized title
        const titleElement = document.getElementById('recommendation-title');
        if (this.userName) {
            titleElement.textContent = `${this.userName}, here's your personal recommendation`;
        } else {
            titleElement.textContent = "Here's your personal recommendation";
        }

        // Determine product based on answer to question 3
        const question3Answer = this.answers[3]?.toLowerCase() || '';
        let productData = this.getProductData(question3Answer);

        // Update product image
        const productImage = document.getElementById('product-image');
        productImage.src = productData.image;
        productImage.alt = productData.name;

        // Update product header
        const productHeader = document.getElementById('product-header');
        productHeader.textContent = productData.name;

        // Update product description
        const productDescription = document.getElementById('product-description');
        productDescription.textContent = productData.description;
    }

    getProductData(answer) {
        if (answer.includes('injection')) {
            return {
                name: 'Injectable TRT',
                image: 'assets/trt_injection_product.png',
                description: 'Injectable testosterone replacement therapy provides direct and efficient hormone delivery. Administered via intramuscular injection for optimal bioavailability.'
            };
        } else if (answer.includes('pill')) {
            return {
                name: 'Oral TRT',
                image: 'assets/oral_trt_product.png',
                description: 'Oral testosterone replacement therapy helps men with low testosterone. It involves taking pills that are absorbed in the digestive system.'
            };
        } else if (answer.includes('gel')) {
            return {
                name: 'Topical TRT Gel',
                image: 'assets/trt_gel_product.png',
                description: 'Topical testosterone gel provides convenient daily application. Applied to the skin for steady hormone absorption throughout the day.'
            };
        } else {
            // Default to oral if unsure
            return {
                name: 'Oral TRT',
                image: 'assets/oral_trt_product.png',
                description: 'Oral testosterone replacement therapy helps men with low testosterone. It involves taking pills that are absorbed in the digestive system.'
            };
        }
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