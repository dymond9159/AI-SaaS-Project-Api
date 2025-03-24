
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwtSecret: process.env.JWT_SECRET || 'super-secret',
  jwtExpiresIn: '8h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
  jwtRefreshExpiresIn: '1d',
  mailFrom: process.env.MAIL_FROM || 'noreply@example.com',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
