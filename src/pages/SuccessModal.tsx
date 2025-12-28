// Komponen modal animasi sukses, reusable untuk login & verifikasi
import React from 'react';

const modalStyle: React.CSSProperties = {
position: 'fixed',
top: 0, left: 0, right: 0, bottom: 0,
zIndex: 9999,
background: 'rgba(0,0,0,0.18)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
transition: 'opacity 0.3s',
};

const boxStyle: React.CSSProperties = {
background: '#fff',
borderRadius: 18,
boxShadow: '0 8px 32px rgba(74,124,35,0.13)',
minWidth: 260,
maxWidth: 340,
width: '90vw',
padding: '38px 28px 28px 28px',
textAlign: 'center',
position: 'relative',
animation: 'fadeInScale 0.5s cubic-bezier(.4,1.2,.6,1)',
};

const iconStyle: React.CSSProperties = {
fontSize: '3.2rem',
color: '#4caf50',
marginBottom: 18,
animation: 'popIn 0.6s cubic-bezier(.4,1.2,.6,1)',
};

const titleStyle: React.CSSProperties = {
fontWeight: 700,
fontSize: '1.35rem',
color: '#2d5016',
marginBottom: 8,
};

const subtitleStyle: React.CSSProperties = {
color: '#5a7c3c',
fontSize: '1rem',
marginBottom: 0,
};

export default function SuccessModal({
title,
subtitle,
}: {
title: string;
subtitle?: string;
}) {
return (
<div style={modalStyle}>
    <style>
    {`
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.92);}
        to { opacity: 1; transform: scale(1);}
    }
    @keyframes popIn {
        0% { transform: scale(0.7); opacity: 0.2;}
        60% { transform: scale(1.1); opacity: 1;}
        100% { transform: scale(1); opacity: 1;}
    }
    `}
    </style>
    <div style={boxStyle}>
    <div style={iconStyle}>
        <i className="bi bi-check-circle-fill"></i>
    </div>
    <div style={titleStyle}>{title}</div>
    {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
    </div>
</div>
);
}
