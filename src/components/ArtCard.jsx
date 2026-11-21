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

        <div className="relative w-full aspect-square bg-[#050505] overflow-hidden">
          {product.image ? (
            <picture>
              <source
                type="image/webp"
                srcSet={product.imageThumb ? `${product.imageThumb} 360w, ${product.image} 1200w` : `${product.image} 1200w`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <img
                src={product.imagePng || product.image}
                alt={product.imageAlt || product.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </picture>
          ) : (
            <div className="w-full h-full bg-[#0E0E0E]" />
          )}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#C9A84C]/35 text-[9.5px] tracking-wider text-[#E8D48B] uppercase font-medium shadow-sm">
            {product.tag || product.kind}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#070707] border-t border-[#1C1C20] flex flex-col justify-between">
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-[#C9A84C]">
              <span className="truncate pr-2 text-gray-400">{product.kind || product.category || 'Luxury Mirrorwork'}</span>
              <span className="font-nastaliq text-xs sm:text-sm text-[#E8D48B] flex-shrink-0">{product.urduTitle}</span>
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-medium text-white group-hover:text-[#E8D48B] transition-colors leading-snug min-h-[2.8rem] flex items-center">
              {product.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1.5 pt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
              <span className="truncate">{product.mirrorPieces}</span>
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#202025] gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 block uppercase tracking-widest leading-none mb-1">Investment</span>
              <div className="flex items-baseline flex-wrap gap-x-1.5">
                <span className="text-sm font-semibold text-[#E8D48B] whitespace-nowrap">PKR {product.pricePKR.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">(${product.priceUSD})</span>
              </div>
            </div>
            <button className="btn-luxury-sm !px-3 !py-1.5 whitespace-nowrap text-[10.5px] flex-shrink-0">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
