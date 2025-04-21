import { AuthProvider } from "./context/AuthContext";
import { BoothOfficerProvider } from "./context/BoothOfficerContext";
import { CandidateContextProvider } from "./context/CandidateContext";
import { VerificationOfficerProvider } from "./context/VerificationOfficerContext";


export default function AllProviders({ children }) {
  return (
    <AuthProvider>
      <VerificationOfficerProvider>
        <CandidateContextProvider>
          <BoothOfficerProvider>
        {children}
        </BoothOfficerProvider>
        </CandidateContextProvider>
      </VerificationOfficerProvider>
    </AuthProvider>
  );
}
