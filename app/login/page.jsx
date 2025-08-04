"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to dashboard or intended page
        router.push("/dashboard");
      } else {
        setFormError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6 shadow-lg shadow-orange-500/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-100/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-orange-50 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 bg-orange-50 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-50 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a 
                href="/forgot-password" 
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {formError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Create account
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}