import React from "react";
import LogTable from "./LogTable";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">LLM Trace Viewer</h1>
      <LogTable />
    </main>
  );
}
