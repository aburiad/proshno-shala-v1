import useAuthStore from '@/store/authStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function PDFPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [variant, setVariant] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [font, setFont] = useState('Hind Siliguri')
  const [size, setSize] = useState('12pt')
  const [spacing, setSpacing] = useState('1.6')

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }
    generatePdf()
  }, [id, variant, font, size, spacing])

  async function generatePdf() {
    setLoading(true)
    setError(null)

    // Revoke old URL
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)

    try {
      const params = new URLSearchParams()
      if (variant) params.append('variant', variant)
      if (font) params.append('font', font)
      if (size) params.append('size', size)
      if (spacing) params.append('spacing', spacing)
      const query = params.toString() ? `?${params.toString()}` : ''

      // Get API base URL
      const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
      const pdfUrl = apiOrigin 
        ? `${apiOrigin}/api/papers/${id}/pdf${query}` 
        : `/api/papers/${id}/pdf${query}`
      
      console.log('[PDFPreview] VITE_API_URL:', apiOrigin || '(not set)')
      console.log('[PDFPreview] Fetching PDF from:', pdfUrl)
      
      const res = await fetch(pdfUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log('[PDFPreview] Response status:', res.status, res.statusText)
      console.log('[PDFPreview] Content-Type:', res.headers.get('content-type'))

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('[PDFPreview] Error response:', data)
        throw new Error(data.message || `PDF তৈরি করতে ব্যর্থ (${res.status})`)
      }

      const contentType = res.headers.get('content-type')
      console.log('[PDFPreview] Content type:', contentType)
      
      if (!contentType || !contentType.includes('application/pdf')) {
        const text = await res.text()
        console.error('[PDFPreview] Not a PDF, got:', text.substring(0, 200))
        throw new Error('PDF নয়, সার্ভার থেকে ভুল টাইপ পেয়েছি')
      }

      const blob = await res.blob()
      console.log('[PDFPreview] Blob size:', blob.size, 'type:', blob.type)
      
      if (blob.size < 1000) {
        console.warn('[PDFPreview] PDF blob is very small, might be empty')
      }

      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('[PDFPreview] Error generating PDF:', err)
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `paper${variant ? `_Set-${variant}` : ''}.pdf`
    a.click()
  }

  function handlePrint() {
    if (!pdfUrl) return
    const win = window.open(pdfUrl, '_blank')
    if (win) {
      win.addEventListener('load', () => win.print())
    }
  }

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/papers/${id}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">PDF প্রিভিউ</h1>
            <p className="text-[11px] text-gray-400">
              {loading ? 'তৈরি হচ্ছে...' : error ? 'ত্রুটি হয়েছে' : 'প্রস্তুত'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Variant toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5 text-xs">
            {[
              { val: null, label: 'সেট A' },
              { val: 'B', label: 'সেট B' },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setVariant(opt.val)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  variant === opt.val
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 btn-press"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white disabled:opacity-40 btn-press shadow-lg shadow-blue-600/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            disabled={!pdfUrl}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200 btn-press"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.061 48.061 0 0110.5 0m-10.5 0V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v3.034" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF viewer */}
      <div className="bg-gray-200 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">PDF তৈরি হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={generatePdf}
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        ) : null}
      </div>

      <AnimatePresence>
        {showSettings && (
          <PDFSettingsModal
            onClose={() => setShowSettings(false)}
            font={font} setFont={setFont}
            size={size} setSize={setSize}
            spacing={spacing} setSpacing={setSpacing}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PDFSettingsModal({ onClose, font, setFont, size, setSize, spacing, setSpacing }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
        
        <h3 className="text-xl font-black mb-6">প্রিন্ট সেটিংস</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ফন্ট পরিবার</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none"
            >
              <option value="Hind Siliguri">Hind Siliguri (Standard)</option>
              <option value="Noto Sans Bengali">Noto Sans Bengali</option>
              <option value="Noto Serif Bengali">Noto Serif Bengali (Classic)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ফন্ট সাইজ</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none"
            >
              <option value="10pt">Small (10pt)</option>
              <option value="11pt">Normal (11pt)</option>
              <option value="12pt">Medium (12pt)</option>
              <option value="13pt">Large (13pt)</option>
              <option value="14pt">Extra Large (14pt)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">লাইন স্পেসিং</label>
            <select
              value={spacing}
              onChange={(e) => setSpacing(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none"
            >
              <option value="1.2">Compact (1.2)</option>
              <option value="1.6">Normal (1.6)</option>
              <option value="2.0">Relaxed (2.0)</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 btn-press text-sm"
            >
              প্রয়োগ করুন
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
