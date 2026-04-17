import { useState, useEffect } from 'react';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', zipCode: '' });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', { name, phone, addresses });
      updateUser(data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city) {
      toast.error('Please fill in street and city');
      return;
    }
    setAddresses(prev => [...prev, { ...newAddress, isDefault: prev.length === 0 }]);
    setNewAddress({ label: 'Home', street: '', city: '', state: '', zipCode: '' });
    setShowAddAddress(false);
  };

  const removeAddress = (index) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">My <span className="gradient-text">Profile</span></h1>

        {/* Profile Card */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-amber flex items-center justify-center shadow-glow">
              <span className="text-white font-heading font-bold text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-white font-heading font-bold text-2xl">{user?.name}</h2>
              <p className="text-dark-400">{user?.email}</p>
              <span className="badge-primary mt-1 capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editing}
                  className="input-field pl-12 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="email" value={user?.email} disabled className="input-field pl-12 disabled:opacity-50" />
              </div>
            </div>
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">Phone</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={!editing}
                  placeholder="Add phone number"
                  className="input-field pl-12 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {editing ? (
              <>
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name); setPhone(user?.phone); }} className="btn-secondary">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
                <HiOutlinePencil className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-heading font-semibold text-xl">Saved Addresses</h2>
            <button onClick={() => setShowAddAddress(true)} className="btn-secondary text-sm flex items-center gap-1">
              <HiOutlinePlus className="w-4 h-4" /> Add
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <HiOutlineLocationMarker className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No saved addresses</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr, i) => (
                <div key={i} className="flex items-start justify-between p-4 rounded-xl bg-dark-800/50 border border-white/[0.04]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HiOutlineLocationMarker className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{addr.label}</p>
                      <p className="text-dark-400 text-sm">{addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}</p>
                      {addr.isDefault && <span className="badge-primary text-[9px] mt-1">Default</span>}
                    </div>
                  </div>
                  {editing && (
                    <button onClick={() => removeAddress(i)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Address Form */}
          {showAddAddress && (
            <div className="mt-6 p-4 rounded-xl bg-dark-800/50 border border-white/[0.06] animate-slide-down">
              <h4 className="text-white font-medium mb-4">New Address</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  value={newAddress.label}
                  onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))}
                  className="input-field"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
                <input type="text" value={newAddress.street} onChange={e => setNewAddress(p => ({ ...p, street: e.target.value }))} placeholder="Street" className="input-field" />
                <input type="text" value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="City" className="input-field" />
                <input type="text" value={newAddress.zipCode} onChange={e => setNewAddress(p => ({ ...p, zipCode: e.target.value }))} placeholder="Zip Code" className="input-field" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddAddress} className="btn-primary text-sm">Add Address</button>
                <button onClick={() => setShowAddAddress(false)} className="btn-ghost text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
