import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    console.log('LinkedIn Strategy Initialization');
    console.log('Callback URL:', process.env.LINKEDIN_CALLBACK_URL);

    super({
      clientID: '7849cqrqoytm9c',
      clientSecret: 'WPL_AP1.9kBo24GdV2Kd7gnE.JFK2tQ==',
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      console.log('LinkedIn Profile:', profile);

      return {
        linkedinId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        picture: profile.photos?.[0]?.value,
      };
    } catch (error) {
      console.error('Erreur lors de la validation LinkedIn:', error);
      throw error;
    }
  }
}
