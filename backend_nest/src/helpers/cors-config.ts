/**
 * CORS configuration for the application
 */

/**
 * List of allowed origins for development environment
 */
export const ALLOWED_ORIGINS_DEV = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',  // Vite default
  'http://127.0.0.1:5173',
  'http://localhost:8080',  // Another common dev port
  'http://127.0.0.1:8080'
];

/**
 * Gets the appropriate CORS origin configuration based on the environment
 * @returns The origin configuration for CORS
 */
export const getCorsOrigin = (): string | string[] => {
  // const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // if (isDevelopment) {
  //   return ALLOWED_ORIGINS_DEV;
  // } 
  
  // // For production, use comma-separated list from environment variable or default to empty array
  // if (process.env.ALLOWED_ORIGINS) {
  //   return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  // }
  
  // Fallback to the main frontend URL if defined

  if(!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not defined');
  }
      
  return process.env.FRONTEND_URL!;
}; 