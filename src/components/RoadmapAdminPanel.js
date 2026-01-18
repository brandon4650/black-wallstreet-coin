import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Unlock, Plus, Trash2, Save, Edit3, Check, 
  ChevronUp, ChevronDown, GripVertical, LogOut, AlertTriangle
} from 'lucide-react';

// Credentials
const ADMIN_USER = 'Tulsa2026_2025';
const ADMIN_PASS = 'BlackWallstreet2025_2026';

// Admin Panel Component
const RoadmapAdminPanel = ({ isOpen, onClose, roadmapData, onSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editableData, setEditableData] = useState([]);
  const [editingPhase, setEditingPhase] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Initialize editable data when panel opens
  useEffect(() => {
    if (isOpen && roadmapData) {
      // Create a clean copy without React elements (icons can't be serialized)
      const cleanData = roadmapData.map(phase => ({
        phase: phase.phase,
        title: phase.title,
        subtitle: phase.subtitle,
        items: phase.items.map(item => ({
          text: item.text,
          status: item.status
        }))
      }));
      setEditableData(cleanData);
      setHasChanges(false);
    }
  }, [isOpen, roadmapData]);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setEditingPhase(null);
  };

  // Update phase field
  const updatePhase = (phaseIndex, field, value) => {
    const updated = [...editableData];
    updated[phaseIndex][field] = value;
    setEditableData(updated);
    setHasChanges(true);
  };

  // Update phase item
  const updatePhaseItem = (phaseIndex, itemIndex, field, value) => {
    const updated = [...editableData];
    updated[phaseIndex].items[itemIndex][field] = value;
    setEditableData(updated);
    setHasChanges(true);
  };

  // Add new phase
  const addPhase = () => {
    const newPhase = {
      phase: `Phase ${editableData.length + 1}`,
      title: "New Phase",
      subtitle: "Description here",
      items: [
        { text: "New task item", status: 0 }
      ]
    };
    setEditableData([...editableData, newPhase]);
    setHasChanges(true);
    setEditingPhase(editableData.length);
  };

  // Delete phase
  const deletePhase = (index) => {
    const updated = editableData.filter((_, i) => i !== index);
    // Renumber remaining phases
    updated.forEach((phase, i) => {
      phase.phase = `Phase ${i + 1}`;
    });
    setEditableData(updated);
    setHasChanges(true);
    setShowDeleteConfirm(null);
    setEditingPhase(null);
  };

  // Add item to phase
  const addItem = (phaseIndex) => {
    const updated = [...editableData];
    updated[phaseIndex].items.push({ text: "New item", status: 0 });
    setEditableData(updated);
    setHasChanges(true);
  };

  // Delete item from phase
  const deleteItem = (phaseIndex, itemIndex) => {
    const updated = [...editableData];
    updated[phaseIndex].items = updated[phaseIndex].items.filter((_, i) => i !== itemIndex);
    setEditableData(updated);
    setHasChanges(true);
  };

  // Move phase up/down
  const movePhase = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editableData.length) return;
    
    const updated = [...editableData];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Renumber phases
    updated.forEach((phase, i) => {
      phase.phase = `Phase ${i + 1}`;
    });
    setEditableData(updated);
    setHasChanges(true);
  };

  // Toggle item status
  const toggleItemStatus = (phaseIndex, itemIndex) => {
    const updated = [...editableData];
    const currentStatus = updated[phaseIndex].items[itemIndex].status;
    updated[phaseIndex].items[itemIndex].status = currentStatus === 1 ? 0 : 1; // Toggle between complete and pending
    setEditableData(updated);
    setHasChanges(true);
  };

  // Save changes
  const handleSave = () => {
    onSave(editableData);
    setHasChanges(false);
  };

  // Close panel
  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        handleLogout();
      }
    } else {
      onClose();
      handleLogout();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              {isAuthenticated ? <Unlock className="h-5 w-5 text-amber-500" /> : <Lock className="h-5 w-5 text-amber-500" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Roadmap Admin Panel</h2>
              <p className="text-xs text-zinc-500">Manage phases and milestones</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && hasChanges && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-sm transition-colors"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-sm mx-auto py-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Admin Login</h3>
                <p className="text-zinc-400 text-sm">Enter your credentials to access the admin panel</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                    placeholder="Enter password"
                  />
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    {loginError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-lg font-bold transition-all"
                >
                  Login
                </button>
              </form>
            </div>
          ) : (
            /* Admin Editor */
            <div className="space-y-4">
              {/* Add Phase Button */}
              <div className="flex justify-end">
                <button
                  onClick={addPhase}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium text-sm transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add New Phase
                </button>
              </div>

              {/* Phase List */}
              {editableData.map((phase, phaseIndex) => (
                <div 
                  key={phaseIndex}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    editingPhase === phaseIndex 
                      ? 'border-amber-500 bg-zinc-800/50' 
                      : 'border-zinc-800 bg-zinc-800/30'
                  }`}
                >
                  {/* Phase Header */}
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => movePhase(phaseIndex, -1)}
                        disabled={phaseIndex === 0}
                        className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => movePhase(phaseIndex, 1)}
                        disabled={phaseIndex === editableData.length - 1}
                        className="p-1 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <GripVertical className="h-5 w-5 text-zinc-600" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                          {phase.phase}
                        </span>
                        <span className="font-bold text-white">{phase.title}</span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{phase.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPhase(editingPhase === phaseIndex ? null : phaseIndex)}
                        className={`p-2 rounded-lg transition-colors ${
                          editingPhase === phaseIndex 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-zinc-700 hover:bg-zinc-600'
                        }`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(phaseIndex)}
                        className="p-2 rounded-lg bg-zinc-700 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === phaseIndex && (
                    <div className="p-4 bg-red-500/10 border-t border-red-500/30 flex items-center justify-between">
                      <span className="text-red-400 text-sm">Delete this phase?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 bg-zinc-700 rounded text-sm hover:bg-zinc-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deletePhase(phaseIndex)}
                          className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Phase Editor */}
                  {editingPhase === phaseIndex && (
                    <div className="p-4 border-t border-zinc-700 space-y-4">
                      {/* Phase Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">Phase Title</label>
                          <input
                            type="text"
                            value={phase.title}
                            onChange={(e) => updatePhase(phaseIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={phase.subtitle}
                            onChange={(e) => updatePhase(phaseIndex, 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-zinc-400">Milestones</label>
                          <button
                            onClick={() => addItem(phaseIndex)}
                            className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
                          >
                            <Plus className="h-3 w-3" /> Add Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {phase.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <button
                                onClick={() => toggleItemStatus(phaseIndex, itemIndex)}
                                className={`p-1 rounded ${
                                  item.status === 1 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-zinc-700 text-zinc-400'
                                }`}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updatePhaseItem(phaseIndex, itemIndex, 'text', e.target.value)}
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-amber-500 outline-none"
                              />
                              <button
                                onClick={() => deleteItem(phaseIndex, itemIndex)}
                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {editableData.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <p>No phases yet. Click "Add New Phase" to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapAdminPanel;
