"use client";

import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

type Message = {
  role: string;
  content: string;
  // Add more fields if needed
};

type LLMLog = {
  type: string;
  messages: Message[];
  response_format: string;
  reasoning_effort: string;
  temperature: number;
  elapsed_time: number;
  response: string;
  finish_reason: string;
  completion_tokens: number;
  prompt_tokens: number;
  reasoning_tokens?: number; // Add reasoning_tokens (optional for backward compatibility)
  start_time?: number; // Add start_time (optional for backward compatibility)
};

export default function LogTable({ filename }: { filename: string }) {
  const [logs, setLogs] = useState<LLMLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!filename) return;
    setLoading(true);
    setError(null);
    fetch(`/api/logs?filename=${encodeURIComponent(filename)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filename]);

  return (
    <div className="p-4">
      {loading && <span className="text-gray-500">Loading logs...</span>}
      {error && <span className="text-red-600">Error: {error}</span>}
      {!loading && !error && (
        <div className="overflow-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8" />
                <th className="px-3 py-2 font-semibold text-gray-700">Type</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Start Time</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Response Format</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Last Prompt Message</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Response</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Reasoning Effort</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Temp</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Elapsed (s)</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Finish</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Comp. Tokens</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Prompt Tokens</th>
                <th className="px-3 py-2 font-semibold text-gray-700">Reasoning Tokens</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {logs.map((log, i) => {
                let lastMsg = undefined;
                let showPrompt = '';
                let showResponse = '';
                let showStartTime = '';
                const hasResponseFormat = !!log.response_format && log.response_format !== 'None';
                if (log.start_time) {
                  const date = new Date(log.start_time * 1000);
                  showStartTime = date.toLocaleString();
                } else {
                  showStartTime = '<no start_time>';
                }
                if (log.type === 'embeddings') {
                  const texts: string[] = (log as { texts?: string[] }).texts || [];
                  showPrompt = Array.isArray(texts) && texts.length > 0 ? texts[0].replace(/\s+/g, ' ').slice(0, 120) + (texts[0].length > 120 ? ' ...' : '') : '<no texts>';
                  showResponse = '';
                } else {
                  const messages = Array.isArray(log.messages) ? log.messages : [];
                  const promptMessages = messages.filter(m => m.role === 'user');
                  lastMsg = promptMessages[promptMessages.length - 1];
                  const lastPromptContent = lastMsg ? lastMsg.content.replace(/\s+/g, ' ') : '';
                  showPrompt = lastPromptContent.length > 120 ? lastPromptContent.slice(0, 120) + ' ...' : lastPromptContent;
                  showResponse = log.response && log.response.replace(/\s+/g, ' ').length > 120
                    ? log.response.replace(/\s+/g, ' ').slice(0, 120) + ' ...'
                    : log.response;
                }
                return (
                  <React.Fragment key={i}>
                    <tr className={openIndex === i ? 'bg-blue-50 transition' : 'transition'}>
                      <td className="align-top px-2 py-2">
                        <button
                          className={`rounded-md p-1 border ${openIndex === i ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'} hover:bg-blue-100 hover:text-blue-700 transition`}
                          onClick={() => setOpenIndex(openIndex === i ? null : i)}
                          aria-label={openIndex === i ? 'Hide all messages' : 'Show all messages'}
                        >
                          {openIndex === i ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                      </td>
                      <td className="px-3 py-2 font-bold text-indigo-700 align-top">{log.type}</td>
                      <td className="px-3 py-2 align-top">{showStartTime}</td>
                      <td className="px-3 py-2 align-top">
                        {hasResponseFormat ? (
                          <span className="text-green-700 font-semibold">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-500 align-top">{showPrompt}</td>
                      <td className="px-3 py-2 align-top">{showResponse}</td>
                      <td className="px-3 py-2 text-blue-600 align-top">{log.reasoning_effort}</td>
                      <td className="px-3 py-2 align-top">{log.temperature}</td>
                      <td className="px-3 py-2 align-top">{log.elapsed_time != null ? log.elapsed_time.toFixed(2) : ''}</td>
                      <td className="px-3 py-2 align-top">{log.finish_reason}</td>
                      <td className="px-3 py-2 align-top">{log.completion_tokens}</td>
                      <td className="px-3 py-2 align-top">{log.prompt_tokens}</td>
                      <td className="px-3 py-2 align-top">{log.reasoning_tokens != null ? log.reasoning_tokens : ''}</td>
                    </tr>
                    {openIndex === i && (
                      <tr>
                        <td />
                        <td colSpan={11} className="bg-blue-50 rounded-b-xl shadow-inner px-6 py-4">
                          {hasResponseFormat && (
                            <div className="mb-4">
                              <span className="font-semibold text-blue-700">Response Format:</span>
                              <div className="mt-1 bg-blue-100 rounded p-2">
                                <span className="text-sm break-all">{typeof log.response_format === 'string' ? log.response_format : JSON.stringify(log.response_format)}</span>
                              </div>
                            </div>
                          )}
                          {log.type === 'embeddings' ? (
                            <>
                              <div className="font-semibold mb-2">Texts:</div>
                              <div className="space-y-2">
                                {Array.isArray((log as { texts?: string[] }).texts) && ((log as { texts?: string[] }).texts?.length ?? 0) > 0 ? (
                                  <div className="flex flex-col gap-2">
                                    {((log as { texts?: string[] }).texts ?? []).map((txt, j) => (
                                      <div key={j} className="border-b border-gray-200 pb-1">
                                        <span className="text-sm">{txt}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">No texts</span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-semibold mb-2">All Messages:</div>
                              <div className="space-y-4">
                                {log.messages.length === 0 ? (
                                  <span className="text-xs text-gray-400">No messages</span>
                                ) : (
                                  <div className="flex flex-col gap-4">
                                    {log.messages.map((msg, j) => (
                                      <div key={j} className="rounded-lg bg-gray-50 border border-gray-200 p-3 shadow-sm">
                                        <div className="flex items-center mb-1">
                                          <span className="text-xs font-semibold text-blue-700 uppercase mr-2">{msg.role}</span>
                                        </div>
                                        <div className="whitespace-pre-line text-sm text-gray-800 break-words">
                                          {msg.content}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="mt-4">
                                <span className="font-semibold text-blue-700">Full Response:</span>
                                <div className="mt-1 bg-blue-100 rounded p-2">
                                  <div className="text-sm whitespace-pre-line">{log.response}</div>
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
