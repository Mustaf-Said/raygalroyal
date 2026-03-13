"use client"

import { motion } from "framer-motion"
import { CreditCard, ShoppingCart, ShieldCheck } from "lucide-react"

export default function PaymentIntegration() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Secure Payment Integration
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            We integrate world-class payment gateways to ensure your customers can pay safely and easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* STRIPE EXAMPLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-950 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="text-3xl font-bold text-indigo-600">Stripe</div>
              <CreditCard className="w-8 h-8 text-indigo-600" />
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <div className="text-sm font-bold text-gray-400 uppercase mb-4">Card Details</div>
                <div className="h-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center px-4 text-gray-400">
                  •••• •••• •••• ••••
                </div>
              </div>
              
              <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                Pay with Stripe
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                SECURE STRIPE CHECKOUT
              </div>
            </div>
          </motion.div>

          {/* PAYPAL EXAMPLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-950 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="text-3xl font-bold text-blue-600">PayPal</div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-center">
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Checkout with one click</p>
                <div className="text-sm text-gray-400">Fast and secure checkout using your PayPal account.</div>
              </div>
              
              <button className="w-full py-4 bg-[#FFC439] text-gray-900 font-black rounded-2xl hover:bg-[#E1AD2A] transition-all">
                PayPal
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                PROTECTED BY PAYPAL
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
