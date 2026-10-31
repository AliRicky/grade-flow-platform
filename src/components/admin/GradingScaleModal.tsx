import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Check,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { GradingScale } from '../../types';
import {
  PRESET_GRADING_SCALES,
  calculateNumericGrade,
  normalizeGradingScale,
} from '../../utils/grading';

interface GradingScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradingScaleModal: React.FC<GradingScaleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { gradingScale, updateGradingScale } = useCourse();

  // Selected preset key or 'custom'
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    if (gradingScale.max_score === 9) return 'scale_9';
    if (gradingScale.max_score === 20) return 'scale_20';
    if (gradingScale.max_score === 100) return 'scale_100';
    if (gradingScale.max_score === 4) return 'scale_4';
    return 'custom';
  });

  const [customMax, setCustomMax] = useState<number>(() => gradingScale.max_score);
  const [customPass, setCustomPass] = useState<number>(() => gradingScale.passing_threshold);
  const [customPrecision, setCustomPrecision] = useState<number>(() => gradingScale.precision ?? 1);
  const [customLabel, setCustomLabel] = useState<string>(() => gradingScale.label || 'Custom Scale');
  const [isSaving, setIsSaving] = useState(false);

  // Compute the active preview scale based on current form inputs
  const activeDraftScale: GradingScale = React.useMemo(() => {
    if (selectedKey !== 'custom' && PRESET_GRADING_SCALES[selectedKey]) {
      return PRESET_GRADING_SCALES[selectedKey];
    }
    const max = Number(customMax) > 0 ? Number(customMax) : 10;
    const pass = Number(customPass) >= 0 ? Number(customPass) : max * 0.5;
    return normalizeGradingScale({
      type: 'numeric',
      max_score: max,
      passing_threshold: pass,
      precision: customPrecision,
      label: customLabel.trim() || `${max}-Point Custom Scale`,
    });
  }, [selectedKey, customMax, customPass, customPrecision, customLabel]);

  const handleSelectPreset = (key: string) => {
    setSelectedKey(key);
    const preset = PRESET_GRADING_SCALES[key];
    if (preset) {
      setCustomMax(preset.max_score);
      setCustomPass(preset.passing_threshold);
      setCustomPrecision(preset.precision ?? 1);
      setCustomLabel(preset.label || `${preset.max_score}-Point Scale`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGradingScale(activeDraftScale);
      onClose();
    } catch (err) {
      console.error('Failed to update grading scale:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview samples for the live tester
  const previewSamples = [
    { pct: 95, label: 'High Distinction' },
    { pct: 82, label: 'Strong Performance' },
    { pct: 65, label: 'Competent' },
    { pct: Math.round((activeDraftScale.passing_threshold / activeDraftScale.max_score) * 100), label: 'Exact Pass Threshold' },
    { pct: 35, label: 'Needs Remediation' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100">
                  Course Scoring & Grading Scale
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Configure the global scoring scale and passing criteria for this specific course.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                Standard Academic Scales
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(PRESET_GRADING_SCALES).map(([key, preset]) => {
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectPreset(key)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#3B82F6] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 ring-1 ring-[#3B82F6]'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {preset.label}
                          </div>
                          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Max: {preset.max_score}</span>
                            <span>·</span>
                            <span>Pass: {preset.passing_threshold}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Scale Card */}
                <button
                  type="button"
                  onClick={() => setSelectedKey('custom')}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    selectedKey === 'custom'
                      ? 'border-[#3B82F6] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 ring-1 ring-[#3B82F6]'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>Custom Numeric Scale</span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Arbitrary max score, threshold & decimals
                      </div>
                    </div>
                    {selectedKey === 'custom' && (
                      <div className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Parameters Form (Active when 'custom' is selected) */}
            {selectedKey === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Maximum Scale Score
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={customMax}
                      onChange={e => setCustomMax(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-3 text-xs font-mono font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                      placeholder="e.g. 20, 50, 100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Passing Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={customMax}
                      step="any"
                      value={customPass}
                      onChange={e => setCustomPass(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-3 text-xs font-mono font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                      placeholder="e.g. 10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Decimal Precision
                    </label>
                    <select
                      value={customPrecision}
                      onChange={e => setCustomPrecision(parseInt(e.target.value, 10))}
                      className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                    >
                      <option value={0}>0 Decimals (e.g. 85)</option>
                      <option value={1}>1 Decimal (e.g. 85.5)</option>
                      <option value={2}>2 Decimals (e.g. 85.50)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Custom Scale Label
                  </label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={e => setCustomLabel(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                    placeholder="e.g. 50-Point Midterm Scale"
                  />
                </div>
              </motion.div>
            )}

            {/* Live Conversion & Passing Assertion Preview */}
            <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <Info className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Real-Time Scale Transformation Preview</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  Formula: (Pct / 100) × {activeDraftScale.max_score}
                </span>
              </div>

              <div className="space-y-2">
                {previewSamples.map(sample => {
                  const result = calculateNumericGrade(sample.pct, activeDraftScale);
                  return (
                    <div
                      key={sample.pct}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 w-12 text-right">
                          {sample.pct}%
                        </span>
                        <span className="text-zinc-400">→</span>
                        <span className="font-mono font-bold text-[#3B82F6]">
                          {result.scaledValue.toFixed(activeDraftScale.precision ?? 1)} / {activeDraftScale.max_score}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] hidden sm:inline">
                          ({sample.label})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${result.badgeBg}`}>
                          {result.label}
                        </span>
                        {result.isPassing ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Pass</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Failing</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Active Scale: <strong className="text-zinc-900 dark:text-zinc-100">{activeDraftScale.label}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? 'Applying Scale...' : 'Apply Scoring Scale'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
