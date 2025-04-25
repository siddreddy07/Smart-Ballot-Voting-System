import jwt from 'jsonwebtoken';
import VerificationOfficer from '../models/verification_officer.model.js';
import User from '../models/voter.model.js';
import Candidate from '../models/candiatesmaster.model.js';
import BoothOfficer from '../models/boothofficer.model.js';

export const protectroute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in again.',
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decode);

    if (!decode || (!decode.PHN_NO && !decode.EMAIL)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token data.',
      });
    }

    let user = null;

    // If token has PHN_NO, it's a voter (from User table)
    if (decode.PHN_NO) {
      user = await User.findOne({
        where: { PHN_NO: decode.PHN_NO },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Voter not found.',
        });
      }

      req.userId = user.S_NO;
      req.user = user; // Optional: attach full user
    }

    // If token has EMAIL, check across VerificationOfficer, Candidate, BoothOfficer, and User
    if (decode.EMAIL) {
      const [vOfficer, candidate, bOfficer, userByEmail] = await Promise.all([
        VerificationOfficer.findOne({ where: { EMAIL: decode.EMAIL } }),
        Candidate.findOne({ where: { EMAIL: decode.EMAIL } }),
        BoothOfficer.findOne({ where: { OFFICER_EMAIL: decode.EMAIL } }),
        User.findOne({ where: { EMAIL: decode.EMAIL } }), // Added User check
      ]);

      user = vOfficer || candidate || bOfficer || userByEmail;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed. User not found.',
        });
      }

      // Set correct ID based on role
      req.userId =
        vOfficer?.SUPERVISOR_ID ||
        candidate?.CANDIDATE_ID ||
        bOfficer?.RFID_NO ||
        userByEmail?.S_NO; // Use S_NO for User

      req.user = user; // Optional: attach full user
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Token verification failed. Please log in again.',
    });
  }
};