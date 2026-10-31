import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GradingScaleModal } from '../GradingScaleModal';
import { DEFAULT_GRADING_SCALE, PRESET_GRADING_SCALES } from '../../../utils/grading';

const mockUpdateGradingScale = vi.fn().mockResolvedValue(true);
let mockGradingScale = { ...DEFAULT_GRADING_SCALE };

vi.mock('../../../context/CourseContext', () => ({
  useCourse: () => ({
    gradingScale: mockGradingScale,
    updateGradingScale: mockUpdateGradingScale,
  }),
}));

describe('GradingScaleModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGradingScale = { ...DEFAULT_GRADING_SCALE };
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<GradingScaleModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with presets when isOpen is true', () => {
    render(<GradingScaleModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Course Scoring & Grading Scale')).toBeDefined();
    expect(screen.getAllByText(PRESET_GRADING_SCALES.scale_9.label).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(PRESET_GRADING_SCALES.scale_20.label)).toBeDefined();
    expect(screen.getByText(PRESET_GRADING_SCALES.scale_100.label)).toBeDefined();
    expect(screen.getByText(PRESET_GRADING_SCALES.scale_4.label)).toBeDefined();
    expect(screen.getByText('Custom Numeric Scale')).toBeDefined();
  });

  it('selects 20-Point scale preset and saves', async () => {
    const handleClose = vi.fn();
    render(<GradingScaleModal isOpen={true} onClose={handleClose} />);

    // Click 20-Point preset card
    const preset20 = screen.getByText(PRESET_GRADING_SCALES.scale_20.label);
    fireEvent.click(preset20);

    // Save button
    const saveBtn = screen.getByRole('button', { name: /apply scoring scale/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateGradingScale).toHaveBeenCalledWith(PRESET_GRADING_SCALES.scale_20);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('allows customizing max score and passing threshold in custom mode', async () => {
    const handleClose = vi.fn();
    render(<GradingScaleModal isOpen={true} onClose={handleClose} />);

    // Click Custom preset card
    const customCard = screen.getByText('Custom Numeric Scale');
    fireEvent.click(customCard);

    // Inputs for Max Score and Passing Threshold appear
    const maxInput = screen.getByDisplayValue(String(DEFAULT_GRADING_SCALE.max_score));
    fireEvent.change(maxInput, { target: { value: '50' } });

    const passInput = screen.getByDisplayValue(String(DEFAULT_GRADING_SCALE.passing_threshold));
    fireEvent.change(passInput, { target: { value: '25' } });

    const saveBtn = screen.getByRole('button', { name: /apply scoring scale/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateGradingScale).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'numeric',
          max_score: 50,
          passing_threshold: 25,
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
