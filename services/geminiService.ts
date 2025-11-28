import { GoogleGenAI, Tool } from "@google/genai";
import { SearchResult, Paper } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GENERATION_CONFIG_FLASH = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// Use Pro for complex reasoning tasks like comparison
const GENERATION_CONFIG_PRO = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

export const searchPapers = async (query: string): Promise<SearchResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Flash is good for search/grounding
    const tools: Tool[] = [{ googleSearch: {} }];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Find the latest academic papers, journals, or preprints related to: "${query}". 
      Focus on recent developments (2024-2025). 
      Provide a summary list of the top 3-5 papers found. 
      For each paper, clearly state the Title, Authors (if available), and a brief Abstract/Summary.`,
      config: {
        tools: tools,
        // No responseSchema allowed with googleSearch
      },
    });

    const text = response.text || "No results found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks: groundingChunks.map((chunk: any) => ({
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : undefined
      })).filter((c: any) => c.web)
    };

  } catch (error) {
    console.error("Search failed:", error);
    throw new Error("Failed to search for papers.");
  }
};

export const analyzePaper = async (paperText: string, specificFocus?: string): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      Analyze the following academic text/abstract. 
      ${specificFocus ? `Focus specifically on: ${specificFocus}` : 'Provide a structured summary including: Key Objectives, Methodology, Main Findings, and Implications.'}
      
      Additionally, include a section titled "## Key Contextual References" listing 3-5 foundational papers, prior works, or related studies that would be relevant citations for this topic (based on the context provided).
      
      Text:
      ${paperText.slice(0, 10000)}... (truncated for context window if needed)
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        ...GENERATION_CONFIG_FLASH,
        systemInstruction: "You are an expert academic researcher helping to summarize complex papers and identify connectivity between works.",
      }
    });

    return response.text || "Analysis could not be generated.";
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze paper.");
  }
};

export const comparePapers = async (paper1Title: string, paper1Text: string, paper2Title: string, paper2Text: string): Promise<string> => {
  try {
    // Use Pro model for better reasoning in comparison
    const modelId = "gemini-3-pro-preview"; 
    
    const prompt = `
      Compare and contrast the following two academic papers.
      Structure the comparison by:
      1. Research Objective Similarity/Difference
      2. Methodology Comparison
      3. Key Results Contrast
      4. Unique Contributions of each

      Paper 1: ${paper1Title}
      ${paper1Text.slice(0, 5000)}...

      Paper 2: ${paper2Title}
      ${paper2Text.slice(0, 5000)}...
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        ...GENERATION_CONFIG_PRO,
        systemInstruction: "You are a critical reviewer comparing two research documents.",
      }
    });

    return response.text || "Comparison could not be generated.";
  } catch (error) {
    console.error("Comparison failed:", error);
    throw new Error("Failed to compare papers.");
  }
};

export const generateCitationFormats = async (paper: Paper): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      Generate citation formats for the following academic paper in APA 7, MLA 9, and BibTeX formats.
      Return the output formatted as clear Markdown with headers for each format.
      
      Title: ${paper.title}
      Authors: ${paper.authors.join(', ')}
      Date: ${paper.date}
      Source: ${paper.source || 'Journal Article'}
      URL: ${paper.url || ''}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for deterministic formatting
      }
    });

    return response.text || "Could not generate citations.";
  } catch (error) {
    console.error("Citation generation failed:", error);
    return "Error generating citations.";
  }
};