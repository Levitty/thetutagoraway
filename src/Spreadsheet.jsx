import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase';

// ==================== FORMULA ENGINE ====================
const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function colToIndex(col) {
  return COL_LETTERS.indexOf(col.toUpperCase());
}

function cellRefToRC(ref) {
  const match = ref.match(/^([A-Z])(\d+)$/i);
  if (!match) return null;
  return { r: parseInt(match[2]) - 1, c: colToIndex(match[1]) };
}

function parseRange(rangeStr) {
  const [start, end] = rangeStr.split(':');
  const s = cellRefToRC(start);
  const e = cellRefToRC(end);
  if (!s || !e) return [];
  const cells = [];
  for (let r = Math.min(s.r, e.r); r <= Math.max(s.r, e.r); r++) {
    for (let c = Math.min(s.c, e.c); c <= Math.max(s.c, e.c); c++) {
      cells.push({ r, c });
    }
  }
  return cells;
}

function getValues(cells, data) {
  return cells.map(({ r, c }) => {
    const val = evaluateCell(r, c, data, new Set());
    return typeof val === 'number' ? val : parseFloat(val) || 0;
  });
}

function evaluateCell(row, col, data, visited) {
  const key = `${row},${col}`;
  if (visited.has(key)) return '#REF!'; // circular
  visited.add(key);

  const raw = data[row]?.[col] || '';
  if (typeof raw !== 'string' || !raw.startsWith('=')) {
    const num = parseFloat(raw);
    return isNaN(num) ? raw : num;
  }

  return evaluateFormula(raw.substring(1), data, visited);
}

function evaluateFormula(expr, data, visited) {
  try {
    const upper = expr.toUpperCase().trim();

    // SUM(A1:A5) or SUM(A1,B2,C3)
    const fnMatch = upper.match(/^(SUM|AVERAGE|AVG|COUNT|MIN|MAX|ROUND|ABS|SQRT|POWER|POW)\((.+)\)$/);
    if (fnMatch) {
      const fn = fnMatch[1];
      const args = fnMatch[2];
      let values = [];

      // Parse arguments (ranges and individual cells)
      const parts = args.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes(':')) {
          const rangeCells = parseRange(part);
          values.push(...getValues(rangeCells, data));
        } else {
          const rc = cellRefToRC(part);
          if (rc) {
            const val = evaluateCell(rc.r, rc.c, data, new Set(visited));
            values.push(typeof val === 'number' ? val : parseFloat(val) || 0);
          } else {
            values.push(parseFloat(part) || 0);
          }
        }
      }

      switch (fn) {
        case 'SUM': return values.reduce((a, b) => a + b, 0);
        case 'AVERAGE': case 'AVG': return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        case 'COUNT': return values.filter(v => v !== 0 || v === 0).length;
        case 'MIN': return Math.min(...values);
        case 'MAX': return Math.max(...values);
        case 'ABS': return Math.abs(values[0] || 0);
        case 'SQRT': return Math.sqrt(values[0] || 0);
        case 'ROUND': return Math.round(values[0] || 0);
        case 'POWER': case 'POW': return Math.pow(values[0] || 0, values[1] || 0);
        default: return '#NAME?';
      }
    }

    // Simple arithmetic: replace cell refs with values, then eval
    let evalExpr = upper.replace(/[A-Z]\d+/g, (ref) => {
      const rc = cellRefToRC(ref);
      if (!rc) return '0';
      const val = evaluateCell(rc.r, rc.c, data, new Set(visited));
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    });

    // Percentage: e.g., A1*15% → A1*0.15
    evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)%/g, (_, num) => `(${num}/100)`);

    // Safe eval - only allow numbers and operators
    if (/^[\d+\-*/.() ]+$/.test(evalExpr)) {
      const result = Function('"use strict"; return (' + evalExpr + ')')();
      return Math.round(result * 10000) / 10000; // avoid floating point noise
    }

    return '#ERROR';
  } catch (e) {
    return '#ERROR';
  }
}

// ==================== SPREADSHEET COMPONENT ====================
export function Spreadsheet({ channelName, standalone = false, onBack }) {
  const DEFAULT_ROWS = 20;
  const DEFAULT_COLS = 10;

  const [data, setData] = useState(() => {
    const rows = [];
    for (let r = 0; r < DEFAULT_ROWS; r++) {
      rows.push(new Array(DEFAULT_COLS).fill(''));
    }
    return rows;
  });

  const [selectedCell, setSelectedCell] = useState(null); // { r, c }
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [sheetName, setSheetName] = useState('Sheet 1');
  const inputRef = useRef(null);
  const channelRef = useRef(null);

  // Supabase Realtime sync (for lesson mode)
  useEffect(() => {
    if (!channelName) return;
    const channel = supabase.channel(`spreadsheet-${channelName}`, {
      config: { broadcast: { self: false } },
    });

    channel.on('broadcast', { event: 'cell-update' }, ({ payload }) => {
      setData(prev => {
        const newData = prev.map(row => [...row]);
        if (newData[payload.r]) {
          newData[payload.r][payload.c] = payload.value;
        }
        return newData;
      });
    });

    channel.on('broadcast', { event: 'clear-sheet' }, () => {
      setData(prev => prev.map(row => row.map(() => '')));
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => supabase.removeChannel(channel);
  }, [channelName]);

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const updateCell = useCallback((r, c, value) => {
    setData(prev => {
      const newData = prev.map(row => [...row]);
      newData[r][c] = value;
      return newData;
    });

    // Broadcast if in lesson mode
    channelRef.current?.send({
      type: 'broadcast',
      event: 'cell-update',
      payload: { r, c, value },
    });
  }, []);

  const handleCellClick = (r, c) => {
    setSelectedCell({ r, c });
    if (editingCell?.r === r && editingCell?.c === c) return;
    // Commit previous edit
    if (editingCell) {
      updateCell(editingCell.r, editingCell.c, editValue);
    }
    setEditingCell(null);
  };

  const handleCellDoubleClick = (r, c) => {
    setEditingCell({ r, c });
    setEditValue(data[r][c] || '');
    setSelectedCell({ r, c });
  };

  const handleKeyDown = (e) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        updateCell(editingCell.r, editingCell.c, editValue);
        setEditingCell(null);
        // Move down
        if (r < data.length - 1) setSelectedCell({ r: r + 1, c });
      } else if (e.key === 'Escape') {
        setEditingCell(null);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        updateCell(editingCell.r, editingCell.c, editValue);
        setEditingCell(null);
        if (c < DEFAULT_COLS - 1) setSelectedCell({ r, c: c + 1 });
      }
      return;
    }

    // Navigation when not editing
    if (e.key === 'ArrowUp' && r > 0) setSelectedCell({ r: r - 1, c });
    else if (e.key === 'ArrowDown' && r < data.length - 1) setSelectedCell({ r: r + 1, c });
    else if (e.key === 'ArrowLeft' && c > 0) setSelectedCell({ r, c: c - 1 });
    else if (e.key === 'ArrowRight' && c < DEFAULT_COLS - 1) setSelectedCell({ r, c: c + 1 });
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (c < DEFAULT_COLS - 1) setSelectedCell({ r, c: c + 1 });
      else if (r < data.length - 1) setSelectedCell({ r: r + 1, c: 0 });
    }
    else if (e.key === 'Enter') {
      handleCellDoubleClick(r, c);
    }
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      updateCell(r, c, '');
    }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Start typing
      setEditingCell({ r, c });
      setEditValue(e.key);
    }
  };

  const getCellDisplay = (r, c) => {
    const raw = data[r][c];
    if (!raw) return '';
    if (typeof raw === 'string' && raw.startsWith('=')) {
      const result = evaluateCell(r, c, data, new Set());
      if (typeof result === 'number') return Math.round(result * 100) / 100;
      return result;
    }
    return raw;
  };

  const getCellRef = (r, c) => `${COL_LETTERS[c]}${r + 1}`;

  const clearAll = () => {
    setData(prev => prev.map(row => row.map(() => '')));
    channelRef.current?.send({
      type: 'broadcast',
      event: 'clear-sheet',
      payload: {},
    });
  };

  const addRow = () => {
    setData(prev => [...prev, new Array(DEFAULT_COLS).fill('')]);
  };

  // CSV export
  const exportCSV = () => {
    let csv = '';
    // Header row
    csv += COL_LETTERS.slice(0, DEFAULT_COLS).split('').join(',') + '\n';
    for (let r = 0; r < data.length; r++) {
      const row = [];
      for (let c = 0; c < DEFAULT_COLS; c++) {
        const val = getCellDisplay(r, c);
        row.push(typeof val === 'string' && val.includes(',') ? `"${val}"` : val);
      }
      csv += row.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheetName.replace(/\s/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFormula = (r, c) => {
    const raw = data[r]?.[c];
    return typeof raw === 'string' && raw.startsWith('=');
  };

  const containerClass = standalone
    ? 'min-h-screen bg-slate-50 flex flex-col'
    : 'flex flex-col h-full bg-slate-900';

  return (
    <div className={containerClass} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      {standalone && (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 6h18M3 18h18M7 3v18M17 3v18" /></svg>
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-800">Tutagora Spreadsheet</h1>
                <p className="text-xs text-slate-400">Calculations & formulas</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
              Export CSV
            </button>
            <button onClick={addRow} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
              + Row
            </button>
            <button onClick={clearAll} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors">
              Clear All
            </button>
          </div>
        </header>
      )}

      {/* In-lesson toolbar */}
      {!standalone && (
        <div className="flex items-center gap-2 p-2 bg-slate-800 border-b border-slate-700 flex-shrink-0 flex-wrap">
          <span className="text-slate-300 text-xs font-medium px-2">📊 Spreadsheet</span>
          <div className="w-px h-5 bg-slate-600" />
          <button onClick={exportCSV} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors">Export</button>
          <button onClick={addRow} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors">+ Row</button>
          <div className="flex-1" />
          <button onClick={clearAll} className="px-2 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-xs transition-colors">Clear</button>
        </div>
      )}

      {/* Formula Bar */}
      <div className={`flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0 ${standalone ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
        <span className={`text-xs font-mono font-semibold w-10 text-center ${standalone ? 'text-slate-500' : 'text-slate-400'}`}>
          {selectedCell ? getCellRef(selectedCell.r, selectedCell.c) : ''}
        </span>
        <div className={`w-px h-5 ${standalone ? 'bg-slate-200' : 'bg-slate-600'}`} />
        <span className={`text-xs font-medium ${standalone ? 'text-slate-400' : 'text-slate-500'}`}>fx</span>
        <div className={`flex-1 px-2 py-1 rounded text-sm font-mono ${
          standalone ? 'bg-slate-50 text-slate-700 border border-slate-200' : 'bg-slate-900 text-slate-200 border border-slate-600'
        }`}>
          {selectedCell ? (data[selectedCell.r]?.[selectedCell.c] || '') : ''}
        </div>
      </div>

      {/* Formula help */}
      {standalone && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex-shrink-0">
          <p className="text-xs text-emerald-700">
            <strong>Formulas:</strong> Type <code className="bg-emerald-100 px-1 rounded">=SUM(A1:A5)</code>, <code className="bg-emerald-100 px-1 rounded">=AVERAGE(B1:B10)</code>, <code className="bg-emerald-100 px-1 rounded">=A1*B1</code>, <code className="bg-emerald-100 px-1 rounded">=A1+A2+A3</code>, <code className="bg-emerald-100 px-1 rounded">=MIN(C1:C5)</code>, <code className="bg-emerald-100 px-1 rounded">=MAX(D1:D5)</code>, <code className="bg-emerald-100 px-1 rounded">=SQRT(A1)</code>, <code className="bg-emerald-100 px-1 rounded">=A1*15%</code>
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className={`border-collapse w-full ${standalone ? '' : 'text-slate-200'}`}>
          <thead>
            <tr>
              <th className={`sticky top-0 left-0 z-20 w-10 text-center text-xs font-medium py-1.5 border ${
                standalone ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}></th>
              {Array.from({ length: DEFAULT_COLS }, (_, c) => (
                <th key={c} className={`sticky top-0 z-10 min-w-[100px] text-center text-xs font-semibold py-1.5 border ${
                  standalone
                    ? `bg-slate-100 border-slate-200 ${selectedCell?.c === c ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`
                    : `bg-slate-800 border-slate-700 ${selectedCell?.c === c ? 'text-emerald-400 bg-slate-700' : 'text-slate-400'}`
                }`}>
                  {COL_LETTERS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                <td className={`sticky left-0 z-10 text-center text-xs font-medium py-0 border ${
                  standalone
                    ? `bg-slate-100 border-slate-200 ${selectedCell?.r === r ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'}`
                    : `bg-slate-800 border-slate-700 ${selectedCell?.r === r ? 'text-emerald-400 bg-slate-700' : 'text-slate-400'}`
                }`}>
                  {r + 1}
                </td>
                {row.map((cell, c) => {
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isEditing = editingCell?.r === r && editingCell?.c === c;
                  const display = getCellDisplay(r, c);
                  const hasFormula = isFormula(r, c);
                  const isError = typeof display === 'string' && display.startsWith('#');

                  return (
                    <td
                      key={c}
                      onClick={() => handleCellClick(r, c)}
                      onDoubleClick={() => handleCellDoubleClick(r, c)}
                      className={`relative min-w-[100px] h-8 px-2 text-sm border cursor-cell transition-colors ${
                        standalone
                          ? `border-slate-200 ${isSelected ? 'outline outline-2 outline-emerald-500 bg-emerald-50/50 z-10' : 'bg-white hover:bg-slate-50'}`
                          : `border-slate-700 ${isSelected ? 'outline outline-2 outline-emerald-500 bg-slate-700/50 z-10' : 'bg-slate-900 hover:bg-slate-800'}`
                      } ${isError ? 'text-red-500' : ''} ${hasFormula && !isEditing ? (standalone ? 'text-blue-600' : 'text-blue-400') : ''}`}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={`absolute inset-0 w-full h-full px-2 text-sm font-mono outline-none ${
                            standalone ? 'bg-white text-slate-800' : 'bg-slate-800 text-white'
                          }`}
                        />
                      ) : (
                        <span className={`block truncate font-mono text-xs ${
                          typeof display === 'number' ? 'text-right' : 'text-left'
                        }`}>
                          {typeof display === 'number' ? display.toLocaleString() : display}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-t flex-shrink-0 text-xs ${
        standalone ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'
      }`}>
        <span>{sheetName}</span>
        <div className="flex items-center gap-4">
          {selectedCell && data[selectedCell.r][selectedCell.c] && (
            <>
              {(() => {
                // Show quick stats when a cell with a number is selected
                const val = getCellDisplay(selectedCell.r, selectedCell.c);
                if (typeof val === 'number') {
                  return <span>Value: <strong>{val.toLocaleString()}</strong></span>;
                }
                return null;
              })()}
            </>
          )}
          <span>{data.length} rows × {DEFAULT_COLS} cols</span>
          {channelName && <span className="text-emerald-400">● Synced</span>}
        </div>
      </div>
    </div>
  );
}

export default Spreadsheet;
