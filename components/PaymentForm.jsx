"use client"

import { useState, useEffect } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from "../redux/features/content_slice"
import { Loader2, CreditCard, Shield, Lock, Download, FileText } from "lucide-react"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146",
    },
  },
  hidePostalCode: false,
}

export function PaymentForm({ donationData, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [createPaymentIntent] = useCreatePaymentIntentMutation()
  const [confirmPayment] = useConfirmPaymentMutation()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false)

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const response = await createPaymentIntent({
          amount: donationData.amount * 100, // Convert to cents
          currency: "lkr",
          donorInfo: donationData.donorInfo,
          donationType: donationData.donationType,
        }).unwrap()

        setClientSecret(response.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        setPaymentError("Failed to initialize payment. Please try again.")
      }
    }

    if (donationData.amount && !clientSecret) {
      createIntent()
    }
  }, [donationData, createPaymentIntent, clientSecret])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donationData.donorInfo.name,
            email: donationData.donorInfo.email,
            phone: donationData.donorInfo.phone,
          },
        },
      })

      if (error) {
        setPaymentError(error.message)
        onError && onError(error)
      } else if (confirmedPaymentIntent.status === "succeeded") {
        // Payment succeeded, confirm with backend
        try {
          await confirmPayment({
            paymentIntentId: confirmedPaymentIntent.id,
            donationData: donationData,
          }).unwrap()

          setPaymentIntent(confirmedPaymentIntent)
          setPaymentSuccess(true)
          onSuccess && onSuccess(confirmedPaymentIntent)
        } catch (confirmError) {
          console.error("Error confirming payment:", confirmError)
          setPaymentError("Payment processed but confirmation failed. Please contact support.")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError("An unexpected error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadReceipt = async () => {
    if (!paymentIntent) return

    setIsDownloadingReceipt(true)
    try {
      const response = await fetch("/api/payments/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          donationData: donationData,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `donation-receipt-${paymentIntent.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error("Failed to generate receipt")
      }
    } catch (error) {
      console.error("Error downloading receipt:", error)
      setPaymentError("Failed to download receipt. Please contact support.")
    } finally {
      setIsDownloadingReceipt(false)
    }
  }

  const sendReceiptByEmail = async () => {
    if (!paymentIntent) return

    try {
      const response = await fetch("/api/payments/send-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          donationData: donationData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Receipt sent to your email successfully!")
      } else {
        throw new Error(result.message || "Failed to send receipt")
      }
    } catch (error) {
      console.error("Error sending receipt:", error)
      alert("Failed to send receipt by email. Please try downloading it instead.")
    }
  }

  if (paymentSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-700 mb-4">
            Thank you for your generous donation of LKR {donationData.amount.toLocaleString()}. Your contribution will
            make a real difference in the lives of people across Sri Lanka.
          </p>

          {/* Payment Details */}
          <div className="bg-white p-4 rounded-lg mb-4 text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Payment Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Transaction ID:</strong> {paymentIntent?.id}
              </p>
              <p>
                <strong>Amount:</strong> LKR {donationData.amount.toLocaleString()}
              </p>
              <p>
                <strong>Type:</strong> {donationData.donationType === "one-time" ? "One-time" : "Monthly"} Donation
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> <span className="text-green-600 font-medium">Completed</span>
              </p>
            </div>
          </div>

          {/* Receipt Options */}
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-gray-800">Get Your Receipt</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={downloadReceipt}
                disabled={isDownloadingReceipt}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {isDownloadingReceipt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button onClick={sendReceiptByEmail} variant="outline" className="flex-1" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
            </div>
          </div>

          <p className="text-sm text-green-600">
            A receipt has been automatically sent to {donationData.donorInfo.email}. You can also view your donation
            history in your account.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="h-4 w-4 mr-1" />
          Your payment information is encrypted and secure
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Donation Amount:</span>
              <span className="text-xl font-bold text-orange-500">LKR {donationData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Type:</span>
              <span className="capitalize">{donationData.donationType}</span>
            </div>
            {donationData.donorInfo.message && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Message:</strong> {donationData.donorInfo.message}
                </p>
              </div>
            )}
          </div>

          {/* Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
            <div className="border border-gray-300 rounded-md p-3 bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Error Display */}
          {paymentError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{paymentError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing || !clientSecret}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Donate LKR ${donationData.amount.toLocaleString()}`
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            <p>
              Powered by Stripe. Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
