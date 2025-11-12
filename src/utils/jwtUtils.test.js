import { describe, it, expect } from 'vitest';
import { decodeJWTToken, isTokenExpired, getCurrentUser } from './jwtUtils';

describe('JWT Utils', () => {
  it('should decode a valid JWT token', () => {
    // Sample JWT token (header.payload.signature)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const decoded = decodeJWTToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(1);
    expect(decoded.username).toBe('testUser');
  });

  it('should return null for invalid token', () => {
    const invalidToken = 'invalid.token.here';
    const decoded = decodeJWTToken(invalidToken);
    
    expect(decoded).toBeNull();
  });

  it('should return null for null or undefined token', () => {
    expect(decodeJWTToken(null)).toBeNull();
    expect(decodeJWTToken(undefined)).toBeNull();
    expect(decodeJWTToken('')).toBeNull();
  });
});