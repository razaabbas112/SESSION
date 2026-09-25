'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [number, setNumber] = useState('')
  const [pairId, setPairId] = useState('')
  const [code, setCode] = useState('')
  const [session, setSession] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')
  const [showSession, setShowSession] = useState(false)

  useEffect(() => {
    if (!pairId) return

    let active = true

    const check = async () => {
      try {
        const response = await fetch(
          `/api/status?id=${encodeURIComponent(pairId)}`,
          { cache: 'no-store' }
        )

        const data = await response.json()

        if (!active) return

        if (data.code) {
          setCode(data.code)
        }

        if (data.status) {
          setStatus(data.status)
        }

        if (data.session) {
          setSession(data.session)
          setStatus('connected')
          setLoading(false)
        }

        if (data.error) {
          setStatus('error')
          setLoading(false)
        }
      } catch {
        // keep polling
      }
    }

    check()

    const timer =
      setInterval(check, 2500)

    return () => {
      active = false
      clearInterval(timer)
    }
  }, [pairId])

  async function generate() {
    const clean =
      number.replace(/\D/g, '')

    if (!clean) {
      alert('Enter your WhatsApp number')
      return
    }

    setLoading(true)
    setCode('')
    setSession('')
    setPairId('')
    setStatus('starting')
    setCopied('')
    setShowSession(false)

    try {
      const response =
        await fetch('/api/pair', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            number: clean
          })
        })

      const data =
        await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
          'Unable to start pairing'
        )
      }

      setPairId(data.id)
      setCode(data.code || '')
      setStatus(data.status || 'waiting')
    } catch (error) {
      setLoading(false)
      setStatus('error')
      alert(
        error.message ||
        'Something went wrong'
      )
    }
  }

  async function copy(value, type) {
    if (!value) return

    await navigator.clipboard.writeText(value)

    setCopied(type)

    setTimeout(() => {
      setCopied('')
    }, 2000)
  }

  return (
    <main className="page">

      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <section className="card">

        <div className="brand">
          <div className="brandIcon">
            R
          </div>

          <div>
            <div className="brandName">
              ʀᴀᴢᴀ
            </div>

            <div className="brandSub">
              SESSION SYSTEM
            </div>
          </div>
        </div>

        <div className="heading">
          <h1>
            WhatsApp Session
          </h1>

          <p>
            Connect your WhatsApp device
            using a secure pairing code.
          </p>
        </div>

        <div className="statusBox">

          <span
            className={
              status === 'connected'
                ? 'dot connected'
                : status === 'error'
                  ? 'dot error'
                  : 'dot'
            }
          />

          <span>
            {status === 'connected'
              ? 'WhatsApp connected'
              : status === 'starting'
                ? 'Starting pairing...'
                : status === 'waiting'
                  ? 'Waiting for pairing'
                  : status === 'connecting'
                    ? 'Connecting to WhatsApp...'
                    : status === 'error'
                      ? 'Pairing failed'
                      : 'Ready to pair'}
          </span>

        </div>

        <label>
          WhatsApp number
        </label>

        <div className="inputBox">
          <span>+</span>

          <input
            type="tel"
            inputMode="numeric"
            placeholder="923197135780"
            value={number}
            onChange={e =>
              setNumber(
                e.target.value
              )
            }
          />
        </div>

        <button
          className="generate"
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? 'Generating...'
            : 'Generate Pair Code'}
        </button>

        {code && (
          <div className="result">

            <div className="resultTitle">
              Pᴀɪʀ Cᴏᴅᴇ
            </div>

            <div className="code">
              {code}
            </div>

            <button
              className="secondary"
              onClick={() =>
                copy(
                  code,
                  'code'
                )
              }
            >
              {copied === 'code'
                ? 'Copied ✓'
                : 'Copy Pair Code'}
            </button>

            <p className="hint">
              Enter this code in
              WhatsApp → Linked devices
              → Link a device → Link with
              phone number.
            </p>

          </div>
        )}

        {session && (
          <div className="result sessionResult">

            <div className="success">
              ✓ WhatsApp Connected
            </div>

            <div className="resultTitle">
              Rᴀᴢᴀ Sᴇssɪᴏɴ
            </div>

            <div className="sessionBox">
              {showSession
                ? session
                : 'RAZA~••••••••••••••••••••••••'}
            </div>

            <button
              className="secondary"
              onClick={() =>
                setShowSession(
                  value => !value
                )
              }
            >
              {showSession
                ? 'Hide Session'
                : 'Show Session'}
            </button>

            {showSession && (
              <button
                className="secondary"
                onClick={() =>
                  copy(
                    session,
                    'session'
                  )
                }
              >
                {copied === 'session'
                  ? 'Copied ✓'
                  : 'Copy Session'}
              </button>
            )}

            <div className="sent">
              ✓ Session sent to your
              paired WhatsApp number
            </div>

          </div>
        )}

        <div className="features">

          <div>
            <b>01</b>
            Secure pairing
          </div>

          <div>
            <b>02</b>
            Multi-device
          </div>

          <div>
            <b>03</b>
            Raza session
          </div>

        </div>

        <footer>
          ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴇɢᴇɴᴅ ʀᴀᴢᴀ
        </footer>

      </section>
    </main>
  )
}
