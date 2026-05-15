"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Clock, FileText } from "lucide-react";
import { fetchHistory, fetchHistoryDetail, deleteHistory, HistoryItem, AnalysisResult } from "@/lib/api";

interface HistoryPanelProps {
  onSelect: (result: AnalysisResult) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onSelect, onClose }: HistoryPanelProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setItems(await fetchHistory()); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelect = async (id: number) => {
    try {
      const detail = await fetchHistoryDetail(id);
      if (detail.analysis) onSelect(detail.analysis);
    } catch {}
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteHistory(id);
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-deco-ink/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-deco-cream overflow-auto p-6 animate-enter" style={{ boxShadow: "-8px 0 0 0 rgba(26,39,68,0.04)" }}>
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="flex items-center gap-1 text-sm font-bold text-deco-warmgray hover:text-deco-navy transition-colors">
            <ChevronLeft className="w-4 h-4" /> 返回
          </button>
          <h2 className="text-lg font-black text-deco-navy" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
            历史记录
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-deco-warmgray text-sm py-12">加载中...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-deco-warmgray/30 mx-auto mb-3" />
            <p className="text-deco-warmgray text-sm">暂无历史记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center justify-between p-4 bg-white border border-deco-warmgray/15 hover:border-deco-brass/40 gold-leaf cursor-pointer rounded transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-deco-navy" />
                  <div>
                    <p className="text-sm font-bold text-deco-navy">{item.filename}</p>
                    <p className="text-xs text-deco-warmgray">{item.created_at?.slice(0, 10)} - {item.analysis_count} 次分析</p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1 text-deco-warmgray/40 hover:text-deco-rose transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
