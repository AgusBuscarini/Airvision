// frontend/components/LogoutButton.tsx
"use client";

import { useAuth } from "@/context/authContext";

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <button
          onClick={logout}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '8px 12px',
            backgroundColor: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontSize: '14px'
          }}
        >
          Cerrar Sesión
        </button>
    );
}