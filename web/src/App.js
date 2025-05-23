import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ensure react-router-dom is installed
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

import AddVillageOfficerS from './Components/molecules/Pages/Secretary/AddVillageOfficerS/AddVillageOfficerS';
import AllowanceVillagerDetailsS from './Components/molecules/Pages/Secretary/AllowanceVillagerDetailsS/AllowanceVillagerDetailsS';
import ElectionVillagerDetailS from './Components/molecules/Pages/Secretary/ElectionVillagerDetailS/ElectionVillagerDetailS';
import IDCardVillagerDetailsS from './Components/molecules/Pages/Secretary/IDCardVillagerDetailsS/IDCardVillagerDetailsS';
import RemoveVillageOfficerS from './Components/molecules/Pages/Secretary/RemoveVillageOfficerS/RemoveVillageOfficerS';
import RequestsForAllowanceS from './Components/molecules/Pages/Secretary/RequestsForAllowanceS/RequestsForAllowanceS';
import RequestsForElectionListS from './Components/molecules/Pages/Secretary/RequestsForElectionListS/RequestsForElectionListS';
import VillageOfficers from './Components/molecules/Pages/Secretary/VillageOfficers/VillageOfficers';
import VillageOfficerProfile from './Components/molecules/Pages/VillageOfficer/VillageOfficerProfile/VillageOfficerProfile';
import RequestsForIDCardsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCardsVillagerDetails';
import RequestsForPermits from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermits';
import RequestsForPermitsVillagerDetails from './Components/molecules/Pages/VillageOfficer/RequestsForPermits/RequestsForPermitsVillagerDetails';


import AddVillagerOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/AddVillageOfficer';
import AddVillagers from './Components/molecules/Pages/VillageOfficer/AddVillagers/AddVillagers';
import AllowanceOwners from './Components/molecules/Pages/VillageOfficer/AllowanceOwner/AllowanceOwners';
import AllowanceVillagerDetails from './Components/molecules/Pages/VillageOfficer/AllowanceVillagerDetails/AllowanceVillagerDetails';
import CertificateVillagerDetails from './Components/molecules/Pages/VillageOfficer/CertificateVillagerDetails/CertificateVillagerDetails';
import ElectionVillagerDetails from './Components/molecules/Pages/VillageOfficer/ElectionVillagerDetails/ElectionVillagerDetails';
import Houses from './Components/molecules/Pages/VillageOfficer/Houses/Houses';
import IDCardVillagerDetails from './Components/molecules/Pages/VillageOfficer/IDCardVillagerDetails/IDCardVillagerDetails';
import PermitOwner from './Components/molecules/Pages/VillageOfficer/PermitOwners/PermitsOwner';

import RequestsForAllowance from './Components/molecules/Pages/VillageOfficer/RequestsForAllowance/RequestsForAllowance';
import RequestsForCertificate from './Components/molecules/Pages/VillageOfficer/RequestsForCertificate/RequestsForCertificate';
import RequestsForElectionList from './Components/molecules/Pages/VillageOfficer/RequestsForElectionList/RequestsForElectionList';
import RequestsForIDCards from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCards';
import VillageOfficerDashBoard from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/VillageOfficerDashBoard';
import SecretaryDashBoard from './Components/molecules/Pages/Secretary/SecretaryDashBoard/SecretaryDashBoard';
import SecretaryProfile from './Components/molecules/Pages/Secretary/SecretaryProfile/SecretaryProfile';
import DashboardLayout from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/DashboardLayout';
import Sidebar from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/Sidebar';
import DashboardLayoutS from './Components/molecules/Pages/Secretary/SecretaryDashBoard/DashboardLayoutS';


import Villagers from './Components/molecules/Pages/VillageOfficer/VillagersDetails/Villagers'
import EditVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/EditVillager';
import ViewVillager from './Components/molecules/Pages/VillageOfficer/VillagersDetails/ViewVillager';

function App() {
  return (
    <div className="App">
 
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/UserLogin" element={<UserLogin/>}/>
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route path="/UserDashboard" element={<UserDashboard/>}/>
        <Route path="/UserElection" element={<UserElection/>}/>
        <Route path="/UserElectionID" element={<UserElectionID/>}/>
        <Route path="/UserAllowances" element={<UserAllowances/>}/>
        <Route path="/UserAllowancesBC" element={<UserAllowancesBC/>}/>
        <Route path="/UserIDCard" element={<UserIDCard/>}/>
        <Route path="/UserIDCardBC" element={<UserIDCardBC/>}/>
        <Route path="/UserCertificatesBC" element={<UserCertificatesBC/>}/>
        <Route path="/UserCertificates" element={<UserCertificates/>}/>
        <Route path="/UserPermitsPR" element={< UserPermitsPR/>}/>
        <Route path="/UserPermits" element={<UserPermits/>}/>
        <Route path="/UserPermitsID" element={<UserPermitsID/>}/>
        <Route path="/UserProfile" element={<UserProfile/>}/>
        <Route path="/VillagerLocationSearch" element={<VillagerLocationSearch/>}/>
        <Route path="/FamilyDetails" element={<FamilyDetails/>}/>
        <Route path="/OfficeSupport" element={<OfficeSupport/>}/>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>

        <Route path="AboutUs" element={<AboutUs/>} />
        <Route path="ContactUs" element={<ContactUs/>} />
        

        <Route path="AddVillageOfficerS" element={<AddVillageOfficerS/>} />
        <Route path="AllowanceVillagerDetailsS" element={<AllowanceVillagerDetailsS/>} />
        <Route path="ElectionVillagerDetailS" element={<ElectionVillagerDetailS/>} />
        <Route path="IDCardVillagerDetailsS" element={<IDCardVillagerDetailsS/>} />
        <Route path="RemoveVillageOfficerS" element={<RemoveVillageOfficerS/>} />
        <Route path="RequestsForAllowanceS" element={<RequestsForAllowanceS/>} />
        <Route path="RequestsForElectionListS" element={<RequestsForElectionListS/>} />
        <Route path="VillageOfficers" element={<VillageOfficers/>} />

        <Route path="SecretaryDashBoard" element={<SecretaryDashBoard/>} />
        <Route path="/SecretaryProfile" element={<SecretaryProfile/>} />
      



        <Route path="AddVillagerOfficer" element={<AddVillagerOfficer/>} />
      
        <Route path="AllowanceOwners" element={<AllowanceOwners/>} />
        <Route path="AllowanceVillagerDetails" element={<AllowanceVillagerDetails/>} />
        <Route path="CertificateVillagerDetails" element={<CertificateVillagerDetails/>} />
        <Route path="ElectionVillagerDetails" element={<ElectionVillagerDetails/>} />
        <Route path="IDCardVillagerDetails" element={<IDCardVillagerDetails/>} />
      
        <Route path="RequestsForAllowance" element={<RequestsForAllowance/>} />
       
        <Route path="RequestsForElectionList" element={<RequestsForElectionList/>} />
        <Route path="RequestsForCertificate" element={<RequestsForCertificate/>} />
        <Route path="VillageOfficerDashBoard" element={<VillageOfficerDashBoard/>} />
       
   

   {/* Dashboard with nested routes */}
        <Route element={<DashboardLayout />}>
          {/* Nested pages inside dashboard */}
          <Route path="VillageOfficerDashBoard" element={<VillageOfficerDashBoard />} />
          <Route path="RequestsForElectionList" element={<RequestsForElectionList />} />
          <Route path="VillageOfficerProfile" element={<VillageOfficerProfile/>} />
          <Route path="Houses" element={<Houses/>} />
          <Route path="/requests-for-id-cards" element={<RequestsForIDCards />} />
          <Route path="/id-villager-details/:villagerId" element={<RequestsForIDCardsVillagerDetails />} /> 
          <Route path="/requests-for-permits" element={<RequestsForPermits />} />
          <Route path="/permit-villager-details/:villagerId" element={<RequestsForPermitsVillagerDetails />} />
          <Route path="/AddVillagers" element={<AddVillagers/>} /> 
           <Route path="/villagers" element={< Villagers />} />
           <Route path="/Villagers/Edit/:villagerId" element={<EditVillager />} />
         <Route path="/Villagers/View/:villagerId" element={<ViewVillager />} />
           <Route path="PermitOwner" element={<PermitOwner/>} />
          {/* add more nested routes here */}
        </Route>

        {/* Dashboard with nested routes */}
        <Route element={<DashboardLayoutS />}>
          {/* Nested pages inside dashboard */}
          <Route path="SecretaryDashBoard" element={<SecretaryDashBoard/>} />
          <Route path="/SecretaryProfile" element={<SecretaryProfile/>} />
          
          {/* add more nested routes here */}
        </Route>
        


        </Routes>
      </BrowserRouter>
    
    </div>
  );
} 

export default App;