"use client";
import React, { useEffect, useState } from "react";
import LogTable from "./LogTable";

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch file list");
        return res.json();
      })
      .then((data) => {
        setFiles(data);
        setSelected(data[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">LLM Trace Viewer</h1>
      {loading && <div className="text-gray-500">Loading file list...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && !error && (
        <div className="mb-6">
          <div className="font-semibold mb-2">Available log files:</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {files.map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded border text-sm font-mono transition ${selected === f ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"}`}
                onClick={() => setSelected(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
      {selected && <LogTable filename={selected} />}
    </main>
  );
}
