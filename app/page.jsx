'use client'

import { useState } from 'react'

export default function Home() {
  const [number, setNumber] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generateSession() {
    if (!number.trim()) return

    setLoading(true)
    setCode('')
    setCopied(false)

    try {
      const response = await fetch('/api/pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: number.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setCode(data.code || '')
      } else {
        alert(data.error || 'Failed to generate session')
      }
    } catch {
      alert('Something went wrong')
    }

    setLoading(false)
  }

  async function copyCode() {
    if (!code) return

    await navigator.clipboard.writeText(code)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <main className="container">
      <div className="card">

        <div className="logo">
          ʀᴀᴢᴀ
        </div>

        <h1>Raza Session Generator</h1>

        <p className="subtitle">
          Generate your WhatsApp multi-device session
        </p>

        <label>
          WhatsApp Number
        </label>

        <input
          type="tel"
          placeholder="923xxxxxxxxx"
          value={number}
          onChange={(e) =>
            setNumber(e.target.value)
          }
        />

        <button
          onClick={generateSession}
          disabled={loading}
        >
          {loading
            ? 'Generating...'
            : 'Generate Session'}
        </button>

        {code && (
          <div className="result">

            <p>ʀᴀᴢᴀ sᴇssɪᴏɴ</p>

            <div className="code">
              {code}
            </div>

            <button
              className="copy"
              onClick={copyCode}
            >
              {copied
                ? 'Copied ✓'
                : 'Copy Session'}
            </button>

          </div>
        )}

        <div className="footer">
          ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴇɢᴇɴᴅ ʀᴀᴢᴀ
        </div>

      </div>
    </main>
  )
}
