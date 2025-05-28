// src/Components/molecules/Pages/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            fullName: localStorage.getItem("fullName"),
            phoneNo: localStorage.getItem("phoneNo"),
            status: localStorage.getItem("status"),
            isParticipant: localStorage.getItem("isParticipant") === "true",
            aliveStatus: localStorage.getItem("aliveStatus"),
            role: decoded.role || localStorage.getItem("role"),
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);

  const login = (userData, token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("fullName", userData.fullName);
    localStorage.setItem("phoneNo", userData.phoneNo);
    localStorage.setItem("status", userData.status);
    localStorage.setItem("isParticipant", userData.isParticipant);
    localStorage.setItem("aliveStatus", userData.aliveStatus);
    localStorage.setItem("role", role);

    setUser({
      userId: userData.userId,
      email: userData.email,
      fullName: userData.fullName,
      phoneNo: userData.phoneNo,
      status: userData.status,
      isParticipant: userData.isParticipant,
      aliveStatus: userData.aliveStatus,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phoneNo");
    localStorage.removeItem("status");
    localStorage.removeItem("isParticipant");
    localStorage.removeItem("aliveStatus");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};