const { APIClient } = require('customerio-node');

// Initialize Customer.io client
const cio = new APIClient(process.env.CUSTOMERIO_SITE_ID, process.env.CUSTOMERIO_API_KEY);

// Product recommendation logic based on quiz answers
function calculateProductRecommendation(answers) {
    const recommendations = {
        primary: '',
        secondary: '',
        reasoning: ''
    };

    // Analyze answers to determine best product fit
    const answer3 = answers[3]?.toLowerCase() || '';

    // Product recommendation based on TRT form preference (Question 3 only)
    if (answer3.includes('injections')) {
        recommendations.primary = 'Injectable Support Kit';
        recommendations.reasoning = 'Optimized for injection-based TRT therapy';
        recommendations.secondary = 'Consultation Package';
    } else if (answer3.includes('pills')) {
        recommendations.primary = 'Oral Enhancement Formula';
        recommendations.reasoning = 'Designed for oral TRT administration';
        recommendations.secondary = 'Consultation Package';
    } else if (answer3.includes('gel')) {
        recommendations.primary = 'Topical Application System';
        recommendations.reasoning = 'Formulated for topical TRT application';
        recommendations.secondary = 'Consultation Package';
    } else if (answer3.includes('not sure')) {
        recommendations.primary = 'Custom Plan';
        recommendations.reasoning = 'Personalized approach to determine the best TRT method for your needs';
        recommendations.secondary = 'Comprehensive Consultation';
    } else {
        recommendations.primary = 'Consultation Package';
        recommendations.reasoning = 'Comprehensive consultation to determine best TRT approach';
        recommendations.secondary = 'Complete Wellness Stack';
    }

    return recommendations;
}

// Main API handler
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { answers, email, fullName } = req.body;

        // Validate required fields
        if (!answers || !email || !fullName) {
            return res.status(400).json({ 
                error: 'Missing required fields: answers, email, and fullName are required' 
            });
        }

        // Calculate product recommendation
        const recommendation = calculateProductRecommendation(answers);

        // Prepare Customer.io attributes
        const customerAttributes = {
            email: email,
            name: fullName,
            // Quiz answers
            quiz_answer_1: answers[1] || '',
            quiz_answer_2: answers[2] || '',
            quiz_answer_3: answers[3] || '',
            quiz_answer_4: answers[4] || '',
            // Recommendations
            primary_product_recommendation: recommendation.primary,
            secondary_product_recommendation: recommendation.secondary,
            recommendation_reasoning: recommendation.reasoning,
            // Metadata
            quiz_completed_at: new Date().toISOString(),
            quiz_version: '1.0',
            lead_source: 'trt_quiz'
        };

        // Create or update customer in Customer.io
        const customerId = email; // Using email as unique identifier
        
        await cio.identify(customerId, customerAttributes);

        // Trigger quiz completion event for segmentation
        await cio.track(customerId, {
            name: 'quiz_completed',
            data: {
                quiz_type: 'trt_assessment',
                primary_recommendation: recommendation.primary,
                secondary_recommendation: recommendation.secondary,
                total_questions: 4,
                completed_at: new Date().toISOString()
            }
        });

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully',
            recommendation: recommendation,
            customerId: customerId
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        
        // Send error response
        res.status(500).json({
            success: false,
            error: 'Failed to process quiz submission',
            details: error.message
        });
    }
} 