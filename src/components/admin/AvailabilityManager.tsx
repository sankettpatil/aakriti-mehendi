import React, { useState } from 'react';
import { Save, Calendar as CalendarIcon, Clock, Plus, Trash2, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { AppCalendar } from '../ui/AppCalendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Rule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_gap_min: number;
  is_active: boolean;
}

interface Block {
  id: number;
  blocked_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

interface Props {
  initialRules: Rule[];
  initialBlocks: Block[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AvailabilityManager({ initialRules, initialBlocks }: Props) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  
  const [savingRules, setSavingRules] = useState(false);
  const [rulesSaved, setRulesSaved] = useState(false);
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState<Date | undefined>(new Date());
  const [newBlockReason, setNewBlockReason] = useState('');
  const [savingBlock, setSavingBlock] = useState(false);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm'; onConfirm?: () => void }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const handleRuleChange = (dayOfWeek: number, field: keyof Rule, value: any) => {
    setRules(prev => prev.map(rule => 
      rule.day_of_week === dayOfWeek ? { ...rule, [field]: value } : rule
    ));
    setRulesSaved(false);
  };

  const saveRules = async () => {
    setSavingRules(true);
    try {
      const res = await fetch('/api/admin/availability/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules })
      });
      if (res.ok) {
        setRulesSaved(true);
        setTimeout(() => setRulesSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save rules', error);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save rules', type: 'alert' });
    } finally {
      setSavingRules(false);
    }
  };

  const addBlock = async () => {
    if (!newBlockDate) return;
    setSavingBlock(true);
    try {
      const blocked_date = format(newBlockDate, 'yyyy-MM-dd');
      const res = await fetch('/api/admin/availability/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked_date, reason: newBlockReason })
      });
      
      if (res.ok) {
        const data = await res.json();
        setBlocks(prev => [...prev, data.block].sort((a, b) => a.blocked_date.localeCompare(b.blocked_date)));
        setShowBlockModal(false);
        setNewBlockReason('');
      }
    } catch (error) {
      console.error('Failed to add block', error);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to add block', type: 'alert' });
    } finally {
      setSavingBlock(false);
    }
  };

  const deleteBlock = async (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Remove Block?',
      message: 'Are you sure you want to remove this block? Customers will be able to book on this date again.',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/availability/blocks/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setBlocks(prev => prev.filter(b => b.id !== id));
          }
        } catch (error) {
          console.error('Failed to delete block', error);
        }
      }
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Weekly Schedule */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl tracking-tight text-gray-900">Weekly Schedule</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">Set your regular working hours.</p>
            </div>
            <button 
              onClick={saveRules}
              disabled={savingRules}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-md hover:bg-[#701B15] transition-colors disabled:opacity-70"
            >
              {savingRules ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
          
          <div className="p-6">
            {rulesSaved && (
              <div className="mb-6 p-3 bg-emerald-50 border border-success/20 rounded-md text-emerald-500 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Schedule saved successfully!
              </div>
            )}
            
            <div className="space-y-4">
              {DAYS.map((dayName, index) => {
                const rule = rules.find(r => r.day_of_week === index);
                if (!rule) return null;
                
                return (
                  <div key={index} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-md border transition-colors ${rule.is_active ? 'border-gray-200 bg-gray-50' : 'border-gray-200/50 bg-bg/20 opacity-60'}`}>
                    <div className="w-32 flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={rule.is_active}
                        onChange={(e) => handleRuleChange(index, 'is_active', e.target.checked)}
                        className="w-4 h-4 text-gray-900 rounded border-gray-200 focus:ring-gray-900 focus:ring-2"
                      />
                      <span className="font-medium text-gray-900">{dayName}</span>
                    </div>
                    
                    {rule.is_active ? (
                      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4 md:gap-4">
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            let currentSlots = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00"];
                            if (rule.specific_slots) {
                              try {
                                const parsed = JSON.parse(rule.specific_slots);
                                if (Array.isArray(parsed)) currentSlots = parsed;
                              } catch(e) {}
                            }
                            return currentSlots.map((time: string) => (
                              <div key={time} className="flex items-center gap-1 bg-gray-50 text-gray-900 text-[12px] font-medium px-2.5 py-1 rounded-md border border-gray-200">
                                {time}
                                <button
                                  onClick={() => {
                                    handleRuleChange(index, 'specific_slots', JSON.stringify(currentSlots.filter((t: string) => t !== time)));
                                  }}
                                  className="ml-1 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ));
                          })()}
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[12px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all w-24"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const timeStr = (e.target as HTMLInputElement).value;
                                  if (timeStr) {
                                    let currentSlots = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00"];
                                    if (rule.specific_slots) {
                                      try {
                                        const parsed = JSON.parse(rule.specific_slots);
                                        if (Array.isArray(parsed)) currentSlots = parsed;
                                      } catch(e) {}
                                    }
                                    if (!currentSlots.includes(timeStr)) {
                                      handleRuleChange(index, 'specific_slots', JSON.stringify([...currentSlots, timeStr].sort()));
                                    }
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider hidden sm:inline">Press Enter to add</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-sm text-gray-500">
                        Not taking bookings
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Date Blockers */}
      <div className="xl:w-[400px] space-y-6">
        <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl tracking-tight text-gray-900">Blocked Dates</h2>
            </div>
            <button 
              onClick={() => setShowBlockModal(true)}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Add Blocked Date"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-0 max-h-[600px] overflow-y-auto">
            {blocks.length > 0 ? (
              <div className="divide-y divide-[#FFDAD4]/30">
                {blocks.map(block => (
                  <div key={block.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between group">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{block.blocked_date}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{block.reason || 'No reason provided'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteBlock(block.id)}
                      className="p-2 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50"
                      title="Remove block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center mb-3">
                  <CalendarIcon className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-900">No blocked dates</p>
                <p className="text-xs text-gray-500 mt-1 text-balance">
                  You haven't blocked any specific dates. Customers can book according to your weekly schedule.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowBlockModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-md shadow-xl border border-gray-200 p-6 m-4 flex flex-col">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">Block a Date</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Select Date</label>
              <div className="border border-gray-200 rounded-md p-2 flex justify-center bg-bg w-full">
                <AppCalendar
                  mode="single"
                  selected={newBlockDate}
                  onSelect={setNewBlockDate}
                  disabled={[{ before: new Date() }]}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Reason (Optional)</label>
              <input
                type="text"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                placeholder="e.g. Vacation, Holiday"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addBlock}
                disabled={!newBlockDate || savingBlock}
                className="px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-md hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {savingBlock ? 'Blocking...' : 'Block Date'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Alert Dialog */}
      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => !open && closeAlert()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertConfig.type === 'confirm' && (
              <AlertDialogCancel onClick={closeAlert}>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={() => {
              if (alertConfig.onConfirm) alertConfig.onConfirm();
              closeAlert();
            }}>
              {alertConfig.type === 'confirm' ? 'Confirm' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Add this simple check circle icon component
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
