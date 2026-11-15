import React, { useRef, useState } from 'react';

export default function ArtCard({ product, onSelect }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`,
      boxShadow: '0 20px 35px -10px rgba(201, 168, 76, 0.25), 0 0 15px rgba(255,255,255,0.06)'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      boxShadow: 'none'
    });
  };

  return (
    <div className="mirror-card-container group cursor-pointer" onClick={() => onSelect(product)}>
      <div
        ref={cardRef}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="mirror-card-3d bg-[#141414] border border-[#2B2B30] group-hover:border-[#C9A84C]/60 rounded-xl overflow-hidden relative"
      >
        <div className="mirror-card-glare pointer-events-none absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative w-full aspect-square bg-[#0E0E0E] overflow-hidden p-6">
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0A0A0A]/80 backdrop-blur-md border border-[#C9A84C]/30 text-[11px] tracking-wider text-[#E8D48B] uppercase">
            {product.tag}
          </div>
        </div>

        <div className="p-5 bg-gradient-to-b from-[#141414] to-[#1A1A1A] border-t border-[#26262B]">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-['Cormorant_Garamond'] text-xl font-normal text-white group-hover:text-[#E8D48B] transition-colors">
              {product.title}
            </h3>
            <span className="font-['Cormorant_Garamond'] text-sm text-[#C9A84C]">
              {product.urduTitle}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            {product.mirrorPieces}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <span className="text-xs text-gray-500 block uppercase tracking-wider">Investment</span>
              <span className="text-sm font-semibold text-[#E8D48B]">PKR {product.pricePKR.toLocaleString()}</span>
              <span className="text-[11px] text-gray-400 font-mono ml-1">(${product.priceUSD})</span>
            </div>
            <button className="px-3 py-1.5 text-xs uppercase tracking-widest text-[#E8D48B] group-hover:bg-[#C9A84C]/20 border border-[#C9A84C]/40 rounded transition">
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
