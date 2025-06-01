import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importing all the components for the routes
// User Dashboard Imports
import Home from './Components/molecules/Pages/Home/Home';
import UserLogin from './Components/molecules/Pages/UserLogin/UserLogin';
import ForgotPassword from './Components/molecules/Pages/ForgotPassword/ForgotPassword';
import UserDashboard from './Components/molecules/Pages/User/UserDashboard/UserDashboard';
import UserProfile from './Components/molecules/Pages/User/UserProfile/UserProfile';
import VillagerLocationSearch from './Components/molecules/Pages/User/UserProfile/VillagerLocationSearch';
import FamilyDetails from './Components/molecules/Pages/User/UserFamilyDetails/FamilyDetails';
import OfficeSupport from './Components/molecules/Pages/OfficeSupport/OfficeSupport';
import PrivacyPolicy from './Components/molecules/Pages/PrivacyPolicy/PrivacyPolicy';
import AboutUs from './Components/molecules/Pages/AboutUs/AboutUs';
import ContactUs from './Components/molecules/Pages/Contact/Contact';

// User Election
import UserElection from './Components/molecules/Pages/User/UserElection/UserElection';
import UserElectionID from './Components/molecules/Pages/User/UserElection/UserElectionID';

// User Allowances
import UserAllowances from './Components/molecules/Pages/User/UserAllowances/UserAllowances';
import UserAllowancesBC from './Components/molecules/Pages/User/UserAllowances/UserAllowancesBC';

// User ID Card
import UserIDCard from './Components/molecules/Pages/User/UserIDCard/UserIDCard';
import UserIDCardBC from './Components/molecules/Pages/User/UserIDCard/UserIDCardBC';

// User Certificates
import UserCertificatesBC from './Components/molecules/Pages/User/UserCertificates/UserCertificatesBC';
import UserCertificates from './Components/molecules/Pages/User/UserCertificates/UserCertificates';

// User Permits
import UserPermitsID from './Components/molecules/Pages/User/UserPermits/UserPermitsID';
import UserPermitsPR from './Components/molecules/Pages/User/UserPermits/UserPermitsPR';
import UserPermits from './Components/molecules/Pages/User/UserPermits/UserPermits';




// Village Officer Dashboard Imports
// Village Officer Dashboard
import VillageOfficerDashBoard from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/VillageOfficerDashBoard';
import DashboardLayout from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/DashboardLayout';
import Notification from './Components/molecules/Pages/User/Notifications/Notification';
import VillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/VillagerOfficer';
import AddVillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/AddVillagerOfficer';
import EditVillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/EditVillagerOfficer';
import VillageOfficerProfile from './Components/molecules/Pages/VillageOfficer/VillageOfficerProfile/VillageOfficerProfile';

// Village Officer Villagers
import Villagers from './Components/molecules/Pages/VillageOfficer/VillagersDetails/Villagers';
import EditVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/EditVillager';
import ViewVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/ViewVillager';
import EligibleVoters from './Components/molecules/Pages/VillageOfficer/EligibleVoters/EligibleVoters';
import AddVillagers from './Components/molecules/Pages/VillageOfficer/AddVillagers/AddVillagers';
import Houses from './Components/molecules/Pages/VillageOfficer/Houses/Houses';

// Village Officer ID Card
import RequestsForIDCardsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCardsVillagerDetails';
//import IDCardVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/IDCardVillagerDetails';
import RequestsForIDCards from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCards';

// Village Officer Election
import RequestsForElections from './Components/molecules/Pages/VillageOfficer/RequestsForElections/RequestsForElections';
import RequestsForElectionsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForElections/RequestsForElectionsVillagerDetails';

// Village Officer Certificate
import EditableCertificate from './Components/molecules/Pages/VillageOfficer/Certificate/EditableCertificate';
import RequestsForCertificate from './Components/molecules/Pages/VillageOfficer/RequestsForCertificate/RequestsForCertificate';
import CertificateVillagerDetails from './Components/molecules/Pages/VillageOfficer/CertificateVillagerDetails/CertificateVillagerDetails';

// Village Officer Permits
import PermitsOwnerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/PermitsOwnerDetails';
import RequestsForPermits from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermits';
import RequestsForPermitsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermitsVillagerDetails';
import PermitOwner from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/PermitsOwner';

// Village Officer Allowances
import RequestsForAllowances from './Components/molecules/Pages/VillageOfficer/RequestsForAllowances/RequestsForAllowances';
import RequestsForAllowancesVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForAllowances/RequestsForAllowancesVillagerDetails';
import AllowanceOwners from './Components/molecules/Pages/VillageOfficer/RequestsForAllowances/AllowanceOwners';
import AllowanceOwnersDetails from './Components/molecules/Pages/VillageOfficer/RequestsForAllowances/AllowanceOwnersDetails';






// Secretary Dashboard Imports
// Secretary Dashboard
import DashboardLayoutS from './Components/molecules/Pages/Secretary/SecretaryDashBoard/DashboardLayoutS';
import SecretaryDashBoard from './Components/molecules/Pages/Secretary/SecretaryDashBoard/SecretaryDashBoard';

// Secretary Village Officer
import AddSecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/AddSecretaryVillagerOfficer';
import EditSecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/EditSecretaryVillagerOfficer';
import SecretaryVillagerOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/SecretaryVillagerOfficer';
import ViewVillageOfficer from './Components/molecules/Pages/Secretary/SecretaryVillageOfficerDetails/ViewVillageOfficer';
import SecretaryVillagers from './Components/molecules/Pages/Secretary/SecretaryVillagersDetails/SecretaryVillagers';
import SecretaryViewVillager from './Components/molecules/Pages/Secretary/SecretaryVillagersDetails/SecretaryViewVillager';

// Secretary Profile 
import SecretaryProfile from './Components/molecules/Pages/Secretary/SecretaryProfile/SecretaryProfile';

// Secretary Permit 
import SecretaryPermitApplications from './Components/molecules/Pages/Secretary/SecretaryPermitApplications/SecretaryPermitApplications';
import SecretaryPermitApplicationsVillagerView from './Components/molecules/Pages/Secretary/SecretaryPermitApplications/SecretaryPermitApplicationsVillagerView';
import SecretaryPermitsOwner from './Components/molecules/Pages/Secretary/SecretaryPermitApplications/SecretaryPermitsOwner';
import SecretaryPermitsOwnerView from './Components/molecules/Pages/Secretary/SecretaryPermitApplications/SecretaryPermitsOwnerView';

// Secretary NIC 
import SecretaryNICApplications from './Components/molecules/Pages/Secretary/SecretaryNICApplications/SecretaryNICApplications';
import SecretaryNICApplicationsVillagerView from './Components/molecules/Pages/Secretary/SecretaryNICApplications/SecretaryNICApplicationsVillagerView';

// Secretary Election 
import SecretaryElectionApplications from './Components/molecules/Pages/Secretary/SecretaryElectionApplications/SecretaryElectionApplications';
import  SecretaryElectionApplicationsVillagerView from './Components/molecules/Pages/Secretary/SecretaryElectionApplications/SecretaryElectionApplicationsVillagerView';
import SecretaryElectionOwnersView from './Components/molecules/Pages/Secretary/SecretaryElectionApplications/SecretaryElectionOwnersView';
import SecretaryElectionOwners from './Components/molecules/Pages/Secretary/SecretaryElectionApplications/SecretaryElectionOwners';
// Secretary Allowance 
import SecretaryAllowanceApplications from './Components/molecules/Pages/Secretary/SecretaryAllowanceApplications/SecretaryAllowanceApplications';
import SecretaryAllowanceOwnersView from './Components/molecules/Pages/Secretary/SecretaryAllowanceApplications/SecretaryAllowanceOwnersView';
import SecretaryAllowanceOwners from './Components/molecules/Pages/Secretary/SecretaryAllowanceApplications/SecretaryAllowanceOwners';
import SecretaryAllowanceApplicationsVillagerView from './Components/molecules/Pages/Secretary/SecretaryAllowanceApplications/SecretaryAllowanceApplicationsVillagerView';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes Home page  */}
          <Route path="/" element={<Home />} />

          {/* User Routes */}
          {/* User presonal details and others */}
          <Route path="/user_login" element={<UserLogin />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/family_details" element={<FamilyDetails />} />
          <Route path="/office_support" element={<OfficeSupport />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/contact_us" element={<ContactUs />} />
          <Route path="/villager_location_search" element={<VillagerLocationSearch />} />
          <Route path="/user_dashboard" element={<UserDashboard />} />

          {/* User election */}
          <Route path="/user_election" element={<UserElection />} />
          <Route path="/user_election_id" element={<UserElectionID />} />

          {/* User Allowances */}
          <Route path="/user_allowances" element={<UserAllowances />} />
          <Route path="/user_allowances_bc" element={<UserAllowancesBC />} />

          {/* User ID Card */}
          <Route path="/user_id_card" element={<UserIDCard />} />
          <Route path="/user_id_card_bc" element={<UserIDCardBC />} />

          {/* User Certificates */}
          <Route path="/user_certificates_bc" element={<UserCertificatesBC />} />
          <Route path="/user_certificates" element={<UserCertificates />} />

          {/* User Permits */}
          <Route path="/user_permits_pr" element={<UserPermitsPR />} />
          <Route path="/user_permits" element={<UserPermits />} />
          <Route path="/user_permits_id" element={<UserPermitsID />} />
         
          
          
         

          {/* Village Officer Dashboard with nested routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/VillageOfficerDashBoard" element={<VillageOfficerDashBoard />} />

            {/* Village Officer villagers action */}
            <Route path="/villagers_houses" element={<Houses />} />
            <Route path="/add_villagers" element={<AddVillagers />} />
            <Route path="/villagers" element={<Villagers />} />
            <Route path="/Villagers/Edit/:villagerId" element={<EditVillager />} />
            <Route path="/Villagers/View/:villagerId" element={<ViewVillager />} />
            <Route path="/eligible-voters" element={<EligibleVoters />} />

            {/* Village Officer */}
            <Route path="/Village_officer_profile" element={<VillageOfficerProfile />} />
            <Route path="/villager-officers" element={<VillagerOfficer />} />
            <Route path="/villager-officers/add" element={<AddVillagerOfficer />} />
            <Route path="/villager-officers/edit/:id" element={<EditVillagerOfficer />} />

            {/* Village Officer certificate */}
            <Route path="/requests_for_certificate" element={<RequestsForCertificate />} />
            <Route path="/certificate-villager-details/:villagerId" element={<CertificateVillagerDetails />} />

            {/* Village Officer permit */}
            <Route path="/permit_owner" element={<PermitOwner />} />
            <Route path="/requests-for-permits" element={<RequestsForPermits />} />
            <Route path="/permit-villager-details/:villagerId" element={<RequestsForPermitsVillagerDetails />} />
            <Route path="/permits_owner_details/:villagerId" element={<PermitsOwnerDetails />} />
            
            {/*villager officers nic */}
            <Route path="/requests-for-id-cards" element={<RequestsForIDCards />} />
            <Route path="/id-villager-details/:villagerId" element={<RequestsForIDCardsVillagerDetails />} />

            {/*villager officers election*/}
            <Route path="/election-villager-details/:villagerId" element={<RequestsForElectionsVillagerDetails />} />
            <Route path="/requests-for-elections" element={<RequestsForElections />} />

             {/*villager officers allowances*/}
            <Route path="/requests-for-allowances" element={<RequestsForAllowances />} /> 
            <Route path="/requests_for_allowances_villager_details/:villagerId" element={<RequestsForAllowancesVillagerDetails />} />
            <Route path="/allowances_owners" element={<AllowanceOwners />} /> 
            <Route path="/allowances_owners_details/:villagerId" element={<AllowanceOwnersDetails/>} />
            
          </Route>



          {/* Secretary Dashboard with nested routes */}
          <Route element={<DashboardLayoutS />}>
            <Route path="/SecretaryDashBoard" element={<SecretaryDashBoard />} />
           
            {/*secretary villager officers*/}
            <Route path="/secretary-villager-officers" element={<SecretaryVillagerOfficer />} />
            <Route path="/secretary-villager-officers/view/:id" element={<ViewVillageOfficer />} />
            <Route path="/secretary-villager-officers/add" element={<AddSecretaryVillagerOfficer />} />
            <Route path="/secretary-villager-officers/edit/:id" element={<EditSecretaryVillagerOfficer />} />
            <Route path="/secretary-villagers" element={<SecretaryVillagers />} />
            <Route path="/secretary-villagers/view/:id" element={<SecretaryViewVillager />} />

            {/*secretary profile*/}
            <Route path="/secretary-profile" element={< SecretaryProfile />} />

            {/* Secretary certificate */}
            <Route path="editable-certificate/:applicationId" element={<EditableCertificate/>} />
           

            {/* Secretary permit */}
            <Route path="/secretary_permit_applications" element={<SecretaryPermitApplications />} />
            <Route path="/secretary_permit_applications_villager_view/:id" element={<SecretaryPermitApplicationsVillagerView/>} />
            <Route path="/secretary_permits_owner" element={<SecretaryPermitsOwner />} /> 
            <Route path="/secretary_permits_owner_view/:id" element={<SecretaryPermitsOwnerView />} />

            {/* Secretary NIC */}
            <Route path="/secretary_nic_applications_villager_view/:id" element={<SecretaryNICApplicationsVillagerView />} />
            <Route path="/secretary_nic_applications" element={<SecretaryNICApplications />} /> 

            {/* Secretary Election  */}
            <Route path="/secretary_election_applications" element={<SecretaryElectionApplications/>} />
            <Route path="/secretary_election_owners" element={<SecretaryElectionOwners/>} />
            <Route path="/secretary_election_owners_view/:id" element={<SecretaryElectionOwnersView/>} />
            <Route path="/secretary_election_applications_villager_view/:id" element={<SecretaryElectionApplicationsVillagerView/>} />

             {/* Secretary Allowance  */}
            <Route path="/secretary_allowance_applications" element={<SecretaryAllowanceApplications/>} />
            <Route path="/secretary_allowance_owners_view/:id" element={<SecretaryAllowanceOwnersView/>} />
            <Route path="/secretary_allowance_applications_villager-view/:id" element={<SecretaryAllowanceApplicationsVillagerView/>} />
            <Route path="/secretary_allowance_owners" element={<SecretaryAllowanceOwners/>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;