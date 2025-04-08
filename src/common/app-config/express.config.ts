import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet, { HelmetOptions } from 'helmet';
import helmetCsp from 'helmet-csp';
import * as morgan from 'morgan';

export const ExpressSetup = (app: NestExpressApplication) => {
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.use(cookieParser());
  app.use(compression());

  // Use Helmet middleware for security headers
  const contentSecurityPolicy = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  };

  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable the default CSP middleware
    }),
  );
  // Use helmet-csp middleware for Content Security Policy
  app.use(helmetCsp(contentSecurityPolicy));

  const helmetConfig: HelmetOptions = {
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  };

  app.use(helmet(helmetConfig));

  //Secure cookies and other helmet-related configurations
  app.use(helmet.hidePoweredBy());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
};
