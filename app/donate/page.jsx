"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StripeProvider } from "../../components/StripeProvider"
import { PaymentForm } from "../../components/PaymentForm"
import { useSubmitDonationMutation } from "../../redux/features/content_slice"
import { Heart, CreditCard, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  const [submitDonation] = useSubmitDonationMutation()
  const [currentStep, setCurrentStep] = useState(1) // 1: Amount, 2: Info, 3: Payment, 4: Success
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  })
  const [donationId, setDonationId] = useState(null)

  const predefinedAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount.toString())
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setDonationAmount("")
  }

  const handleDonorInfoChange = (e) => {
    const { name, value, type, checked } = e.target
    setDonorInfo({
      ...donorInfo,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const validateStep1 = () => {
    const amount = customAmount || donationAmount
    return amount && Number.parseFloat(amount) >= 100
  }

  const validateStep2 = () => {
    return donorInfo.name.trim() && donorInfo.email.trim()
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Record the donation in our database
      const donationData = {
        amount: customAmount || donationAmount,
        type: donationType,
        donorInfo: donorInfo,
        paymentIntentId: paymentIntent.id,
        status: "completed",
      }

      const response = await submitDonation(donationData).unwrap()
      setDonationId(response.donationId)
      setCurrentStep(4)
    } catch (error) {
      console.error("Error recording donation:", error)
    }
  }

  const handlePaymentError = (error) => {
    console.error("Payment error:", error)
  }

  const getDonationData = () => ({
    amount: Number.parseFloat(customAmount || donationAmount),
    donationType,
    donorInfo,
  })

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-orange-500 text-white"
                : step === currentStep + 1
                  ? "bg-orange-100 text-orange-500 border-2 border-orange-500"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-orange-500" : "bg-gray-200"}`}></div>
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Choose Donation Amount</CardTitle>
          <p className="text-gray-600 text-center">Select an amount or enter a custom donation</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Donation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="donationType"
                  value="one-time"
                  checked={donationType === "one-time"}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="mr-2"
                />
                One-time Donation
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="donationType"
                  value="monthly"
                  checked={donationType === "monthly"}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="mr-2"
                />
                Monthly Donation
              </label>
            </div>
          </div>

          {/* Predefined Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount (LKR)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={donationAmount === amount.toString() ? "default" : "outline"}
                  className={
                    donationAmount === amount.toString()
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                  onClick={() => handleAmountSelect(amount)}
                >
                  {amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Custom Amount (LKR)
            </label>
            <Input
              type="number"
              id="customAmount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount (minimum 100)"
              min="100"
              className="text-lg"
            />
          </div>

          {/* Impact Message */}
          {(donationAmount || customAmount) && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Your Impact</h4>
              <p className="text-sm text-orange-700">
                LKR {(customAmount || donationAmount).toLocaleString()} can help:
              </p>
              <ul className="text-sm text-orange-700 mt-2 space-y-1">
                <li>• Provide medical equipment to rural hospitals</li>
                <li>• Support patient transportation services</li>
                <li>• Fund health camps in underserved communities</li>
                <li>• Supply essential medications to those in need</li>
              </ul>
            </div>
          )}

          <Button
            onClick={handleNextStep}
            disabled={!validateStep1()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            Continue to Donor Information
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Donor Information</CardTitle>
          <p className="text-gray-600 text-center">Please provide your contact information</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={donorInfo.name}
                onChange={handleDonorInfoChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={donorInfo.email}
                onChange={handleDonorInfoChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={donorInfo.phone}
              onChange={handleDonorInfoChange}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              value={donorInfo.message}
              onChange={handleDonorInfoChange}
              rows={3}
              placeholder="Leave a message or specify how you'd like your donation to be used"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={donorInfo.anonymous}
              onChange={handleDonorInfoChange}
              className="mr-2"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Make this donation anonymous
            </label>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              className="flex-1 bg-white text-gray-700 border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!validateStep2()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreviousStep}
          className="bg-white text-gray-700 border-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Information
        </Button>
      </div>

      <StripeProvider>
        <PaymentForm donationData={getDonationData()} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
      </StripeProvider>
    </div>
  )

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Thank You!</h2>
          <p className="text-lg text-green-700 mb-6">
            Your generous donation of LKR {(customAmount || donationAmount).toLocaleString()} has been successfully
            processed.
          </p>
          <div className="bg-white p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Donation ID:</strong> {donationId || "Processing..."}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Type:</strong> {donationType === "one-time" ? "One-time" : "Monthly"} Donation
            </p>
            <p className="text-sm text-gray-600">
              <strong>Receipt:</strong> Sent to {donorInfo.email}
            </p>
          </div>
          <p className="text-green-700 mb-6">
            Your contribution will make a real difference in the lives of people across Sri Lanka. We'll keep you
            updated on how your donation is being used.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Return to Home</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="outline" className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50">
                View Our Campaigns
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Make a Donation</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your generous contribution helps us provide essential medical assistance and support to communities across
            Sri Lanka. Every donation makes a real difference in someone's life.
          </p>
        </div>
      </section>

      {/* Donation Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </section>

      {/* Security & Trust Section */}
      {currentStep < 4 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure & Trusted</h2>
              <p className="text-gray-600">Your donation is safe and secure with industry-leading protection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stripe Powered</h3>
                <p className="text-sm text-gray-600">
                  Payments processed by Stripe, trusted by millions of businesses worldwide.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tax Deductible</h3>
                <p className="text-sm text-gray-600">
                  All donations are tax-deductible and you'll receive an official receipt.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Direct Impact</h3>
                <p className="text-sm text-gray-600">
                  100% of your donation goes directly to our programs and services.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
