import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string): Promise<any> {
    try {
      console.log(
        'Tentative de récupération du profil LinkedIn avec le token:',
        accessToken,
      );

      const { data: userInfo } = await axios.get(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('Réponse LinkedIn userInfo:', userInfo);

      if (!userInfo) {
        throw new Error('Aucune donnée de profil reçue de LinkedIn');
      }

      const userData = {
        linkedinId: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
        lastName:
          userInfo.family_name ||
          userInfo.name?.split(' ').slice(1).join(' ') ||
          '',
        picture: userInfo.picture,
      };

      console.log('Données utilisateur structurées:', userData);

      if (!userData.email) {
        console.warn('Email manquant dans le profil LinkedIn');
      }

      return userData;
    } catch (error) {
      console.error('Erreur lors de la validation LinkedIn:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  }
}
