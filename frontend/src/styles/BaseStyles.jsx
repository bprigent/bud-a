import { createGlobalStyle } from 'styled-components';

/** Base reset, font-face declarations, and root element layout. */
const BaseStyles = createGlobalStyle`
@font-face {
  font-family: 'General Sans';
  src: url('./assets/fonts/GeneralSans-Variable.ttf') format('truetype');
  font-weight: 200 700;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'General Sans';
  src: url('./assets/fonts/GeneralSans-VariableItalic.ttf') format('truetype');
  font-weight: 200 700;
  font-display: swap;
  font-style: italic;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  min-height: 100dvh;
  /* Scroll happens inside .page-main (per route), not on the document */
  overflow: hidden;
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  height: 100%;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
`;

export default BaseStyles;
