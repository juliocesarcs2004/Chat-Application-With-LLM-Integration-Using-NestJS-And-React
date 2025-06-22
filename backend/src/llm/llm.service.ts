import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/genai';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-1.5-flash-latest';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_KEY');
    if (!apiKey) {
      this.logger.error('API_KEY for Gemini is not configured.');
      throw new InternalServerErrorException(
        'LLM service is not configured (API_KEY missing).',
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateReply(userMessage: string): Promise<string> {
    const systemInstruction =
      'You are an expert in front-end development best practices. Your primary goal is to provide accurate, helpful, and concise information related to this field. This includes topics like HTML, CSS, JavaScript, frameworks (React, Angular, Vue, Svelte, etc.), performance optimization, accessibility (a11y), responsive design, version control (Git), testing, build tools, package managers, browser compatibility, security, and modern web APIs. If a user asks a question outside of front-end development best practices, politely state that you can only discuss topics related to front-end development and try to gently guide them back if appropriate. Do not answer off-topic questions.';

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction,
      });

      const result = await model.generateContent(userMessage);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim() === '') {
        this.logger.warn(
          `Received empty or whitespace-only response from LLM for message: "${userMessage}"`,
        );
        return "I'm not sure how to respond to that. Could you try rephrasing?";
      }
      return text;
    } catch (error) {
      this.logger.error(`Error calling Gemini API: ${error.message}`, error.stack);
      if (error.message?.includes('API key not valid')) {
        throw new InternalServerErrorException(
          'LLM API key is invalid. Please check backend configuration.',
        );
      }
      throw new InternalServerErrorException(
        'Failed to get a response from the AI service.',
      );
    }
  }
}