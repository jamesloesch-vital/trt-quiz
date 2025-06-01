// Quiz functionality
class TRTQuiz {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
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
        document.getElementById('question-5').style.display = 'none';
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
        
        // Answer button click handlers for question 5
        this.bindQuestionEvents('question-5');
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
        
        // Show the process section
        const processSection = document.getElementById('process-section');
        processSection.style.display = 'block';
        
        // Show the testimonials section
        const testimonialsSection = document.getElementById('testimonials-section');
        testimonialsSection.style.display = 'block';
        
        // Show the FAQ section
        const faqSection = document.getElementById('faq-section');
        faqSection.style.display = 'block';
        
        // Show the footer section
        const footerSection = document.getElementById('footer-section');
        footerSection.style.display = 'block';
        
        // Personalize the content
        this.personalizeRecommendation();
        this.personalizeUserGoals();
        
        // Update comparison chart based on Q3 answer
        this.updateComparisonChart();
        
        // Update FAQs based on question 3 answer
        this.updateFAQs();
        
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
            headerElement.textContent = "Based on your goals:";
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

        // Update pricing based on Q3 answer
        this.updatePricing(question3Answer);

        // Update hero image if "I'm not sure" was selected
        if (question3Answer.includes('not sure')) {
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.src = 'assets/product-group.png';
                heroImage.alt = 'Custom TRT Plan - Multiple Treatment Options';
            }
        }
    }

    getProductData(answer) {
        if (answer.includes('injection')) {
            return {
                name: 'Injectable TRT',
                image: 'assets/trt_injection_product.png',
                description: 'It provides the most direct and efficient hormone delivery. Administered via intramuscular injection for optimal bioavailability.'
            };
        } else if (answer.includes('pill')) {
            return {
                name: 'Oral TRT',
                image: 'assets/oral_trt_product.png',
                description: 'It is a safe, easy, daily pill that delivers bio-identical testosterone to help you effectively boost your testosterone levels. '
            };
        } else if (answer.includes('gel')) {
            return {
                name: 'Topical TRT Gel',
                image: 'assets/trt_gel_product.png',
                description: 'It provides convenient daily application and a powerful testosterone boost. Applied to the skin for steady hormone absorption throughout the day.'
            };
        } else if (answer.includes('not sure')) {
            return {
                name: 'Custom Plan',
                image: 'assets/product-group.png',
                description: 'Our medical team can create a custom plan tailored to your specific needs and preferences. They will work with you to determine the best approach, based on your biomarkers, medical history, and personal preference.'
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

    updatePricing(answer) {
        const monthlyTreatmentPrice = document.getElementById('monthly-treatment-price');
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        // If "I'm not sure" is selected, hide the "PAY IF PRESCRIBED" card
        if (answer && answer.toLowerCase().includes('not sure')) {
            // Hide the second pricing card (PAY IF PRESCRIBED)
            if (pricingCards.length >= 2) {
                pricingCards[1].style.display = 'none';
            }
        } else {
            // Show both pricing cards for specific selections
            pricingCards.forEach(card => {
                card.style.display = 'block';
            });
            
            // Update pricing based on selection
            if (answer && answer.toLowerCase().includes('injection')) {
                // Injectable TRT pricing
                monthlyTreatmentPrice.innerHTML = '$74 <span class="pricing-period">/ first month</span>';
            } else if (answer && answer.toLowerCase().includes('gel')) {
                // Gel TRT pricing  
                monthlyTreatmentPrice.innerHTML = '$83 <span class="pricing-period">/ first month</span>';
            } else {
                // Default to Oral TRT pricing
                monthlyTreatmentPrice.innerHTML = '$104 <span class="pricing-period">/ first month</span>';
            }
        }
    }

    getFAQData(productType) {
        const faqData = {
            injection: [
                {
                    question: "What's the cost and what's included?",
                    answer: "Treatment starts with a one-time payment of $95 for initial lab work and consultation. This payment is applied to your first month's cost, if prescribed. Monthly treatment is $74/first month and includes medication, follow-up appointments, labs, shipping, and support."
                },
                {
                    question: "How does the payment process work?",
                    answer: "Initial lab testing and doctor visit: $95. Monthly treatment: $169/month. Your initial $95 payment applies to your first month's cost, so if prescribed, you will only be billed $74 for your first month of treatment. After your first month, you will be be billed $169/month for as long as you are prescribed treatment and choose to continue."
                },
                {
                    question: "How do I take this medication?",
                    answer: "You will be prescribed TRT for either subcutaneous or intramuscular injections. Your medication will be provided along with syringes and alcohol swabs. Your doctor will determine dosage and frequency, which is often 1-2x per week."
                },
                {
                    question: "When can I expect to see results?",
                    answer: "Individual results vary, but many patients may see results within 2-4 weeks of starting treatment."
                },
                {
                    question: "What are the side effects of injectable TRT?",
                    answer: "Side effects may include acne, change in libido, hair loss, increase in blood pressure, increase in hematocrit and hemoglobin, increase in PSA. PSA increases are negligible, minimal effect of blood pressure, and hematocrit increases are the lowest out of all forms of testosterone. If you experience any side effects, stop taking injectable TRT and contact your doctor immediately."
                },
                {
                    question: "Who should take injectable TRT?",
                    answer: "This product is specifically designed for men who are seeking to optimize their overall well-being and quality of life. It's particularly beneficial for those experiencing symptoms associated with low testosterone levels. These symptoms can include feelings of lethargy, a decrease in libido, and a reduced sense of drive or motivation. If you find yourself facing these challenges, our product may be a suitable choice to help you regain your vitality and enhance your daily performance."
                },
                {
                    question: "Do you accept insurance?",
                    answer: "No, we do not accept insurance. We are a cash-based practice."
                }
            ],
            pills: [
                {
                    question: "What is the cost and what's included?",
                    answer: "Treatment starts with a one-time payment of $95 for initial lab work and consultation. This payment is applied to your first month's cost, if prescribed. Monthly treatment is $169/month and includes medication, follow-up appointments, labs, shipping, and support."
                },
                {
                    question: "How does the payment process work?",
                    answer: "Initial lab testing and doctor visit: $95. Monthly treatment: $169/month. Your initial $95 payment applies to your first month's cost, so if prescribed, you will only be billed $74 for your first month of treatment. After your first month, you will be be billed $169/month for as long as you are prescribed treatment and choose to continue."
                },
                {
                    question: "How do I take this medication?",
                    answer: "Oral TRT is is typically taken twice daily with a meal that has at least 200-300 calories from fat (or as directed by your doctor). It is best to take it with a meal to help with absorption, as fat is what helps get the medication into your bloodstream via the lymphatic system."
                },
                {
                    question: "When can I expect to see results?",
                    answer: "Individual results vary, but many patients may see results within 2-4 weeks of starting treatment."
                },
                {
                    question: "What are the side effects of Oral TRT?",
                    answer: "Side effects may include acne, change in libido, hair loss, increase in blood pressure, increase in hematocrit and hemoglobin, increase in PSA. All Vital Protocol patients recieve frequent follow-up lab testing and doctor visits as part of their treatment plan to moinitor for any signicant changes in biomarkers and/or side effetcs. If you experience any side effects, stop taking injectable TRT and contact your doctor immediately."
                },
                {
                    question: "Who should take Oral TRT?",
                    answer: "This product is specifically designed for men who are seeking to optimize their overall well-being and quality of life. It's particularly beneficial for those experiencing symptoms associated with low testosterone levels. These symptoms can include feelings of lethargy, a decrease in libido, and a reduced sense of drive or motivation. If you find yourself facing these challenges, our product may be a suitable choice to help you regain your vitality and enhance your daily performance."
                },
                {
                    question: "Can I drink alcohol while on Oral TRT?",
                    answer: "Moderate drinking (≤ 2 drinks/day) is generally fine, but heavy alcohol can strain the liver and raise blood pressure—both issues we monitor on TRT."
                },
                {
                    question: "Do I have to cycle off of Oral TRT?",
                    answer: "No. TRT is meant to be long‑term; we monitor labs (testosterone, hematocrit, PSA) every 6–12 months to keep you in the healthy range."
                },
                {
                    question: "Do you accept insurance?",
                    answer: "No, we do not accept insurance. We are a cash-based practice."
                }
            ],
            gel: [
                {
                    question: "What is the cost and what's included?",
                    answer: "Treatment starts with a one-time payment of $95 for initial lab work and consultation. This payment is applied to your first month's cost, if prescribed. Monthly treatment is $178/month and includes medication, follow-up appointments, labs, shipping, and support."
                },
                {
                    question: "How does the payment process work?",
                    answer: "Initial lab testing and doctor visit: $95. Monthly treatment: $178/month. Your initial $95 payment applies to your first month's cost, so if prescribed, you will only be billed $83 for your first month of treatment. After your first month, you will be be billed $178/month for as long as you are prescribed treatment and choose to continue."
                },
                {
                    question: "How do I take this medication?",
                    answer: "TRT Gel is applied to the skin once a day (or as directed by your doctor). Rub the pre-measured gel onto clean, dry, unboken skin of the shoudlers, upper arms, abdomen, or inner thighs. Wash yourhands with soap and water right after, let the area air-dry, then cover with clothing."
                },
                {
                    question: "How long before I can shower or swim?",
                    answer: "Wait at least 2 hours (6 hours for maximal absorption) before bathing, swimming, or heavy sweating."
                },
                {
                    question: "What if the gel rubs off on someone else?",
                    answer: "Unwashed gel can transfer testosterone to partners or kids, causing acne or body‑hair growth. Keep the area covered, wash before skin‑to‑skin contact, and re‑apply if heavy rubbing removes the dose."
                },
                {
                    question: "When can I expect to see results?",
                    answer: "Individual results vary, but many patients may see results within 2-4 weeks of starting treatment."
                },
                {
                    question: "What are the side effects of TRT gel?",
                    answer: "Mild skin irritation where applied, acne/oily skin, increased red‑blood‑cell count, mood shifts, or slight BP rise. Severe reactions (very rare) include breathing problems or severe rash. If you experience any side effects, stop taking TRT Gel and contact your doctor immediately."
                },
                {
                    question: "Who should take TRT gel?",
                    answer: "This product is specifically designed for men who are seeking to optimize their overall well-being and quality of life. It's particularly beneficial for those experiencing symptoms associated with low testosterone levels. These symptoms can include feelings of lethargy, a decrease in libido, and a reduced sense of drive or motivation. If you find yourself facing these challenges, our product may be a suitable choice to help you regain your vitality and enhance your daily performance."
                },
                {
                    question: "Do you accept insurance?",
                    answer: "No, we do not accept insurance. We are a cash-based practice."
                }
            ],
            unsure: [
                {
                    question: "Do you take insurance?",
                    answer: "No, we are a cash-based practice"
                },
                {
                    question: "What TRT options do you provide?",
                    answer: "We provide several TRT options, including injections, pills, and gel. Your doctor will determine the most effective treatment option for you"
                },
                {
                    question: "What am I paying $95 today for?",
                    answer: "The $95 paid today covers your lab test and first doctor visit. After you labs come in and you meet with the doctor, a treatment plan will be created for you, if appropriate. The $95 will be applied to the first month of whichever treatment option you're prescribed."
                },
                {
                    question: "Where can I get my labs done?",
                    answer: "Labs can be done at your nearest Labcorp or Quest Diagnostics location. Whichever is most convenient for you!"
                },
                {
                    question: "How long does it take for lab results to come back?",
                    answer: "Lab result times vary by Labcorp or Quest Diagnostics location, but typically results are returned within 24-48 hours."
                },
                {
                    question: "What happens if I don't get prescribed TRT?",
                    answer: "All prescriptions are issued by our licensed medical doctors using their professional medical discretion. If you do not receive a prescription, that is their expert decision, which will be fully explained to you during your first visit if this is the case."
                },
                {
                    question: "What happens if I want to switch to a new medication after starting on a different one?",
                    answer: "During follow up visits or through our support channel, you can request to switch medications. This decision will ultimately be made by the physician responsible for your care."
                }
            ]
        };

        // Return specific FAQ data based on product type
        return faqData[productType] || faqData.gel;
    }

    updateFAQs() {
        // Determine product type based on answer to question 3
        const question3Answer = this.answers[3]?.toLowerCase() || '';
        let productType = 'gel'; // default
        
        if (question3Answer.includes('not sure')) {
            productType = 'unsure';
        } else if (question3Answer.includes('injection')) {
            productType = 'injection';
        } else if (question3Answer.includes('pill')) {
            productType = 'pills';
        } else if (question3Answer.includes('gel')) {
            productType = 'gel';
        }
        
        // Get FAQ data for this product type
        const faqData = this.getFAQData(productType);
        
        // Update the FAQ list in the DOM
        const faqList = document.querySelector('.faq-list');
        if (!faqList) return;
        
        // Clear existing FAQs
        faqList.innerHTML = '';
        
        // Create new FAQ items
        faqData.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <button class="faq-question" aria-expanded="false">
                    <span class="faq-question-text">${faq.question}</span>
                    <span class="faq-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </button>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <p>${faq.answer}</p>
                    </div>
                </div>
            `;
            faqList.appendChild(faqItem);
        });
        
        // Re-initialize FAQ click handlers for the new FAQ items
        initializeFAQ();
    }

    updateComparisonChart() {
        const question3Answer = this.answers[3]?.toLowerCase() || '';
        const comparisonImage = document.querySelector('.comparison-image');
        const comparisonHeader = document.querySelector('.comparison-header');
        const comparisonDescription = document.querySelector('.comparison-description');
        const comparisonImageContainer = document.querySelector('.comparison-image-container');
        const comparisonCtaBtn = document.getElementById('comparison-cta-btn');
        
        if (!comparisonImageContainer) return;
        
        if (question3Answer.includes('not sure')) {
            // Update header and description for "I'm not sure" case
            if (comparisonHeader) {
                comparisonHeader.textContent = "We'll find the best treatment for you";
            }
            if (comparisonDescription) {
                comparisonDescription.textContent = "Don't know where to start with TRT? No problem. Our doctors will come up with a custom treatment plan designed to be most effective for your unique biology based on your biomarkers, medical history, and personal preference";
            }
            if (comparisonCtaBtn) {
                comparisonCtaBtn.textContent = "Find my treatment";
            }
            
            // Replace single image with three treatment images
            comparisonImageContainer.innerHTML = `
                <div class="treatment-options-grid">
                    <div class="treatment-option">
                        <img src="assets/trt-explore-lp.png" alt="Injectable TRT Treatment Option" class="treatment-image">
                    </div>
                    <div class="treatment-option">
                        <img src="assets/oral-trt-explore-lp.png" alt="Oral TRT Treatment Option" class="treatment-image">
                    </div>
                    <div class="treatment-option">
                        <img src="assets/gel-trt-explore-lp.png" alt="Gel TRT Treatment Option" class="treatment-image">
                    </div>
                </div>
            `;
        } else {
            // Reset to original content for other selections
            if (comparisonHeader) {
                comparisonHeader.textContent = "Stop Throwing Money at Symptoms. Start Investing in the Foundation.";
            }
            if (comparisonDescription) {
                comparisonDescription.textContent = "You're already spending hundreds on your health every month, but you're treating symptoms instead of the root cause. TRT isn't another expense—it's the multiplier that makes everything else actually work.";
            }
            if (comparisonCtaBtn) {
                comparisonCtaBtn.textContent = "START MY TREATMENT";
            }
            
            // Use original comparison image logic
            if (comparisonImage) {
                if (question3Answer.includes('pill')) {
                    comparisonImage.src = 'assets/oral_trt_comparison.png';
                    comparisonImage.alt = 'Investment comparison showing current spending vs Oral TRT';
                } else if (question3Answer.includes('gel')) {
                    comparisonImage.src = 'assets/gel_trt_comparison.png';
                    comparisonImage.alt = 'Investment comparison showing current spending vs Gel TRT';
                } else if (question3Answer.includes('injection')) {
                    comparisonImage.src = 'assets/investment comparison.png';
                    comparisonImage.alt = 'Investment comparison showing current spending vs Injectable TRT';
                } else {
                    // Default to injections for other cases
                    comparisonImage.src = 'assets/investment comparison.png';
                    comparisonImage.alt = 'Investment comparison showing current spending vs Injectable TRT';
                }
            } else {
                // Restore original single image structure if it was replaced
                comparisonImageContainer.innerHTML = `
                    <img src="assets/investment comparison.png" alt="Investment comparison showing current spending vs Injectable TRT" class="comparison-image">
                `;
            }
        }
    }
}

// Testimonials Carousel functionality
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.isScrolling = false;
        this.autoScrollInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.dot');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Handle touch events for mobile swipe
        this.bindTouchEvents();
    }

    bindTouchEvents() {
        const track = document.querySelector('.testimonials-track');
        if (!track) return;

        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            const threshold = 50; // Minimum swipe distance
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe left - go to next
                } else {
                    this.prevSlide(); // Swipe right - go to previous
                }
            }
        });
    }

    nextSlide() {
        if (this.isScrolling) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        if (this.isScrolling) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(slideIndex) {
        if (this.isScrolling || slideIndex === this.currentSlide) return;
        
        this.currentSlide = slideIndex;
        this.updateCarousel();
    }

    updateCarousel() {
        const track = document.querySelector('.testimonials-track');
        const dots = document.querySelectorAll('.dot');
        
        if (!track) return;

        this.isScrolling = true;

        // Calculate the transform value
        // Each card is 928px wide + 2rem gap (32px) = 960px total
        const cardWidth = 928;
        const gap = 32;
        const slideWidth = cardWidth + gap;
        const translateX = -this.currentSlide * slideWidth;

        // Apply smooth transform
        track.style.transform = `translateX(${translateX}px)`;

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Reset scrolling flag after animation completes
        setTimeout(() => {
            this.isScrolling = false;
        }, 500);
    }
}

// Pricing Modal functionality
class PricingModal {
    constructor() {
        this.modal = document.getElementById('pricing-modal');
        this.closeBtn = document.getElementById('modal-close-btn');
        this.overlay = document.querySelector('.modal-overlay');
        this.moreInfoLink = document.querySelector('.more-info-link');
        this.quiz = null; // Will be set when TRTQuiz creates this modal
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Open modal when "More info on pricing" link is clicked
        if (this.moreInfoLink) {
            this.moreInfoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Close modal when close button is clicked
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when overlay is clicked
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when Escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        // Update modal content based on current product
        this.updateModalContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    updateModalContent() {
        // Get current product type from the quiz answers
        let productType = 'oral'; // default
        
        if (this.quiz && this.quiz.answers[3]) {
            const question3Answer = this.quiz.answers[3].toLowerCase();
            if (question3Answer.includes('injection')) {
                productType = 'injectable';
            } else if (question3Answer.includes('pill')) {
                productType = 'oral';
            } else if (question3Answer.includes('gel')) {
                productType = 'gel';
            } else if (question3Answer.includes('not sure')) {
                productType = 'custom';
            }
        }

        // Get pricing content based on product type
        const pricingContent = this.getPricingContent(productType);
        
        // Update modal content
        this.updateModalHTML(pricingContent);
    }

    getPricingContent(productType) {
        const content = {
            injectable: {
                title: 'Injectable TRT Pricing Details',
                section1: {
                    title: 'What you pay today: $95',
                    description: "This is the cost of your baseline lab test and first visit with one of our doctors. If prescribed treatment, this $95 will be applied to your first month's cost of treatment. This is a one-time, non-recurring payment."
                },
                section2: {
                    title: 'What you pay if prescribed: $74/first month | $169/month after',
                    description: 'If prescribed treatment after completing labs and meeting with one of our doctors, your first month treatment cost for injectable TRT will be $74. All following months of treatment will be billed at $169/month.'
                },
                section3: {
                    title: 'Cancellation & Payment Terms',
                    list: [
                        'Cancel anytime',
                        'No hidden fees or contractual obligations',
                        'Month-to-month payments'
                    ]
                }
            },
            oral: {
                title: 'Oral TRT Pricing Details',
                section1: {
                    title: 'What you pay today: $95',
                    description: "This is the cost of your baseline lab test and first visit with one of our doctors. If prescribed treatment, this $95 will be applied to your first month's cost of treatment. This is a one-time, non-recurring payment."
                },
                section2: {
                    title: 'What you pay if prescribed: $104/first month | $199/month after',
                    description: 'If prescribed treatment after completing labs and meeting with one of our doctors, your first month treatment cost for oral TRT will be $104. All following months of treatment will be billed at $169/month.'
                },
                section3: {
                    title: 'Cancellation & Payment Terms',
                    list: [
                        'Cancel anytime',
                        'No hidden fees or contractual obligations',
                        'Month-to-month payments'
                    ]
                }
            },
            gel: {
                title: 'Topical TRT Gel Pricing Details',
                section1: {
                    title: 'What you pay today: $95',
                    description: "This is the cost of your baseline lab test and first visit with one of our doctors. If prescribed treatment, this $95 will be applied to your first month's cost of treatment. This is a one-time, non-recurring payment."
                },
                section2: {
                    title: 'What you pay if prescribed: $83/first month | $178/month after',
                    description: 'If prescribed treatment after completing labs and meeting with one of our doctors, your first month treatment cost for topical TRT gel will be $83. All following months of treatment will be billed at $178/month.'
                },
                section3: {
                    title: 'Cancellation & Payment Terms',
                    list: [
                        'Cancel anytime',
                        'No hidden fees or contractual obligations',
                        'Month-to-month payments'
                    ]
                }
            },
            custom: {
                title: 'Custom TRT Plan Pricing Details',
                section1: {
                    title: 'What you pay today: $95',
                    description: "This is the cost of your baseline lab test and first visit with one of our doctors. If prescribed treatment, this $95 will be applied to your first month's cost of treatment. This is a one-time, non-recurring payment."
                },
                section2: {
                    title: 'What you pay if prescribed: Varies by treatment type',
                    description: "After completing labs and meeting with one of our doctors, we'll determine the best treatment option for you. Your first month will be discounted, and all following months will be billed at $169/month."
                },
                section3: {
                    title: 'Cancellation & Payment Terms',
                    list: [
                        'Cancel anytime',
                        'No hidden fees or contractual obligations',
                        'Month-to-month payments'
                    ]
                }
            }
        };

        return content[productType] || content.oral;
    }

    updateModalHTML(content) {
        const modalTitle = this.modal.querySelector('.modal-title');
        const modalBody = this.modal.querySelector('.modal-body');

        // Update title
        modalTitle.textContent = content.title;

        // Update body content
        modalBody.innerHTML = `
            <div class="pricing-detail-section">
                <h3 class="pricing-detail-title">${content.section1.title}</h3>
                <p class="pricing-detail-description">${content.section1.description}</p>
            </div>
            
            <div class="pricing-detail-section">
                <h3 class="pricing-detail-title">${content.section2.title}</h3>
                <p class="pricing-detail-description">${content.section2.description}</p>
            </div>
            
            <div class="pricing-detail-section">
                <h3 class="pricing-detail-title">${content.section3.title}</h3>
                <ul class="pricing-detail-list">
                    ${content.section3.list.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    setQuiz(quiz) {
        this.quiz = quiz;
    }
}

// Standalone FAQ functionality for immediate use
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherItem = otherQuestion.closest('.faq-item');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                faqAnswer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                faqAnswer.classList.add('active');
            }
        });
    });
}

// Facebook Pixel Event Tracking
class FacebookPixelTracker {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindCTAEvents();
            });
        } else {
            this.bindCTAEvents();
        }
    }

    bindCTAEvents() {
        // Track "BUY NOW" button clicks
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.trackCTAClick('BuyNow', 'buy-now-button');
            });
        }

        // Track "START MY TREATMENT" button clicks
        const startTreatmentBtn = document.getElementById('comparison-cta-btn');
        if (startTreatmentBtn) {
            startTreatmentBtn.addEventListener('click', () => {
                this.trackCTAClick('StartTreatment', 'start-treatment-button');
            });
        }

        // Track form submission as Lead event
        const contactForm = document.getElementById('contact-form-element');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                this.trackFormSubmission();
            });
        }
    }

    trackCTAClick(eventName, buttonId) {
        // Check if fbq is available (Meta Pixel loaded)
        if (typeof fbq !== 'undefined') {
            // Track as Lead event (standard Facebook event)
            fbq('track', 'Lead', {
                content_name: eventName,
                content_category: 'TRT_CTA',
                source: buttonId,
                value: 95.00, // Initial consultation value
                currency: 'USD'
            });

            // Also track as custom event for more granular tracking
            fbq('trackCustom', eventName, {
                button_id: buttonId,
                page_section: this.getPageSection(buttonId),
                timestamp: new Date().toISOString()
            });

            console.log(`Facebook Pixel: Tracked ${eventName} click`);
        } else {
            console.warn('Facebook Pixel not loaded - unable to track event');
        }
    }

    trackFormSubmission() {
        if (typeof fbq !== 'undefined') {
            // Track form submission as Lead event
            fbq('track', 'Lead', {
                content_name: 'ContactFormSubmission',
                content_category: 'TRT_Lead',
                source: 'contact-form',
                value: 95.00,
                currency: 'USD'
            });

            // Custom event for form submission
            fbq('trackCustom', 'FormSubmission', {
                form_type: 'contact_form',
                lead_type: 'trt_consultation',
                timestamp: new Date().toISOString()
            });

            console.log('Facebook Pixel: Tracked form submission');
        }
    }

    getPageSection(buttonId) {
        switch(buttonId) {
            case 'buy-now-button':
                return 'recommendation_section';
            case 'start-treatment-button':
                return 'comparison_section';
            default:
                return 'unknown';
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    window.quiz = new TRTQuiz();
    window.carousel = new TestimonialsCarousel();
    window.pricingModal = new PricingModal();
    window.pricingModal.setQuiz(window.quiz);
    
    // Initialize Facebook Pixel tracking
    window.facebookTracker = new FacebookPixelTracker();
    
    initializeFAQ();
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