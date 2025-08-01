// src/services/ai.service.js - Frontend AI Service (Backend Only)
import { apiPost } from "./api";
import { API_ENDPOINTS } from "../utils/constants";

class AIService {
  constructor() {
    // Remove all OpenAI direct access from frontend
    // All AI operations should go through the backend
  }

  // Extract text from files using backend service only
  async extractTextFromFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiPost(API_ENDPOINTS.AI.EXTRACT_TEXT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for file processing
      });

      return response.data.text;
    } catch (error) {
      console.error("Text extraction failed:", error);
      throw new Error("Failed to extract text from file");
    }
  }

  // Parse resume using backend service only (NO direct OpenAI calls)
  async parseResumeViaBackend(file) {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiPost(API_ENDPOINTS.AI.PARSE_RESUME, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds to handle OpenAI processing time
      });

      console.log("Parsed Resume Response:", response.data);
      return this.processBackendResponse(response.data.data.parsedData);
    } catch (error) {
      console.error("Backend resume parsing failed:", error);

      if (error.code === "ECONNABORTED") {
        throw new Error(
          "Request timed out. Please try again with a smaller file."
        );
      }

      if (error.response?.status === 413) {
        throw new Error("File too large. Please use a smaller resume file.");
      }

      throw new Error("Failed to parse resume. Please try again.");
    }
  }

  // Main method to parse resume (only calls backend)
  async parseResume(file) {
    return this.parseResumeViaBackend(file);
  }

  // Process and validate backend response
  processBackendResponse(backendData) {
    try {
      // The backend already returns structured data, just validate it
      const processedData = {
        personalInfo: {
          name: backendData.personalInfo?.name || "",
          email: backendData.personalInfo?.email || "",
          phone: backendData.personalInfo?.phone || "",
          location: backendData.personalInfo?.location || "",
        },
        extractedSkills: Array.isArray(backendData.extractedSkills)
          ? backendData.extractedSkills.filter(
              (skill) => skill && typeof skill === "string" && skill.trim()
            )
          : [],
        workExperience: Array.isArray(backendData.workExperience)
          ? backendData.workExperience.map((exp) => ({
              title: exp.title || "",
              company: exp.company || "",
              duration: exp.duration || "",
              description: exp.description || "",
              achievements: Array.isArray(exp.achievements)
                ? exp.achievements
                : [],
            }))
          : [],
        education: Array.isArray(backendData.education)
          ? backendData.education.map((edu) => ({
              degree: edu.degree || "",
              institution: edu.institution || "",
              year: edu.year || "",
              gpa: edu.gpa || "",
            }))
          : [],
        certifications: Array.isArray(backendData.certifications)
          ? backendData.certifications.map((cert) => ({
              name: cert.name || "",
              issuer: cert.issuer || "",
              date: cert.date || "",
            }))
          : [],
        projects: Array.isArray(backendData.projects)
          ? backendData.projects.map((proj) => ({
              name: proj.name || "",
              description: proj.description || "",
              technologies: Array.isArray(proj.technologies)
                ? proj.technologies
                : [],
              duration: proj.duration || "",
            }))
          : [],
        languages: Array.isArray(backendData.languages)
          ? backendData.languages.map((lang) => ({
              language: lang.language || "",
              proficiency: lang.proficiency || "",
            }))
          : [],
      };

      // Remove empty entries
      processedData.workExperience = processedData.workExperience.filter(
        (exp) => exp.title || exp.company
      );
      processedData.education = processedData.education.filter(
        (edu) => edu.degree || edu.institution
      );
      processedData.certifications = processedData.certifications.filter(
        (cert) => cert.name
      );
      processedData.projects = processedData.projects.filter(
        (proj) => proj.name
      );
      processedData.languages = processedData.languages.filter(
        (lang) => lang.language
      );

      return processedData;
    } catch (error) {
      console.error("Error processing backend response:", error);
      throw new Error("Failed to process parsed resume data");
    }
  }

  // Enhance existing resume data with AI suggestions (backend only)
  async enhanceResumeData(existingData, targetJobDescription = "") {
    try {
      const response = await apiPost(
        API_ENDPOINTS.AI.ENHANCE_RESUME,
        {
          resumeData: existingData,
          targetJobDescription,
        },
        {
          timeout: 45000, // 45 seconds for enhancement
        }
      );

      return response.data.suggestions;
    } catch (error) {
      console.error("Resume enhancement failed:", error);
      throw new Error("Failed to enhance resume data");
    }
  }

  // Analyze job match (backend only)
  async analyzeJobMatch(resumeData, jobDescription) {
    try {
      const response = await apiPost(
        API_ENDPOINTS.AI.ANALYZE_JOB_MATCH,
        {
          resumeData,
          jobDescription,
        },
        {
          timeout: 45000, // 45 seconds for analysis
        }
      );

      return response.data.analysis;
    } catch (error) {
      console.error("Job match analysis failed:", error);
      throw new Error("Failed to analyze job match");
    }
  }

  // Check AI service status (backend only)
  async checkAIStatus() {
    try {
      const response = await apiPost(
        API_ENDPOINTS.AI.STATUS,
        {},
        {
          timeout: 10000, // 10 seconds for status check
        }
      );

      return response.data;
    } catch (error) {
      console.error("AI status check failed:", error);
      return {
        configured: false,
        status: "unavailable",
        error: error.message,
      };
    }
  }
}

export default new AIService();
