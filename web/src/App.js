import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/molecules/Pages/Home/Home';
import UserLogin from './Components/molecules/Pages/UserLogin/UserLogin';
import ForgotPassword from './Components/molecules/Pages/ForgotPassword/ForgotPassword';
import UserDashboard from './Components/molecules/Pages/User/UserDashboard/UserDashboard';
import UserElection from './Components/molecules/Pages/User/UserElection/UserElection';
import UserElectionID from './Components/molecules/Pages/User/UserElection/UserElectionID';
import UserAllowances from './Components/molecules/Pages/User/UserAllowances/UserAllowances';
import UserAllowancesBC from './Components/molecules/Pages/User/UserAllowances/UserAllowancesBC';
import UserIDCard from './Components/molecules/Pages/User/UserIDCard/UserIDCard';
import UserIDCardBC from './Components/molecules/Pages/User/UserIDCard/UserIDCardBC';
import UserCertificatesBC from './Components/molecules/Pages/User/UserCertificates/UserCertificatesBC';
import UserCertificates from './Components/molecules/Pages/User/UserCertificates/UserCertificates';
import UserPermitsID from './Components/molecules/Pages/User/UserPermits/UserPermitsID';
import UserPermitsPR from './Components/molecules/Pages/User/UserPermits/UserPermitsPR';
import UserPermits from './Components/molecules/Pages/User/UserPermits/UserPermits';
import UserProfile from './Components/molecules/Pages/User/UserProfile/UserProfile';
import VillagerLocationSearch from './Components/molecules/Pages/User/UserProfile/VillagerLocationSearch';
import FamilyDetails from './Components/molecules/Pages/User/UserFamilyDetails/FamilyDetails';
import OfficeSupport from './Components/molecules/Pages/OfficeSupport/OfficeSupport';
import PrivacyPolicy from './Components/molecules/Pages/PrivacyPolicy/PrivacyPolicy';
import AboutUs from './Components/molecules/Pages/AboutUs/AboutUs';
import ContactUs from './Components/molecules/Pages/Contact/Contact';
import AllowanceVillagerDetailsS from './Components/molecules/Pages/Secretary/AllowanceVillagerDetailsS/AllowanceVillagerDetailsS';
import ElectionVillagerDetailS from './Components/molecules/Pages/Secretary/ElectionVillagerDetailS/ElectionVillagerDetailS';
import IDCardVillagerDetailsS from './Components/molecules/Pages/Secretary/IDCardVillagerDetailsS/IDCardVillagerDetailsS';
import RemoveVillageOfficerS from './Components/molecules/Pages/Secretary/RemoveVillageOfficerS/RemoveVillageOfficerS';
import RequestsForElectionListS from './Components/molecules/Pages/Secretary/RequestsForElectionListS/RequestsForElectionListS';
import VillageOfficers from './Components/molecules/Pages/Secretary/VillageOfficers/VillageOfficers';
import RequestsForIDCardsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCardsVillagerDetails';
import RequestsForPermits from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermits';
import RequestsForPermitsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermitsVillagerDetails';
import AddVillagers from './Components/molecules/Pages/VillageOfficer/AddVillagers/AddVillagers';
import AllowanceOwners from './Components/molecules/Pages/VillageOfficer/AllowanceOwner/AllowanceOwners';
import CertificateVillagerDetails from './Components/molecules/Pages/VillageOfficer/CertificateVillagerDetails/CertificateVillagerDetails';
import ElectionVillagerDetails from './Components/molecules/Pages/VillageOfficer/ElectionVillagerDetails/ElectionVillagerDetails';
import Houses from './Components/molecules/Pages/VillageOfficer/Houses/Houses';
import IDCardVillagerDetails from './Components/molecules/Pages/VillageOfficer/IDCardVillagerDetails/IDCardVillagerDetails';
import PermitOwner from './Components/molecules/Pages/VillageOfficer/PermitOwners/PermitsOwner';
import RequestsForCertificate from './Components/molecules/Pages/VillageOfficer/RequestsForCertificate/RequestsForCertificate';

import RequestsForIDCards from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCards';
import VillageOfficerDashBoard from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/VillageOfficerDashBoard';
import SecretaryDashBoard from './Components/molecules/Pages/Secretary/SecretaryDashBoard/SecretaryDashBoard';
import DashboardLayout from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/DashboardLayout';
import Sidebar from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/Sidebar';
import DashboardLayoutS from './Components/molecules/Pages/Secretary/SecretaryDashBoard/DashboardLayoutS';
import Villagers from './Components/molecules/Pages/VillageOfficer/VillagersDetails/Villagers';
import EditVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/EditVillager';
import ViewVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/ViewVillager';
import EligibleVoters from './Components/molecules/Pages/VillageOfficer/EligibleVoters/EligibleVoters';
import Notification from './Components/molecules/Pages/User/Notifications/Notification';
import VillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/VillagerOfficer';
import AddVillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/AddVillagerOfficer';
import EditVillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/EditVillagerOfficer';
import VillageOfficerProfile from './Components/molecules/Pages/VillageOfficer/VillageOfficerProfile/VillageOfficerProfile';
import AddSecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/AddSecretaryVillagerOfficer';
import EditSecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/EditSecretaryVillagerOfficer';
import SecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/SecretaryVillagerOfficer';
import ViewVillageOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/ViewVillageOfficer';
import SecretaryVillagers from './Components/molecules/Pages/Secretary/SecretaryVillagersDetails/SecretaryVillagers';
import SecretaryViewVillager from './Components/molecules/Pages/Secretary/SecretaryVillagersDetails/SecretaryViewVillager';
import SecretaryPermitApplications from './Components/molecules/Pages/Secretary/SecretaryPermitApplications/SecretaryPermitApplications';
import SecretaryNICApplications from './Components/molecules/Pages/Secretary/SecretaryNICApplications/SecretaryNICApplications';
import SecretaryPermitsOwner from './Components/molecules/Pages/Secretary/SecretaryPermitsOwner/SecretaryPermitsOwner';
import SecretaryPermitsOwnerView from './Components/molecules/Pages/Secretary/SecretaryPermitsOwner/SecretaryPermitsOwnerView';
import SecretaryProfile from './Components/molecules/Pages/Secretary/SecretaryProfile/SecretaryProfile';
import RequestsForElections from './Components/molecules/Pages/VillageOfficer/RequestsForElections/RequestsForElections';
import RequestsForElectionsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForElections/RequestsForElectionsVillagerDetails';
import SecretaryElectionOwners from './Components/molecules/Pages/Secretary/SecretaryElectionOwners/SecretaryElectionOwners';
import EditableCertificate from './Components/molecules/Pages/VillageOfficer/Certificate/EditableCertificate';
import RequestsForAllowances from './Components/molecules/Pages/VillageOfficer/RequestsForAllowances/RequestsForAllowances';
import AllowanceVillagerDetails from './Components/molecules/Pages/VillageOfficer/AllowanceVillagerDetails/AllowanceVillagerDetails';
import SecretaryAllowanceApplications from './Components/molecules/Pages/Secretary/SecretaryAllowanceApplications/SecretaryAllowanceApplications';
import SecretaryAllowanceOwnersView from './Components/molecules/Pages/Secretary/SecretaryAllowanceOwnersView/SecretaryAllowanceOwnersView';
import SecretaryAllowanceOwners from './Components/molecules/Pages/Secretary/SecretaryAllowanceOwners/SecretaryAllowanceOwners';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/UserElection" element={<UserElection />} />
          <Route path="/UserElectionID" element={<UserElectionID />} />
          <Route path="/UserAllowances" element={<UserAllowances />} />
          <Route path="/UserAllowancesBC" element={<UserAllowancesBC />} />
          <Route path="/UserIDCard" element={<UserIDCard />} />
          <Route path="/UserIDCardBC" element={<UserIDCardBC />} />
          <Route path="/UserCertificatesBC" element={<UserCertificatesBC />} />
          <Route path="/UserCertificates" element={<UserCertificates />} />
          <Route path="/UserPermitsPR" element={<UserPermitsPR />} />
          <Route path="/UserPermits" element={<UserPermits />} />
          <Route path="/UserPermitsID" element={<UserPermitsID />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/VillagerLocationSearch" element={<VillagerLocationSearch />} />
          <Route path="/FamilyDetails" element={<FamilyDetails />} />
          <Route path="/OfficeSupport" element={<OfficeSupport />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/AllowanceVillagerDetailsS" element={<AllowanceVillagerDetailsS />} />
          <Route path="/ElectionVillagerDetailS" element={<ElectionVillagerDetailS />} />
          <Route path="/IDCardVillagerDetailsS" element={<IDCardVillagerDetailsS />} />
          <Route path="/RemoveVillageOfficerS" element={<RemoveVillageOfficerS />} />
          <Route path="/VillageOfficers" element={<VillageOfficers />} />
          <Route path="/AllowanceOwners" element={<AllowanceOwners />} />
          <Route path="/AllowanceVillagerDetails" element={<AllowanceVillagerDetails />} />
          <Route path="/CertificateVillagerDetails" element={<CertificateVillagerDetails />} />
          <Route path="/ElectionVillagerDetails" element={<ElectionVillagerDetails />} />
          <Route path="/IDCardVillagerDetails" element={<IDCardVillagerDetails />} />
          
          <Route path="/RequestsForCertificate" element={<RequestsForCertificate />} />
          <Route path="/VillageOfficerDashBoard" element={<VillageOfficerDashBoard />} />

          {/* Village Officer Dashboard with nested routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/VillageOfficerDashBoard" element={<VillageOfficerDashBoard />} />
            <Route path="/Houses" element={<Houses />} />
            <Route path="/requests-for-id-cards" element={<RequestsForIDCards />} />
            <Route path="/id-villager-details/:villagerId" element={<RequestsForIDCardsVillagerDetails />} />
            <Route path="/requests-for-permits" element={<RequestsForPermits />} />
            <Route path="/permit-villager-details/:villagerId" element={<RequestsForPermitsVillagerDetails />} />
            <Route path="/AddVillagers" element={<AddVillagers />} />
            <Route path="/villagers" element={<Villagers />} />
            <Route path="/Villagers/Edit/:villagerId" element={<EditVillager />} />
            <Route path="/Villagers/View/:villagerId" element={<ViewVillager />} />
            <Route path="/PermitOwner" element={<PermitOwner />} />
            <Route path="/eligible-voters" element={<EligibleVoters />} />
            <Route path="/villager-officers" element={<VillagerOfficer />} />
            <Route path="/villager-officers/add" element={<AddVillagerOfficer />} />
            <Route path="/villager-officers/edit/:id" element={<EditVillagerOfficer />} />
            <Route path="/VillageOfficerProfile" element={<VillageOfficerProfile />} />
            
          </Route>

          {/* Secretary Dashboard with nested routes */}
          <Route element={<DashboardLayoutS />}>
            <Route path="/SecretaryDashBoard" element={<SecretaryDashBoard />} />
            <Route path="/secretary-villager-officers" element={<SecretaryVillagerOfficer />} />
            <Route path="/secretary-villager-officers/view/:id" element={<ViewVillageOfficer />} />
            <Route path="/secretary-villager-officers/add" element={<AddSecretaryVillagerOfficer />} />
            <Route path="/secretary-villager-officers/edit/:id" element={<EditSecretaryVillagerOfficer />} />
            <Route path="/secretary-villagers" element={<SecretaryVillagers />} />
            <Route path="/secretary-villagers/view/:id" element={<SecretaryViewVillager />} />
            <Route path="/SecretaryPermitApplications" element={<SecretaryPermitApplications />} />
            <Route path="/SecretaryNICApplications" element={<SecretaryNICApplications />} />
            <Route path="/SecretaryPermitsOwner" element={<SecretaryPermitsOwner />} /> 
            <Route path="/SecretaryPermitsOwnerView/:id" element={<SecretaryPermitsOwnerView />} />
            <Route path="/SecretaryProfile" element={< SecretaryProfile />} />

            <Route path="/requests-for-elections" element={<RequestsForElections />} />
            <Route path="/election-villager-details/:villagerId" element={<RequestsForElectionsVillagerDetails />} />
            <Route path="/SecretaryElectionOwners" element={<SecretaryElectionOwners/>} />
            <Route path="editable-certificate/:applicationId" element={<EditableCertificate/>} />
            <Route path="/certificate-villager-details/:villagerId" element={<CertificateVillagerDetails />} />
            <Route path="/RequestsForAllowances" element={<RequestsForAllowances />} />
            <Route path="/allowance-villager-details/:villagerId" element={<AllowanceVillagerDetails />} />
            <Route path="/SecretaryAllowanceApplications" element={<SecretaryAllowanceApplications />} />
            <Route path="/SecretaryAllowanceOwnersView" element={<SecretaryAllowanceOwnersView />} />
            <Route path="/SecretaryAllowanceOwners" element={<SecretaryAllowanceOwners />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;