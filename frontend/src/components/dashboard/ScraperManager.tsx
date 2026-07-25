import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, Upload, FileText, CheckCircle, Clock } from 'lucide-react';
import { triggerScraperJob, fetchScraperLogs, uploadKnowledgeDocument } from '../../services/api';

export const ScraperManager: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PDF');
  const [content, setContent] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const loadLogs = async () => {
    try {
      const data = await fetchScraperLogs();
      setLogs(data);
    } catch {}
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      await triggerScraperJob();
      setUploadStatus('Scraper job triggered successfully in background.');
      await loadLogs();
    } catch {
      setUploadStatus('Failed to trigger scraper.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await uploadKnowledgeDocument({ title, category, content });
      setUploadStatus('Document ingested into Qdrant & PostgreSQL successfully!');
      setTitle('');
      setContent('');
    } catch {
      setUploadStatus('Error uploading document.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Scraper Status & Trigger */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-sm">Automated Knowledge Base Scraper</h3>
            <p className="text-xs text-slate-400">Crawls Gyanoday Bhavan Google Site every 6 hours</p>
          </div>
          <button
            onClick={handleTriggerScrape}
            disabled={isScraping}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold rounded-xl hover:brightness-110 disabled:opacity-50 text-xs shadow-md transition-all"
          >
            {isScraping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Run Scraper Now</span>
          </button>
        </div>

        {uploadStatus && (
          <div className="mb-4 p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Crawl Audit Logs:</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500">No crawl logs recorded yet. Click "Run Scraper Now".</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div className="truncate mr-2">
                  <span className="font-mono text-amber-400 text-[11px] block truncate">{log.url}</span>
                  <span className="text-[10px] text-slate-400">Pages: {log.pages_crawled} | Chunks: {log.docs_indexed}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  log.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual PDF / Resource Direct Ingest Form */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <h3 className="font-bold text-white text-sm mb-1">Direct Knowledge Document Uploader</h3>
        <p className="text-xs text-slate-400 mb-4">Instantly upload custom notices, research guides, or syllabus PDFs into Qdrant</p>
        
        <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Turnitin Plagiarism Submission Policy 2026"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 focus:outline-none focus:border-amber-500"
            >
              <option value="PDF">PDF Document</option>
              <option value="Research Support">Research Support</option>
              <option value="Question Papers">Question Paper</option>
              <option value="Notice">Notice & Circular</option>
              <option value="Institutional Repository">Institutional Repository</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Document Content / Text Extract</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste text contents or document extract here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!title || !content}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest Document to Knowledge Base</span>
          </button>
        </form>
      </div>
    </div>
  );
};
