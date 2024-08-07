const { OpenAI } = require('openai');
require('dotenv').config();

// Validate that the API key is set
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in the environment variables.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a diet plan based on user data.
 * @param {Object} data - The user data.
 * @param {number} data.weight - The user's weight.
 * @param {number} data.height - The user's height.
 * @param {number} data.age - The user's age.
 * @param {string} data.gender - The user's gender.
 * @param {string} data.favoriteFoods - The user's favorite foods.
 * @param {string} data.dislikedFoods - The user's disliked foods.
 * @returns {Promise<string>} The generated diet plan.
 */
async function generateDietPlan(data) {
  const { weight, height, age, gender, favoriteFoods, dislikedFoods } = data;

  // Basic validation
  if (!weight || !height || !age || !gender || !favoriteFoods || !dislikedFoods) {
    throw new Error('All fields are required: weight, height, age, gender, favoriteFoods, and dislikedFoods.');
  }

  const prompt = `
  Generate a diet plan for the following details:
  - Weight: ${weight}
  - Height: ${height}
  - Age: ${age}
  - Gender: ${gender}
  - Favorite Foods: ${favoriteFoods}
  - Disliked Foods: ${dislikedFoods}
  Make sure to generate the plan for a month sepecifying what to consume each day.
  Structure the response in this way:
  Day1: Specified Food,
  Day2: Specified Food,
  ...
  `;

  console.log("Generated prompt:", prompt);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
      console.log("Diet Plan:", chatCompletion.choices[0].message.content);
      return chatCompletion.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned from OpenAI API.');
    }
  } catch (error) {
    console.error("Error generating diet plan:", error.response ? error.response.data : error.message);
    throw new Error('Failed to generate diet plan. Please try again later.');
  }
}

module.exports = { generateDietPlan };
