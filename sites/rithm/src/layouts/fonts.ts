// Self-hosted Nunito Sans (variable), Archivo and Space Grotesk — see fonts.css for why and how.
import './fonts.css';
import nunito from '../fonts/nunito-sans-latin-wght-normal.woff2?url';
import archivo900 from '../fonts/archivo-latin-900-normal.woff2?url';

/** Preloaded: the body font and the heading weight above the fold. */
export const preloadFonts = [nunito, archivo900];

/** Legal pages use only the body font. */
export const preloadFontsLegal = [nunito];
