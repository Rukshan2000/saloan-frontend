"use client"

import { useEffect, useRef } from "react"

export default function ReCaptcha({ onVerify, onExpired, onError, size = "normal", theme = "light" }) {
  const recaptchaRef = useRef(null)
  const widgetId = useRef(null)

  useEffect(() => {
    const loadReCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render) {
        if (widgetId.current !== null) {
          window.grecaptcha.reset(widgetId.current)
        } else {
          widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            callback: onVerify,
            "expired-callback": onExpired,
            "error-callback": onError,
            size: size,
            theme: theme,
          })
        }
      }
    }

    if (window.grecaptcha) {
      loadReCaptcha()
    } else {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?onload=onReCaptchaLoad&render=explicit"
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      window.onReCaptchaLoad = loadReCaptcha
    }

    return () => {
      if (widgetId.current !== null) {
        window.grecaptcha?.reset(widgetId.current)
      }
    }
  }, [onVerify, onExpired, onError, size, theme])

  const reset = () => {
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.current)
    }
  }

  const getResponse = () => {
    if (widgetId.current !== null && window.grecaptcha) {
      return window.grecaptcha.getResponse(widgetId.current)
    }
    return null
  }

  // Expose methods to parent component
  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset = reset
      recaptchaRef.current.getResponse = getResponse
    }
  }, [])

  return <div ref={recaptchaRef} />
}
