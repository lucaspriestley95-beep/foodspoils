import React from 'react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = 'h-5 w-5' }: CategoryIconProps) {
  const normalizedCategory = category.toLowerCase().trim();

  // Hand-crafted artistic, custom SVG icons for all 18 food categories
  switch (normalizedCategory) {
    case 'vegetables':
      // Artistic Broccoli/Carrot leaf hybrid icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 0-4 4c0 1.25.75 2.5 1.5 3.5C8.5 10 7.5 11 7 12.5c-.75 2-1 4.5-1 6.5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2c0-2-.25-4.5-1-6.5-.5-1.5-1.5-2.5-2.5-3 .75-1 1.5-2.25 1.5-3.5a4 4 0 0 0-4-4z" />
          <path d="M12 9V6" />
          <path d="M9 14.5c.5.5 1.5.5 2 0" />
          <path d="M13 17.5c.5.5 1.5.5 2 0" />
        </svg>
      );
    case 'fruits':
      // Artistic Apple with stem & leaf icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c4.97 0 9-3.582 9-8 0-4.97-3.03-8-9-8s-9 3.03-9 8c0 4.418 4.03 8 9 8z" />
          <path d="M12 6c.5-1.5 1.5-3 3-4" />
          <path d="M12 6c-.5-1.5-1.5-3-3-4" />
          <path d="M12 9a4 4 0 0 1-3-3" />
        </svg>
      );
    case 'dairy':
      // Artistic elegant Milk Bottle icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2h6v3H9z" />
          <path d="M9 5c0 1.5-1.5 3-1.5 5v10a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V10c0-2-1.5-3.5-1.5-5H9z" />
          <path d="M7.5 12h9" />
          <path d="M10 16a2 2 0 1 0 4 0" />
        </svg>
      );
    case 'meat':
      // Artistic elegant T-Bone Steak / Roast Joint icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3c-1.5 0-3.5 1-4.5 2.5C9.5 7 9 9 9 11c0 3 1.5 5.5 3.5 6.5C14 18.5 16 19 18 19c3.5 0 5-2 5-6 0-4-3-10-8-10z" />
          <path d="M10 11.5c-1 0-2.5-.5-3.5-1.5A7 7 0 0 1 3 5" />
          <path d="M13 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M17 14c-1.5-1.5-3.5-2-5-1.5" />
        </svg>
      );
    case 'seafood':
      // Artistic minimal Fish icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c4-6 13-6 16 0-3 6-12 6-16 0z" />
          <path d="M18 12l4 4V8l-4 4z" />
          <path d="M14 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M6.5 12h4" />
        </svg>
      );
    case 'deli':
      // Artistic Sandwich/Panini with diagonal cut icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1z" />
          <path d="M3 11h18" />
          <path d="M3 15h18" />
          <path d="M7 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
          <path d="M11 11v4" />
          <path d="M15 11v4" />
        </svg>
      );
    case 'grains':
    case 'grains-bakery':
      // Artistic Wheat/Ear of Grain icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V10" />
          <path d="M12 10c-1.5-1-3-1-3.5.5-.5 1.5.5 3 2 4M12 10c1.5-1 3-1 3.5.5.5 1.5-.5 3-2 4" />
          <path d="M12 14c-1.5-1-3-1-3.5.5-.5 1.5.5 3 2 4M12 14c1.5-1 3-1 3.5.5.5 1.5-.5 3-2 4" />
          <path d="M12 6c-1.5-1-2.5 0-3 1.5s.5 2.5 1.5 3M12 6c1.5-1 2.5 0 3 1.5s-.5 2.5-1.5 3" />
          <path d="M12 3a2 2 0 0 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      );
    case 'breakfast':
      // Artistic elegant Cereal Bowl and Spoon icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11c0 4.418 4.03 8 9 8s9-3.582 9-8H3z" />
          <path d="M6 19c0 1.5 2.5 2 6 2s6-.5 6-2" />
          <path d="M16 6l4-4M13 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      );
    case 'canned-goods':
      // Artistic hand-crafted Tin Can icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="6" ry="2.5" />
          <path d="M6 5v14c0 1.38 2.686 2.5 6 2.5s6-1.12 6-2.5V5" />
          <path d="M6 10c0 1.38 2.686 2.5 6 2.5s6-1.12 6-2.5" />
          <path d="M6 15c0 1.38 2.686 2.5 6 2.5s6-1.12 6-2.5" />
        </svg>
      );
    case 'sauces-oils':
      // Artistic Olive Oil / Sauce cruet bottle icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2h4v3h-4z" />
          <path d="M12 5c-1 0-3 1.5-3 4v11a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9c0-2.5-2-4-3-4z" />
          <path d="M9 13a4.5 4.5 0 0 0 6 0" />
          <path d="M6 9l3 1M18 9l-3 1" />
        </svg>
      );
    case 'spices-herbs':
      // Artistic Rosemary / Mint sprig icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V5" />
          <path d="M12 8c2-2 4-1 5 1s-1 4-5 3M12 12c-2-2-4-1-5 1s1 4 5 3" />
          <path d="M12 13c2-2 4-1 5 1s-1 4-5 3M12 17c-2-2-4-1-5 1s1 4 5 3" />
          <path d="M12 5C12 3 10 2 9 3s1 4 3 3z" />
        </svg>
      );
    case 'baking':
      // Artistic Croissant or Bundt Cake outline icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 0 0-9 9c0 1.5 1.5 2.5 3 2s2-2 3-3.5M12 3a9 9 0 0 1 9 9c0 1.5-1.5 2.5-3 2s-2-2-3-3.5" />
          <path d="M9 10.5C9 14 10.5 16 12 16s3-2 3-5.5" />
          <path d="M12 16v5" />
          <path d="M8 20h8" />
        </svg>
      );
    case 'international':
      // Artistic Chinese Lantern / Asian bowl icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="6" width="14" height="11" rx="4" />
          <path d="M12 2v4" />
          <path d="M12 17v5" />
          <path d="M8 6v11" />
          <path d="M16 6v11" />
          <path d="M5 11h14" />
        </svg>
      );
    case 'beverages':
      // Artistic Cup with Straw / Soda cup icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8H7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2L17 8z" />
          <path d="M6 8h12" />
          <path d="M15 8l2-6H9" />
        </svg>
      );
    case 'frozen':
      // Artistic Snowflake / Ice crystals icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
          <path d="M12 2l3 3M12 2L9 5M12 22l3-3M12 22l-3-3" />
          <path d="M2 12l3 3M2 12l3-3M22 12l-3 3M22 12l-3-3" />
          <path d="M12 7l4 4-4 4-4-4z" />
        </svg>
      );
    case 'snacks':
      // Artistic Pretzel outline icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c-2.5-2.5-4-5.5-4-8a4 4 0 1 1 8 0c0 2.5-1.5 5.5-4 8z" />
          <path d="M8 13c-2.5 0-4.5-2-4.5-4.5S6 4 8.5 4c2.5 0 3.5 2 3.5 4" />
          <path d="M16 13c2.5 0 4.5-2 4.5-4.5S18 4 15.5 4c-2.5 0-3.5 2-3.5 4" />
        </svg>
      );
    case 'pantry':
      // Artistic open Cardboard Box icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
          <path d="M3 7l9 5 9-5" />
          <path d="M12 22V12" />
          <path d="M12 12l-6-3.5M12 12l6-3.5" />
        </svg>
      );
    case 'other':
    default:
      // Artistic Clipboard with tag icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 2h6v4H9z" />
          <circle cx="12" cy="11" r="1.5" />
          <path d="M9 16h6" />
        </svg>
      );
  }
}
