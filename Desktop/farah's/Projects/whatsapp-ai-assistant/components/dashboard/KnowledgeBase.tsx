'use client'
import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Loader2, FileText, CheckCircle2 } from 'lucide-react'

type Doc = { name: string; chunks: number; date: string }

type Props = {
  onUpload: (text: string, fileName: string) => Promise<{ success: boolean; chunksCreated?: number; error?: string }>
}

export default function KnowledgeBase({ onUpload }: Props) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadDocs = async () => {
    try {
      const res = await fetch('/api/knowledge/list')
      const data = await res.json()
      if (res.ok && data.documents) {
        setDocs(
          data.documents.map((d: { fileName: string; chunkCount: number; uploadDate: string }) => ({
            name: d.fileName,
            chunks: d.chunkCount,
            date: new Date(d.uploadDate).toLocaleDateString(),
          }))
        )
      }
    } catch {
      // silently fail; table stays empty
    } finally {
      setLoadingDocs(false)
    }
  }

  useEffect(() => {
    loadDocs()
  }, [])

  const handlePdfFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only PDF files are supported. Please upload a .pdf file.')
      return
    }
    setPdfLoading(true)
    setSuccess(false)
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/knowledge/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(true)
        await loadDocs()
      } else {
        setErrorMsg(data.error ?? 'Upload failed')
      }
    } catch {
      setErrorMsg('Something went wrong')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePdfFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handlePdfFile(file)
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!name || !content) return
    setLoading(true)
    setSuccess(false)
    setErrorMsg('')
    try {
      const result = await onUpload(content, name)
      if (result.success) {
        setName('')
        setContent('')
        setSuccess(true)
        await loadDocs()
      } else {
        setErrorMsg(result.error ?? 'Upload failed')
      }
    } catch {
      setErrorMsg('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    setDeletingFile(fileName)
    setDeleteError('')
    try {
      const res = await fetch(`/api/knowledge/${encodeURIComponent(fileName)}`, { method: 'DELETE' })
      if (res.ok) {
        setDocs(prev => prev.filter(d => d.name !== fileName))
      } else {
        setDeleteError('Failed to delete document. Please try again.')
      }
    } catch {
      setDeleteError('Failed to delete document. Please try again.')
    } finally {
      setDeletingFile(null)
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Knowledge Base</h1>
        <p className="mt-1 text-sm text-slate-500">Train your AI with your business information</p>
      </header>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => !pdfLoading && fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && !pdfLoading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragOver
              ? 'border-[#22c55e] bg-green-50'
              : 'border-slate-300 bg-slate-50 hover:border-[#22c55e] hover:bg-green-50'
          } ${pdfLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            {pdfLoading
              ? <Loader2 className="h-6 w-6 animate-spin text-[#22c55e]" />
              : <Upload className="h-6 w-6 text-[#22c55e]" />
            }
          </div>
          <p className="text-sm font-medium text-slate-900">
            {pdfLoading ? 'Uploading PDF...' : 'Drag and drop files here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-slate-500">Supported: PDF</p>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Document name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pricing Plans"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here..."
              rows={8}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !name || !content}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Uploading...' : 'Upload'}
          </button>

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-[#16a34a]">
              <CheckCircle2 className="h-4 w-4" />
              Document uploaded successfully
            </div>
          )}
          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded Documents</h2>
        </div>
        {deleteError && (
          <p className="px-6 pt-4 text-sm text-red-500">{deleteError}</p>
        )}
        {loadingDocs ? (
          <div className="flex items-center justify-center px-6 py-12">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : docs.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No documents uploaded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Document Name</th>
                  <th className="px-6 py-3 font-medium">Chunks</th>
                  <th className="px-6 py-3 font-medium">Upload Date</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.map((d, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <FileText className="h-4 w-4 text-slate-400" />
                        {d.name}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{d.chunks}</td>
                    <td className="px-6 py-3.5 text-slate-600">{d.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(d.name)}
                        disabled={deletingFile === d.name}
                        className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete"
                      >
                        {deletingFile === d.name
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
