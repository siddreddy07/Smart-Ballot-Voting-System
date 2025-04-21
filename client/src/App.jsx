import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import VoterIdPage from './pages/VoterIdPage';
import SignupPage from './pages/SignupPage';
import CentersPage from './pages/CentersPage';
import CandidatesPage from './pages/CandidatesPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import VerificationPage from './pages/VerificationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import {NewVoterRegistrationPage} from './pages/NewVoterRegistrationPage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import AdminPage from './pages/AdminPage';
import ZonalPage from './pages/ZonalPage';
import CenterPage from './pages/CenterPage';
import BoothPage from './pages/BoothPage';
import VoterRequestsPage from './pages/VoterRequestsPage';
import CandidateRegistrationPage from './pages/CandidateRegistrationPage';
import HigherOfficerPage from './pages/HigherOfficerPage';
import ZonalDistrictPage from './pages/ZonalDistrictPage';
import CenterIdPage from './pages/CenterIdPage';
import BoothIdPage from './pages/BoothIdPage';
import LoginPage from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboardPage';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import VerificationOfficerSignup from './pages/VerificationOfficerSIgnupPage';
import VerificationOfficerLogin from './pages/VerificationOfficerLoginPage';
import VerificationOfficerDashboard from './pages/VerificationDashboard';
import { useVerificationOfficer } from './context/VerificationOfficerContext';
import VerificationDashboard from './pages/tokensPage';
import BoothOfficerRegister from './pages/BoothOfficerRegisterPage';
import { useBoothOfficer } from './context/BoothOfficerContext';
import BoothOfficerDashboard from './pages/BoothOfficerDashboard';
import Demo from './pages/Demo';
import BoothOfficerLoginPage from './pages/BoothOfficerLoginPage';
import VoterVerificationAtBooth from './pages/VotersVeirifcationAtBooth';
import VotingApp from './pages/Voting_Phase';
import VotingEndScreen from './pages/Thank-you-Page';
import ResultsPage from './pages/ResultPage';
import CandidateTokenDetails from './pages/candidate_Tokenpage';

function App() {
  const {user,getUser} = useAuth()

  const {vuser} = useVerificationOfficer()

  const {bofficer} = useBoothOfficer()


  useEffect(()=>{
  },[user,vuser])

  return (
    <>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/voter-id" element={<VoterIdPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userdashboard/:id" element={<UserDashboard />} />
        {/* <Route path="/continue-registration" element={<ContinueRegisterPage/>} /> */}
        <Route path="/centers" element={<CentersPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/officer-dashboard" element={<OfficerDashboardPage />} />
        <Route path="/thank-you" element={<VotingEndScreen />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/registration/new/:userId" element={<NewVoterRegistrationPage />} />
        <Route path="/boothofficer-dashboard" element={<BoothOfficerDashboard />} />
        <Route path="/candidate/:token" element={<CandidateDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/zonal" element={<ZonalPage />} />
        <Route path="/center" element={<CenterPage />} />
        <Route path="/booth" element={<BoothPage />} />
        <Route path="/vofficer/register" element={<VerificationOfficerSignup />} />
        <Route path="/vofficer/login" element={<VerificationOfficerLogin />} />
        <Route path="/vofficer-dashboard" element={<VerificationOfficerDashboard />} />
        <Route path="/voter-requests" element={<VoterRequestsPage />} />
        <Route path="/voter-tokens" element={<VerificationDashboard />} />
        <Route path="/candidate/register" element={<CandidateRegistrationPage />} />
        <Route path="/higher-officer" element={<HigherOfficerPage />} />
        <Route path="/zonal/:district" element={<ZonalDistrictPage />} />
        <Route path="/center/:id" element={<CenterIdPage />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/result" element={<ResultsPage />} />
        <Route path="/booth/:id" element={<BoothIdPage />} />
        <Route path="/booth/:id" element={<BoothIdPage />} />
        <Route path="/candidate-token/:id" element={<CandidateTokenDetails />} />
        <Route path="/booth-officer/VotingPhase" element={<VotingApp />} />
        <Route path="/booth-officer/voter-verification" element={<VoterVerificationAtBooth />} />
        <Route path="/booth-officer/login" element={<BoothOfficerLoginPage />} />
        <Route path="/booth-officer/register" element={<BoothOfficerRegister />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
