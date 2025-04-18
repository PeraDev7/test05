// This file is responsible for configuring and initializing the Anthropic API client
import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';

// Configuration for Anthropic API
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = 'claude-3-7-sonnet-20250219';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Function to generate website code based on user answers
export const generateWebsite = async (userAnswers) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API Key is missing");
    }

    // Construct the prompt for Claude
    const systemPrompt = `You are a professional web developer. Create a complete, modern website based on the user's requirements.
    The output should include valid HTML, CSS, and JavaScript in separate code blocks. 
    The website should be responsive, accessible, and follow best practices.
    Include comments to explain your code.`;

    // Format user answers into a coherent prompt
    let userPrompt = "Please create a website with the following specifications:\n\n";
    Object.entries(userAnswers).forEach(([question, answer]) => {
      userPrompt += `${question}: ${answer}\n`;
    });
    
    userPrompt += "\nPlease provide the complete HTML, CSS, and JavaScript code for this website.";

    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const content = response.content[0].text;
    return extractCodeFromResponse(content);
  } catch (error) {
    console.error('Error generating website:', error);
    throw error;
  }
};

// Helper function to extract code blocks from Claude's response
const extractCodeFromResponse = (content) => {
  // Parse the content to extract HTML, CSS, and JS code blocks
  const htmlRegex = /```html([\s\S]*?)```/;
  const cssRegex = /```css([\s\S]*?)```/;
  const jsRegex = /```javascript|```js([\s\S]*?)```/;

  const htmlMatch = content.match(htmlRegex);
  const cssMatch = content.match(cssRegex);
  const jsMatch = content.match(jsRegex);

  return {
    html: htmlMatch ? htmlMatch[1].trim() : '',
    css: cssMatch ? cssMatch[1].trim() : '',
    js: jsMatch ? jsMatch[1].trim() : ''
  };
};

export default {
  generateWebsite
};
