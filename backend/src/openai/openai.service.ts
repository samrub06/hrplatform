import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CVExtractedData } from '../cv/interfaces/cv-extracted-data.interface';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async convertCVData(text: string): Promise<CVExtractedData> {
    try {
      const prompt = `
      Analyse le texte du CV ci-dessous et extrait les informations selon la structure suivante :
  
      1. CV (Informations personnelles) :
         - name (string, obligatoire)
         - email (string)
         - phone (string)
         - location (string)
  
      2. CV Education (pour chaque formation) :
         - institution (string, obligatoire)
         - degree (string, obligatoire)
         - fieldOfStudy (string, obligatoire)
         - startDate (date, obligatoire, format: YYYY-MM-DD)
         - endDate (date, optionnel, format: YYYY-MM-DD)
         - description (text, optionnel)
  
      3. CV Skills (pour chaque compétence) :
         - name (string, obligatoire)
         - yearsOfExperience (number, obligatoire)
  
      Texte du CV :
      ${text}
  
      Réponds uniquement au format JSON suivant :
      {
        "personalInfo": {
          "name": "nom complet",
          "email": "email",
          "phone": "téléphone",
          "location": "localisation"
        },
        "education": [
          {
            "institution": "nom de l'école",
            "degree": "diplôme obtenu",
            "fieldOfStudy": "domaine d'étude",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "description": "description de la formation"
          }
        ],
        "skills": [
          {
            "name": "nom de la compétence",
            "yearsOfExperience": nombre_années
          }
        ]
      }
  
      Instructions spécifiques :
      - Les dates doivent être au format YYYY-MM-DD
      - yearsOfExperience doit être un nombre entier
      - Si une information est manquante, utilise null
      - Pour les compétences, essaie d'extraire le nombre d'années d'expérience à partir du contexte
      - Assure-toi que les noms des compétences correspondent aux technologies standard (ex: JavaScript, Python, etc.)
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = completion.choices[0].message.content;
      this.logger.debug(`OpenAI response: ${content}`);

      return JSON.parse(content);
    } catch (error) {
      this.logger.error("Erreur lors de l'extraction des informations:", error);
      throw new Error("Échec de l'extraction des informations du CV");
    }
  }
}
