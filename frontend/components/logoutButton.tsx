"use client";

import { useAuth } from "@/context/authContext";
import React, { useState, useEffect, useRef } from "react";

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    style={{ width: "24px", height: "24px" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
// ---

export default function LogoutButton() {
  const { logout, role } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const displayRole = role ? role.replace("USER_", "") : "Invitado";

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "8px",
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "42px",
          height: "42px",
        }}
        title="Mi Perfil"
      >
        <ProfileIcon />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "10px",
            zIndex: 1010,
            backgroundColor: "white",
            color: "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden",
            width: "220px",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              color: "#6b7280",
              borderBottom: "1px solid #eee",
            }}
          >
            Cuenta:{" "}
            <span style={{ fontWeight: "bold", color: "#333" }}>
              {displayRole}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 16px",
              textAlign: "left",
              color: "#ef4444",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#fef2f2")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}