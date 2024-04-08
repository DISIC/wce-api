import * as joi from 'joi';

export const configValidationSchema = joi.object({
  JMMC_URL: joi.string().uri().required(),
  COOKIE_SECRET: joi.string().required(),
  //AgentConnect
  AGENTCONNECT_CLIENTID: joi.string().required(),
  AGENTCONNECT_EXPIRESAFTER: joi.number().default(10),
  AGENTCONNECT_PROXYURL: joi.string().uri().required(),
  AGENTCONNECT_REDIRECT_URL: joi.string().uri().required(),
  AGENTCONNECT_SCOPE: joi.string().required().default('openid email'),
  AGENTCONNECT_SECRET: joi.string().required(),
  AGENTCONNECT_URL: joi.string().uri().required(),
  //config
  CONFIG_FILE: joi
    .string()
    .required()
    .default('/home/hkhait/webconf_config.json'),
  //email
  EMAIL_CONFERENCETOKENLENGTH: joi.number().required(),
  EMAIL_FROM: joi.string().required(),
  //   EMAIL_SMTP_AUTH_PASS: joi.string().allow(null).optional(),
  //   EMAIL_SMTP_AUTH_USER: joi.string().allow(null).optional(),
  EMAIL_SMTP_HOST: joi.string().required().default('localhost'),
  EMAIL_SMTP_POOL: joi.boolean().required(),
  EMAIL_SMTP_PORT: joi.number().required(),
  EMAIL_SMTP_SECURE: joi.boolean().required(),
  EMAIL_SMTP_TLS_REJECTUNAUTHORIZED: joi.boolean().required(),
  EMAIL_SUBJECT: joi.string().required(),
  EMAIL_TOKENEXPIRATIONINHOURS: joi.number().required(),
  //frontconf
  FRONTCONF_ROOMNAMECONSTRAINT_LENGTH: joi.number().required(),
  FRONTCONF_ROOMNAMECONSTRAINT_MINNUMBEROFDIGITS: joi.number().required(),
  //jitsi
  JITSI_JITSIJWT_AUD: joi.string().required(),
  JITSI_JITSIJWT_EXPIRESAFTER: joi.number().required(),
  JITSI_JITSIJWT_ISS: joi.string().required(),
  JITSI_JITSIJWT_SECRET: joi.string().required(),
  JITSI_JITSIJWT_SUB: joi.string().required(),
  //mongodb
  MONGO_URI: joi.string().required(),
  MONGODB_USENEWURLPARSER: joi.boolean(),
  MONGODB_USEUNIFIEDTOPOLOGY: joi.boolean(),
  //prosody
  PROSODY_AVAILABLE_INSTANCES: joi.string().required(),
  PROSODY_DOMAIN: joi.string().required(),
  REACT_APP_BASEURL: joi.string().required(),
  TITLE: joi.string().required(),
  TRUSTED_REVERSE_PROXIES: joi.string().required(),
  USERSFILTERINGMETHOD: joi.string().required(),
});
