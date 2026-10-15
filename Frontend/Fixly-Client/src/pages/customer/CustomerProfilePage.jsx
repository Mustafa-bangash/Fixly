import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, clearUser } from '../../store/authSlice.js';
import { logoutUser } from '../../api/authApi.js';
import { ROUTES } from '../../utils/routes.js';

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // Form states for profile details
  const [fullName, setFullName] = useState(user?.fullName || 'Ahmed Khan');
  const [email, setEmail] = useState(user?.email || 'ahmed@example.com');
  const [phone] = useState(user?.phone || '0300 1234567');
  const [propertyType, setPropertyType] = useState('Residential'); // Residential or Commercial
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([
    'House 12, Street 4, Satellite Town, Rawalpindi',
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // Handle address addition
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    setSavedAddresses([...savedAddresses, newAddress.trim()]);
    setNewAddress('');
  };

  // Remove address
  const handleRemoveAddress = (index) => {
    setSavedAddresses(savedAddresses.filter((_, i) => i !== index));
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveMessage('Profile settings updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout
    }
    dispatch(clearUser());
    navigate(ROUTES.home);
  };

  return (
    <div className="mx-auto max-w-[680px] space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Customer Profile</h1>
        <p className="mt-1 text-sm text-muted">Manage your personal details, property type, and saved repair locations.</p>
      </div>

      {saveMessage && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-3.5 text-sm font-semibold text-green-800">
          ✓ {saveMessage}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-xl border border-line bg-white p-6 shadow-2xs space-y-5">
        
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">{fullName}</h2>
            <p className="text-xs text-muted">Customer Account · Verified</p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-navy uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
            required
          />
        </div>

        {/* Mobile Number (Read-only as per standard auth) */}
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
            Mobile Number
          </label>
          <input
            type="text"
            value={phone}
            disabled
            className="mt-1.5 w-full rounded-lg border border-line bg-gray-50 px-3.5 py-2.5 text-sm text-muted cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-navy uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
            required
          />
        </div>

        {/* Property Type Toggle */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
            Service Required For
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPropertyType('Residential')}
              className={`rounded-lg border p-3 text-center text-sm font-bold transition-all cursor-pointer ${
                propertyType === 'Residential'
                  ? 'border-brand bg-brand-light text-brand shadow-xs'
                  : 'border-line bg-white text-muted hover:border-slate-400'
              }`}
            >
              Residential (Home / Flat)
            </button>
            <button
              type="button"
              onClick={() => setPropertyType('Commercial')}
              className={`rounded-lg border p-3 text-center text-sm font-bold transition-all cursor-pointer ${
                propertyType === 'Commercial'
                  ? 'border-brand bg-brand-light text-brand shadow-xs'
                  : 'border-line bg-white text-muted hover:border-slate-400'
              }`}
            >
              Commercial (Shop / Office)
            </button>
          </div>
        </div>

        {/* Conditional Commercial Fields */}
        {propertyType === 'Commercial' && (
          <div className="space-y-4 rounded-lg bg-navy-light/40 p-4 border border-line">
            <div>
              <label htmlFor="bizName" className="block text-xs font-bold text-navy">Business / Office Name</label>
              <input
                id="bizName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Tech Rawalpindi"
                className="mt-1 w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-xs font-bold text-navy">Contact Person / Manager</label>
              <input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Office Manager"
                className="mt-1 w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* Saved Addresses Section */}
        <div className="pt-2 border-t border-line">
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
            Saved Addresses
          </label>
          <div className="space-y-2 mb-3">
            {savedAddresses.map((addr, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-line bg-page p-3 text-xs sm:text-sm text-ink">
                <span>📍 {addr}</span>
                {savedAddresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(idx)}
                    className="text-xs text-danger hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Add new address (e.g. Sector F-10/2, Islamabad)..."
              className="flex-1 rounded-lg border border-line px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={handleAddAddress}
              className="rounded-lg bg-navy px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#16406b] transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="pt-2 border-t border-line flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-navy">Repair Status Notifications</p>
            <p className="text-xs text-muted">Receive alerts when service providers send prices or arrive</p>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="h-5 w-5 accent-brand cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-brand py-3 text-center text-sm font-bold text-white hover:bg-[#1648a0] transition-colors cursor-pointer"
          >
            Save Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border-2 border-danger px-6 py-3 text-center text-sm font-bold text-danger hover:bg-danger hover:text-white transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>

      </form>
    </div>
  );
}
