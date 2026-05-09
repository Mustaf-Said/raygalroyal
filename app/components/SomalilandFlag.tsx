// components/SomalilandFlag.tsx
export const SomalilandFlag = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    className={className}
    aria-label={title}
  >
    {/* Grön rand */}
    <rect width="900" height="200" fill="#007A3D" />
    {/* Vit rand i mitten */}
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    {/* Röd rand */}
    <rect y="400" width="900" height="200" fill="#CE1126" />

    {/* Svart stjärna i mitten */}
    <text x="450" y="320" textAnchor="middle" fontSize="180" fill="black">★</text>

    {/* Arabisk text i gröna delen */}
    <text x="450" y="150" textAnchor="middle" fontSize="80" fill="white" fontFamily="Arial">
      الله أكبر
    </text>
  </svg>
)