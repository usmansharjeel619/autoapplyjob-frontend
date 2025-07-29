// src/services/ai.service.js
import { apiPost } from "./api";
import { API_ENDPOINTS } from "../utils/constants";

class AIService {
  constructor() {
    this.openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.openaiApiUrl = "https://api.openai.com/v1/chat/completions";
  }

  // Extract text from PDF files using a text extraction service
  async extractTextFromFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // First, extract text from the file using backend service
      const response = await apiPost(API_ENDPOINTS.AI.EXTRACT_TEXT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.text;
    } catch (error) {
      console.error("Text extraction failed:", error);
      throw new Error("Failed to extract text from file");
    }
  }

  // Parse resume using OpenAI GPT API
  async parseResumeWithOpenAI(fileText) {
    try {
      const prompt = `
Please analyze the following resume text and extract structured information in JSON format. 
Extract the following information:

1. Personal Information (name, email, phone, location if available)
2. Skills (technical skills, soft skills, programming languages, tools, frameworks)
3. Work Experience (job title, company, dates, description, achievements)
4. Education (degree, institution, graduation year, GPA if mentioned)
5. Certifications (certification name, issuing organization, date)
6. Projects (project name, description, technologies used)
7. Languages (spoken languages and proficiency levels)

Resume text:
${fileText}

Please return the data in this exact JSON structure:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "extractedSkills": [],
  "workExperience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "gpa": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],
  "languages": [
    {
      "language": "",
      "proficiency": ""
    }
  ]
}

Only return the JSON object, no additional text or explanations.
`;

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume parser. Extract information accurately and return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
        response_format: { type: "json_object" },
      };

      const response = await fetch(this.openaiApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const parsedContent = JSON.parse(data.choices[0].message.content);

      return this.processOpenAIResponse(parsedContent);
    } catch (error) {
      console.error("OpenAI parsing failed:", error);
      throw new Error("Failed to parse resume with AI");
    }
  }

  // Process and validate OpenAI response
  processOpenAIResponse(openaiResponse) {
    try {
      // Ensure all required fields exist with defaults
      const processedData = {
        personalInfo: {
          name: openaiResponse.personalInfo?.name || "",
          email: openaiResponse.personalInfo?.email || "",
          phone: openaiResponse.personalInfo?.phone || "",
          location: openaiResponse.personalInfo?.location || "",
        },
        extractedSkills: Array.isArray(openaiResponse.extractedSkills)
          ? openaiResponse.extractedSkills.filter(
              (skill) => skill && skill.trim()
            )
          : [],
        workExperience: Array.isArray(openaiResponse.workExperience)
          ? openaiResponse.workExperience.map((exp) => ({
              title: exp.title || "",
              company: exp.company || "",
              duration: exp.duration || "",
              description: exp.description || "",
              achievements: Array.isArray(exp.achievements)
                ? exp.achievements
                : [],
            }))
          : [],
        education: Array.isArray(openaiResponse.education)
          ? openaiResponse.education.map((edu) => ({
              degree: edu.degree || "",
              institution: edu.institution || "",
              year: edu.year || "",
              gpa: edu.gpa || "",
            }))
          : [],
        certifications: Array.isArray(openaiResponse.certifications)
          ? openaiResponse.certifications.map((cert) => ({
              name: cert.name || "",
              issuer: cert.issuer || "",
              date: cert.date || "",
            }))
          : [],
        projects: Array.isArray(openaiResponse.projects)
          ? openaiResponse.projects.map((proj) => ({
              name: proj.name || "",
              description: proj.description || "",
              technologies: Array.isArray(proj.technologies)
                ? proj.technologies
                : [],
            }))
          : [],
        languages: Array.isArray(openaiResponse.languages)
          ? openaiResponse.languages.map((lang) => ({
              language: lang.language || "",
              proficiency: lang.proficiency || "",
            }))
          : [],
      };

      return processedData;
    } catch (error) {
      console.error("Error processing OpenAI response:", error);
      throw new Error("Failed to process AI response");
    }
  }

  // Main method to parse resume
  async parseResume(file) {
    try {
      // Step 1: Extract text from file
      const fileText = await this.extractTextFromFile(file);

      if (!fileText || fileText.trim().length === 0) {
        throw new Error("No text could be extracted from the file");
      }

      // Step 2: Parse with OpenAI
      const parsedData = await this.parseResumeWithOpenAI(fileText);

      return parsedData;
    } catch (error) {
      console.error("Resume parsing failed:", error);
      throw error;
    }
  }

  // Alternative method using backend service for full parsing
  async parseResumeViaBackend(file) {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiPost(API_ENDPOINTS.AI.PARSE_RESUME, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return this.processOpenAIResponse(response.data.parsedData);
    } catch (error) {
      console.error("Backend resume parsing failed:", error);
      throw new Error("Failed to parse resume");
    }
  }

  // Enhance existing resume data with AI suggestions
  async enhanceResumeData(existingData, targetJobDescription = "") {
    try {
      const prompt = `
Based on the existing resume data and target job description, suggest improvements and additions.

Existing Resume Data:
${JSON.stringify(existingData, null, 2)}

Target Job Description:
${targetJobDescription}

Please suggest:
1. Missing skills that should be highlighted
2. Better ways to phrase experience descriptions
3. Additional keywords to include
4. Achievements that could be quantified

Return suggestions in JSON format:
{
  "suggestedSkills": [],
  "improvedDescriptions": {},
  "missingKeywords": [],
  "achievementSuggestions": []
}
`;

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer and career coach.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: "json_object" },
      };

      const response = await fetch(this.openaiApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("Resume enhancement failed:", error);
      throw new Error("Failed to enhance resume data");
    }
  }
}

export default new AIService();
