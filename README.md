# TRT Quiz - Product Recommendation System

A sophisticated quiz application that collects user responses, calculates personalized product recommendations, and integrates with Customer.io for customer management and email automation.

## Data Flow

1. **User completes quiz** - 4-question assessment about health goals and TRT preferences
2. **JavaScript collects data** - Quiz answers, email/name, and calculated product recommendations
3. **POST to `/api/submit-quiz`** - Data sent to Vercel serverless function
4. **Vercel function processes** - Creates/updates customer in Customer.io with all quiz attributes and triggers segmentation events
5. **Customer.io automation** - Customer profiles updated, segments auto-assign, email flows trigger

## Project Structure

- `index.html` - Main HTML file with quiz questions and contact form
- `styles.css` - CSS styles for responsive quiz interface
- `script.js` - JavaScript quiz logic with API integration
- `api/submit-quiz.js` - Vercel serverless function for Customer.io integration
- `package.json` - Project configuration with Customer.io dependencies
- `vercel.json` - Vercel deployment configuration with API routes

## Environment Variables

Create a `.env` file in your Vercel project settings with the following variables:

```
CUSTOMERIO_SITE_ID=your_site_id_here
CUSTOMERIO_API_KEY=your_api_key_here
```

**To get these credentials:**
1. Log into your Customer.io account
2. Go to Account Settings > API Credentials
3. Copy your Site ID and API Key
4. Add them to your Vercel environment variables

## Development

1. Open `index.html` in your browser to view the quiz locally
2. For API testing, deploy to Vercel or use Vercel CLI for local development

## Deployment

1. Connect your repository to Vercel
2. Add the required environment variables in Vercel project settings
3. Deploy automatically - Vercel will handle the serverless functions

## Customer.io Integration Features

- **Customer Creation/Updates** - Automatically creates or updates customer profiles
- **Quiz Data Storage** - All quiz answers stored as customer attributes
- **Product Recommendations** - Intelligent recommendation engine based on responses
- **Event Tracking** - `quiz_completed` event triggered for segmentation
- **Email Automation** - Seamless integration with Customer.io email flows

## Product Recommendation Logic

The quiz analyzes user responses to recommend appropriate products:

- **TestoMax Pro** - For muscle building and physique goals
- **VitalBoost Energy** - For energy and libido restoration
- **Alpha Performance** - For confidence and overall performance
- **Complete Wellness Stack** - Comprehensive health optimization

Secondary recommendations based on TRT delivery preference (injections, pills, gel, consultation).

## Future Integrations

- **LegitScript Certification** - Add LegitScript cert JS snippet
- **Meta Pixel** - Implement Facebook/Meta Pixel tracking  
- **PostHog Integration** - Add analytics and user behavior tracking
- **LP Button Click Tracking** - Set up custom Facebook event tracking for campaigns 

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (Frontend)
- Vercel Serverless Functions (Backend)
- Customer.io API (Customer Management)
- Node.js (Runtime) 