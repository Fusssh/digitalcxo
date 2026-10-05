"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X, 
  Check 
} from "lucide-react";

interface CustomDateTimePickerProps {
  value: string; // ISO or "YYYY-MM-DDTHH:mm" format
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CustomDateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select event date & time..."
}: CustomDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial or fallback date
  const parsedDate = value ? new Date(value) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  const [currentYear, setCurrentYear] = useState<number>(
    isValidDate ? parsedDate.getFullYear() : new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    isValidDate ? parsedDate.getMonth() : new Date().getMonth()
  );

  // Selected date pieces
  const [selectedDay, setSelectedDay] = useState<number | null>(
    isValidDate ? parsedDate.getDate() : null
  );
  const [selectedHour, setSelectedHour] = useState<number>(
    isValidDate ? parsedDate.getHours() : 10
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    isValidDate ? parsedDate.getMinutes() : 0
  );
  const [isAmPm, setIsAmPm] = useState<"AM" | "PM">(
    isValidDate ? (parsedDate.getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  // Sync internal state when external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
        setSelectedDay(d.getDate());
        setSelectedHour(d.getHours());
        setSelectedMinute(d.getMinutes());
        setIsAmPm(d.getHours() >= 12 ? "PM" : "AM");
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Emit change when date or time is selected
  const applyDateChange = (day: number, hour: number, minute: number, month = currentMonth, year = currentYear) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
    onChange(formatted);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    applyDateChange(day, selectedHour, selectedMinute);
  };

  const handleHourChange = (new12Hour: number) => {
    let h24 = new12Hour % 12;
    if (isAmPm === "PM") h24 += 12;
    setSelectedHour(h24);
    if (selectedDay !== null) {
      applyDateChange(selectedDay, h24, selectedMinute);
    }
  };

  const handleMinuteChange = (newMin: number) => {
    setSelectedMinute(newMin);
    if (selectedDay !== null) {
      applyDateChange(selectedDay, selectedHour, newMin);
    }
  };

  const toggleAmPm = (mode: "AM" | "PM") => {
    setIsAmPm(mode);
    let h24 = selectedHour % 12;
    if (mode === "PM") h24 += 12;
    setSelectedHour(h24);
    if (selectedDay !== null) {
      applyDateChange(selectedDay, h24, selectedMinute);
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
    setSelectedHour(today.getHours());
    setSelectedMinute(today.getMinutes());
    setIsAmPm(today.getHours() >= 12 ? "PM" : "AM");
    applyDateChange(today.getDate(), today.getHours(), today.getMinutes(), today.getMonth(), today.getFullYear());
  };

  const handleClear = () => {
    setSelectedDay(null);
    onChange("");
  };

  // Calendar Math
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Format display string
  const getDisplayValue = () => {
    if (!value || !isValidDate) return "";
    const dateStr = parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const timeStr = parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    return `${dateStr} • ${timeStr}`;
  };

  // 12-hour converter
  const display12Hour = selectedHour % 12 === 0 ? 12 : selectedHour % 12;

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
          {label}
        </label>
      )}

      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-left text-sm flex items-center justify-between transition-all cursor-pointer group ${
          isOpen 
            ? "border-[#C9A227] ring-2 ring-[#C9A227]/20 text-white" 
            : "border-white/10 hover:border-white/20 text-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span className={getDisplayValue() ? "text-white font-medium" : "text-slate-500"}>
            {getDisplayValue() || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C9A227] transition-colors" />
        </div>
      </button>

      {/* Popover Dropdown Picker */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-[200] w-full min-w-[340px] sm:min-w-[420px] bg-[#0c1322] border border-[#C9A227]/30 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left Column: Calendar View */}
            <div className="flex-1">
              {/* Header: Month & Year Controls */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-serif text-white">
                    {MONTHS[currentMonth]}
                  </span>
                  <span className="text-xs font-semibold text-[#C9A227] font-mono">
                    {currentYear}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {DAYS.map((day) => (
                  <span key={day} className="text-[11px] font-semibold text-slate-500 py-0.5">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Previous month filler days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                  const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
                  return (
                    <button
                      key={`prev-${i}`}
                      type="button"
                      disabled
                      className="h-8 w-8 mx-auto rounded-lg text-xs text-slate-700 flex items-center justify-center cursor-default opacity-40"
                    >
                      {dayNum}
                    </button>
                  );
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  const isToday = 
                    new Date().getDate() === dayNum &&
                    new Date().getMonth() === currentMonth &&
                    new Date().getFullYear() === currentYear;

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      onClick={() => handleDayClick(dayNum)}
                      className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-tr from-[#C9A227] to-amber-300 text-slate-950 font-bold shadow-md shadow-[#C9A227]/30 scale-105"
                          : isToday
                          ? "border border-[#C9A227]/60 text-[#C9A227] hover:bg-[#C9A227]/10"
                          : "text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Quick Actions */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px]">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer font-medium"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="text-[#C9A227] hover:underline font-semibold cursor-pointer"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Right Column: Premium Time Selector */}
            <div className="sm:w-36 flex flex-col justify-between sm:border-l sm:border-white/10 sm:pl-4 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Event Time
                </span>

                {/* AM / PM Toggle */}
                <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-slate-950 border border-white/10 mb-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleAmPm("AM")}
                    className={`py-1 rounded font-bold transition-all cursor-pointer ${
                      isAmPm === "AM" 
                        ? "bg-[#C9A227] text-slate-950 shadow-sm" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAmPm("PM")}
                    className={`py-1 rounded font-bold transition-all cursor-pointer ${
                      isAmPm === "PM" 
                        ? "bg-[#C9A227] text-slate-950 shadow-sm" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    PM
                  </button>
                </div>

                {/* Hour and Minute Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Hour Selection */}
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1 font-semibold">Hour</label>
                    <select
                      value={display12Hour}
                      onChange={(e) => handleHourChange(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C9A227]"
                    >
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const h = idx + 1;
                        return (
                          <option key={h} value={h} className="bg-slate-900 text-white">
                            {String(h).padStart(2, "0")}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Minute Selection */}
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1 font-semibold">Min</label>
                    <select
                      value={selectedMinute}
                      onChange={(e) => handleMinuteChange(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C9A227]"
                    >
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                        <option key={m} value={m} className="bg-slate-900 text-white">
                          {String(m).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Preview Badge */}
                <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block">Selected Time</span>
                  <span className="text-sm font-bold font-mono text-[#C9A227]">
                    {String(display12Hour).padStart(2, "0")}:{String(selectedMinute).padStart(2, "0")} {isAmPm}
                  </span>
                </div>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full mt-3 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
