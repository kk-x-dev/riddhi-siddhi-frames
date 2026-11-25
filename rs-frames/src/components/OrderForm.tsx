"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { Product, OrderFormData } from "@/types/product";

interface OrderFormProps {
  selectedProduct: Product | null;
  onClose: () => void;
}

export default function OrderForm({ selectedProduct, onClose }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    mobile: "",
    selectedFrame: selectedProduct?.name || "",
    frameSize: selectedProduct?.sizes?.[0] || "",
    quantity: 1,
    cityPincode: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Please enter your name.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.selectedFrame) {
      newErrors.selectedFrame = "No frame selected.";
    }

    if (!formData.cityPincode.trim()) {
      newErrors.cityPincode = "Please enter your city or pincode.";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/whatsapp-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      window.open(data.url, "_blank");
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to send order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof OrderFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 25 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg md:text-xl font-bold">
            Order via WhatsApp
          </h2>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="cursor-pointer p-1 text-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Customer Name <span className="text-accent-secondary">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Your full name"
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-accent-secondary">
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Mobile Number <span className="text-accent-secondary">*</span>
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-accent-secondary">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Selected Frame — Read-only, auto-filled */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Selected Frame
            </label>
            <input
              type="text"
              value={formData.selectedFrame}
              readOnly
              className="w-full px-3 py-2.5 text-sm font-sans-deva bg-background border border-border text-foreground cursor-not-allowed opacity-75"
            />
            {errors.selectedFrame && (
              <p className="mt-1 text-xs text-accent-secondary">
                {errors.selectedFrame}
              </p>
            )}
          </div>

          {/* Frame Size */}
          {selectedProduct?.sizes && selectedProduct.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Frame Size
              </label>
              <select
                value={formData.frameSize}
                onChange={(e) => handleChange("frameSize", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                {selectedProduct.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Quantity <span className="text-accent-secondary">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) =>
                handleChange("quantity", parseInt(e.target.value) || 1)
              }
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-accent-secondary">
                {errors.quantity}
              </p>
            )}
          </div>

          {/* City / Pincode */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              City / Pincode <span className="text-accent-secondary">*</span>
            </label>
            <input
              type="text"
              value={formData.cityPincode}
              onChange={(e) => handleChange("cityPincode", e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g. Pune - 411001"
            />
            {errors.cityPincode && (
              <p className="mt-1 text-xs text-accent-secondary">
                {errors.cityPincode}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent resize-none transition-colors"
              placeholder="Delivery address (optional)"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Special Instructions
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border text-foreground placeholder:text-secondary focus:outline-none focus:border-accent resize-none transition-colors"
              placeholder="Any special instructions (optional)"
            />
          </div>

          {/* Error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-accent-secondary bg-accent-secondary/5"
            >
              <p className="text-xs text-accent-secondary">
                {submitError}
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-btn text-btn-text py-3.5 text-sm font-medium hover:bg-foreground hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Order via WhatsApp"
            )}
          </motion.button>

          <p className="text-center text-xs text-secondary">
            Your order will be sent via WhatsApp. You will need to press Send to confirm.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
