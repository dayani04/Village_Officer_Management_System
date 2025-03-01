import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ensure react-router-dom is installed
import NavBar from './Components/molecules/NavBar/NavBar'; // Adjust the path if necessary
import Footer from  './Components/molecules/Footer/Footer';
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
import AboutUs from'./Components/molecules/Pages/AboutUs/AboutUs';
import ContactUs from './Components/molecules/Pages/Contact/Contact';
import AddVillagers from './Components/molecules/Pages/VillageOfficer/AddVillagers/AddVillagers';
import VillageOfficerDashBoard from './Components/molecules/Pages/VillageOfficer/VillageOfficerDashBoard/VillageOfficerDashBoard';
import SecretaryDashBoard from './Components/molecules/Pages/Secretary/SecretaryDashBoard/SecretaryDashBoard';
import AddVillageOfficer from './Components/molecules/Pages/VillageOfficer/AddVillageOfficer/AddVillageOfficer';
import RemoveVillager from './Components/molecules/Pages/VillageOfficer/RemoveVillager/RemoveVillager';
import Houses from './Components/molecules/Pages/VillageOfficer/Houses/Houses';
import PermitOwners from './Components/molecules/Pages/VillageOfficer/PermitOwners/PermitOwners';
import AllowanceOwners from './Components/molecules/Pages/VillageOfficer/AllowanceOwner/AllowanceOwners';
import RequestsForElectionList from './Components/molecules/Pages/VillageOfficer/RequestsForElectionList/RequestsForElectionList';
import ElectionVillagerDetails from './Components/molecules/Pages/VillageOfficer/ElectionVillagerDetails/ElectionVillagerDetails';
import RequestsForIDCards from './Components/molecules/Pages/VillageOfficer/RequestsForIDCards/RequestsForIDCards';
import IDCardVillagerDetails from './Components/molecules/Pages/VillageOfficer/IDCardVillagerDetails/IDCardVillagerDetails';
import RequestsForAllowance from './Components/molecules/Pages/VillageOfficer/RequestsForAllowance/RequestsForAllowance';
import RequestsForCertificate from './Components/molecules/Pages/VillageOfficer/RequestsForCertificate/RequestsForCertificate';
import CertificateVillagerDetails from './Components/molecules/Pages/VillageOfficer/CertificateVillagerDetails/CertificateVillagerDetails';

function App() {
  return (
    <div className="App">
      <NavBar />
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
        <Route path="/AboutUs" element={<AboutUs/>}/>
        <Route path="/ContactUs" element={<ContactUs/>}/>
        <Route path="/AddVillagers" element={<AddVillagers/>}/>
        <Route path="/VillageOfficerDashBoard" element={<VillageOfficerDashBoard/>}/>
        <Route path="/SecretaryDashBoard" element={<SecretaryDashBoard/>}/>
        <Route path="/AddVillageOfficer" element={<AddVillageOfficer/>}/>
        <Route path="/RemoveVillager" element={<RemoveVillager/>}/>
        <Route path="/Houses" element={<Houses/>}/>
        <Route path="/PermitOwners" element={<PermitOwners/>}/>
        <Route path="/AllowanceOwners" element={<AllowanceOwners/>}/>
        <Route path="/RequestsForElectionList" element={<RequestsForElectionList/>}/>
        <Route path="/ElectionVillagerDetails" element={<ElectionVillagerDetails/>}/>
        <Route path="/RequestsForIDCards" element={<RequestsForIDCards/>}/>
        <Route path="/IDCardVillagerDetails" element={<IDCardVillagerDetails/>}/>
        <Route path="/RequestsForCertificate" element={<RequestsForCertificate/>}/>
        <Route path="/RequestsForAllowance" element={<RequestsForAllowance/>}/>
        <Route path="/CertificateVillagerDetails" element={<CertificateVillagerDetails/>}/>

        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
} 

export default App;