import { createContext, useContext } from 'react';

const PrivacyContext = createContext(false);

export function usePrivacy() {
  return useContext(PrivacyContext);
}

export default PrivacyContext;
