"use client";
import React from "react";

export default function LogoSVG({ className = "h-[64px] w-auto md:h-[96px]" }) {
  return (
    <svg
      viewBox="0 0 520 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ND Boutique Logo"
      className={`${className} text-black`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

            .boutiqueText {
              font-family: 'Montserrat', sans-serif;
              font-weight: 700;
              font-size: 48px;
              letter-spacing: 0.15em;
              user-select: none;
              fill: currentColor;
            }

            @media (max-width: 640px) {
              .boutiqueText {
                font-size: 56px;
                letter-spacing: 0.12em;
              }
            }
          `}
        </style>
      </defs>

      {/* Classic simple filled D letter shape */}
      <path
        d="
          M360 90
          C440 90 480 170 480 260
          C480 350 440 430 360 430
          L280 430
          L280 90
          L360 90
          Z
        "
        fill="currentColor"
        stroke="none"
      />

      {/* Vertical bar of D filled black */}
      <rect x="270" y="90" width="20" height="340" fill="currentColor" />

      {/* N letter group */}
      <g transform="translate(80,70)">
        {/* Left vertical bar */}
        <rect x="0" y="40" width="22" height="260" fill="currentColor" />

        {/* Diagonal bar */}
        <path d="M22 40 L180 300 L148 300 L-10 40 Z" fill="currentColor" />

        {/* Right vertical bar */}
        <rect x="160" y="40" width="22" height="260" fill="currentColor" />
      </g>

      {/* BOUTIQUE text */}
      <text
        x="50%"
        y="490"
        textAnchor="middle"
        className="boutiqueText"
      >
        BOUTIQUE
      </text>
    </svg>
  );
}
