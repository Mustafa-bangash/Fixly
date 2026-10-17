import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes.js';

// Emergency categories data matching the Fixly Prototype
const EMERGENCY_GUIDES = {
  elec: {
    id: 'elec',
    title: 'Electrical sparks or burning smell',
    service: 'Electrician',
    dos: [
      'Move everyone safely away from the sparking area or smell.',
      'Switch off the main electricity breaker only if it is completely dry and safe.',
      'Keep children and pets away from the room.',
      'If you see flames or smoke, evacuate the premises immediately and call 1122.',
    ],
    donts: [
      'Do NOT touch exposed wires, burning sockets, or wet surfaces.',
      'Do NOT throw water on an electrical fire under any circumstances.',
    ],
  },
  gas: {
    id: 'gas',
    title: 'Gas smell or leak',
    service: 'Appliance / Gas Technician',
    dos: [
      'Open all doors and windows immediately to ventilate the area.',
      'Turn off the main gas valve at the meter or cylinder if safe.',
      'Evacuate everyone outside into fresh air.',
      'Do not attempt to fix a leaking gas pipe or cylinder yourself.',
    ],
    donts: [
      'Do NOT turn any electrical light switches or appliances ON or OFF (sparks can ignite gas).',
      'Do NOT use matchsticks, lighters, or use mobile phones near the smell.',
    ],
  },
  water: {
    id: 'water',
    title: 'Flooding or water near electric wiring',
    service: 'Plumber',
    dos: [
      'Turn off the main water supply valve immediately.',
      'Turn off the main power switch ONLY if you can reach the switchboard without stepping in water.',
      'Move electronics and valuables to higher ground.',
    ],
    donts: [
      'Do NOT touch power plugs or electrical switches with wet hands.',
      'Do NOT walk through standing water if electric wires or cords are submerged.',
    ],
  },
};

export default function EmergencyPage() {
  const navigate = useNavigate();
  // Selected emergency type (defaults to electrical)
  const [selectedKey, setSelectedKey] = useState('elec');
  const activeGuide = EMERGENCY_GUIDES[selectedKey];

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard)}
          className="text-sm font-semibold text-muted hover:text-navy cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Header */}
      <div>
        <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-danger uppercase tracking-wider mb-2">
          Emergency Safety Protocol
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">
          Immediate Emergency Guidance
        </h1>
        <p className="mt-1 text-sm text-muted">
          Follow these critical safety steps before a technician arrives.
        </p>
      </div>

      {/* Red Alert Banner */}
      <div className="rounded-xl border-l-4 border-danger bg-red-50 p-4 sm:p-5">
        <h2 className="text-base font-bold text-danger flex items-center gap-2">
          <span>⚠️</span> Life Safety First
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-red-900 leading-relaxed">
          If there is active fire, heavy smoke, strong gas accumulation, or structural danger, 
          <strong> evacuate the building immediately</strong> and call emergency services (Rescue 1122).
        </p>
      </div>

      {/* Emergency Type Selector Tabs */}
      <div>
        <h3 className="text-sm font-bold text-navy mb-2">Select your emergency:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Object.values(EMERGENCY_GUIDES).map((guide) => (
            <button
              key={guide.id}
              type="button"
              onClick={() => setSelectedKey(guide.id)}
              className={`rounded-xl border p-3.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedKey === guide.id
                  ? 'border-danger bg-red-50 text-danger shadow-xs'
                  : 'border-line bg-white text-ink hover:border-slate-400'
              }`}
            >
              {guide.title}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Card: Do's and Don'ts */}
      <div className="rounded-xl border border-line bg-white p-6 shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-navy">
            {activeGuide.title}
          </h2>
          <p className="text-xs text-muted">Recommended technician: {activeGuide.service}</p>
        </div>

        {/* Immediate DO'S */}
        <div>
          <h3 className="text-sm font-bold text-green-700 flex items-center gap-1.5 mb-2.5">
            <span>✓</span> DO THIS NOW (Immediately)
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-ink font-medium">
            {activeGuide.dos.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 bg-green-50/60 p-2.5 rounded-lg border border-green-200">
                <span className="text-green-600 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical DONT'S */}
        <div>
          <h3 className="text-sm font-bold text-danger flex items-center gap-1.5 mb-2.5">
            <span>✕</span> DO NOT DO THIS (Strictly avoid)
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-ink font-medium">
            {activeGuide.donts.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 bg-red-50/60 p-2.5 rounded-lg border border-red-200">
                <span className="text-danger font-bold">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.requests)}
            className="flex-1 rounded-xl bg-danger py-3 text-center text-sm sm:text-base font-bold text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
          >
            Request Urgent {activeGuide.service} Help
          </button>
          <a
            href="tel:1122"
            className="rounded-xl border-2 border-slate-300 px-6 py-3 text-center text-sm font-bold text-navy hover:bg-navy-light transition-colors"
          >
            Call Rescue 1122
          </a>
        </div>
      </div>

    </div>
  );
}
