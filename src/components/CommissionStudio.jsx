import React, { useState, useMemo } from 'react';

export default function CommissionStudio({ onOpenInquiry }) {
  const [shape, setShape] = useState('calligraphy');
  const [size, setSize] = useState('medium');
  const [frame, setFrame] = useState('gold');

  const shapes = [
    { id: 'calligraphy', label: 'Arabic Calligraphy (خطاطی)', baseCost: 15000, mirrors: '1,000+' },
    { id: 'mandala', label: 'Sacred Mandala (منڈالا)', baseCost: 12000, mirrors: '800+' },
    { id: 'butterfly', label: 'Butterfly Silhouette (پروانہ)', baseCost: 10000, mirrors: '650+' },
    { id: 'heart', label: 'Shattered Heart (قلب)', baseCost: 9500, mirrors: '550+' },
    { id: 'geometric', label: 'Prism Geometry (ہندسی)', baseCost: 11000, mirrors: '750+' }
  ];

  const sizes = [
    { id: 'small', label: '12" x 12" Intimate', multiplier: 0.8 },
    { id: 'medium', label: '18" x 24" Standard Gallery', multiplier: 1.0 },
    { id: 'large', label: '24" x 36" Statement Piece', multiplier: 1.5 },
    { id: 'grand', label: '30" x 40" Grand Focal Canvas', multiplier: 2.2 }
  ];

  const frames = [
    { id: 'frameless', label: 'Stretched Deep Black Canvas (Frameless)', cost: 0 },
    { id: 'gold', label: 'Antique Gold Bevel Edge Accent', cost: 2500 },
    { id: 'shadowbox', label: 'Floating Obsidian Shadow Box Frame', cost: 4000 }
  ];

  const selectedShapeObj = shapes.find(s => s.id === shape);
  const selectedSizeObj = sizes.find(s => s.id === size);
  const selectedFrameObj = frames.find(f => f.id === frame) || frames[1];

  const estimatedTotal = useMemo(() => {
    const base = selectedShapeObj.baseCost * selectedSizeObj.multiplier;
    return Math.round(base + selectedFrameObj.cost);
  }, [shape, size, frame]);

  return (
    <section id="studio" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] block mb-2 font-medium">Interactive Art Atelier</span>
        <h2 className="text-3xl sm:text-4xl font-light font-['Cormorant_Garamond'] text-white shimmer-gold">
          Custom Commission Studio
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto my-3" />
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          Design your bespoke mirror canvas. Select your desired motif, dimensions, and framing to view an instant estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#141414] border border-[#2B2B32] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold">1. Choose Theme & Motif</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shapes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all ${shape === s.id ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white shadow-md' : 'border-[#26262B] bg-[#0E0E0E] text-gray-400 hover:border-gray-600'}`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Avg: {s.mirrors} Mirror Pieces</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold">2. Select Canvas Dimensions</label>
            <div className="grid grid-cols-2 gap-2.5">
              {sizes.map(sz => (
                <button
                  key={sz.id}
                  onClick={() => setSize(sz.id)}
                  className={`p-3 rounded-lg border text-xs text-center transition-all ${size === sz.id ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white' : 'border-[#26262B] bg-[#0E0E0E] text-gray-400 hover:border-gray-600'}`}
                >
                  <div className="font-medium">{sz.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-300 block mb-2 font-semibold">3. Select Framing & Edging</label>
            <div className="space-y-2">
              {frames.map(fr => (
                <button
                  key={fr.id}
                  onClick={() => setFrame(fr.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${frame === fr.id ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white' : 'border-[#26262B] bg-[#0E0E0E] text-gray-400 hover:border-gray-600'}`}
                >
                  <span>{fr.label}</span>
                  <span className="text-gray-500 text-[11px]">{fr.cost === 0 ? 'Included' : `+PKR ${fr.cost.toLocaleString()}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#2B2B32] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-['Cormorant_Garamond'] text-xl text-white">{selectedShapeObj.label}</h4>
            <p className="text-xs text-gray-400 mt-1">{selectedSizeObj.label} · Hand-cut mirror mosaic on obsidian canvas.</p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6">
            <span className="text-xs uppercase tracking-wider text-gray-500 block">Estimated Investment</span>
            <div className="flex items-baseline gap-2 mt-1 mb-4">
              <span className="text-2xl sm:text-3xl font-light font-['Cormorant_Garamond'] text-[#E8D48B]">
                PKR {estimatedTotal.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-mono">(~ ${Math.round(estimatedTotal / 278)} USD)</span>
            </div>
            <button
              onClick={() => onOpenInquiry({
                designType: selectedShapeObj.label,
                customSize: selectedSizeObj.label,
                budget: `PKR ${estimatedTotal.toLocaleString()}`
              })}
              className="w-full py-3 btn-gold rounded-lg text-xs tracking-widest uppercase shadow-lg flex items-center justify-center gap-2"
            >
              Book This Custom Piece
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
