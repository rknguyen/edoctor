require('dotenv').config({ silent: true });

import jwt from 'jsonwebtoken';

export const signJWT = (userId: string): any => {
  return {
    signed_token: jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY as string)
  };
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
};
