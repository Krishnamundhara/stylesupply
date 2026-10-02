"use client";

import { useCallback, useState } from "react";
import { profileApi } from "@/services/profile";
import { ApiError } from "@/services/api-client";
import toast from "react-hot-toast";

type FieldId = "current" | "new" | "confirm";

const FIELDS: { id: FieldId; label: string }[] = [
  { id: "current", label: "Current Password" },
  { id: "new", label: "New Password" },
  { id: "confirm", label: "Confirm New Password" },
];

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  visible: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-[2.778vw] md:gap-[1.302vw] lg:gap-[0.694vw]">
      <p className="font-[var(--font-manrope)] font-medium leading-[1.1] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.083vw] lg:text-[1.25vw]">
        {label}
      </p>
      <div className="flex w-full items-center justify-between gap-4 h-[44px]">
        <input
          type="text"
          value={visible ? value : "*".repeat(value.length)}
          onChange={(e) => {
            if (visible) {
              onChange(e.target.value);
            } else {
              const prev = value;
              const next = e.target.value;
              if (next.length < prev.length) {
                onChange(prev.slice(0, next.length));
              } else {
                const added = next.slice(prev.length);
                onChange(prev + added);
              }
            }
          }}
          placeholder=""
          className="flex-1 bg-transparent font-[var(--font-manrope)] font-medium leading-[1.1] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.083vw] lg:text-[1.25vw] outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="font-[var(--font-manrope)] font-semibold leading-[1.2] tracking-[-0.02em] text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw] shrink-0 transition-colors"
          style={{ color: visible ? "#757575" : "#7a021d" }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <div className="w-full border-b border-black/30" />
    </div>
  );
}

export default function ChangePasswordContent() {
  const [values, setValues] = useState<Record<FieldId, string>>({
    current: "",
    new: "",
    confirm: "",
  });
  const [visible, setVisible] = useState<Record<FieldId, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const set = useCallback(
    (id: FieldId) => (v: string) => setValues((prev) => ({ ...prev, [id]: v })),
    []
  );

  const toggle = useCallback(
    (id: FieldId) => () => setVisible((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  const handleApply = async () => {
    if (!values.current) {
      toast.error("Please enter your current password");
      return;
    }
    if (values.new.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (values.new !== values.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await profileApi.changePassword(values.new);
      toast.success("Password changed successfully");
      setValues({ current: "", new: "", confirm: "" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setValues({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="flex w-full min-w-0 flex-col px-[5.556vw] md:px-[15.278vw]">

      {/* Heading */}
      <div className="flex flex-col items-center text-center pt-[8.333vw] pb-[13.889vw] md:pt-[2.604vw] md:pb-[6.510vw]">
        <h1 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[4.444vw]">
          Change password
        </h1>
        <p className="font-[var(--font-manrope)] font-medium leading-[1.6] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.083vw] lg:text-[1.389vw] mt-[4.167vw] md:mt-[1.389vw]">
          Keep password updated for enhanced security
        </p>
      </div>

      {/* Fields */}
      <div className="flex w-full flex-col gap-[8.333vw] md:gap-[3.906vw] md:mx-auto md:w-[37.5vw] lg:gap-[2.083vw]">
        {FIELDS.map(({ id, label }) => (
          <PasswordField
            key={id}
            label={label}
            value={values[id]}
            visible={visible[id]}
            onChange={set(id)}
            onToggle={toggle(id)}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-[2.778vw] mt-[11.111vw] md:mt-[5.208vw] md:gap-[1.389vw]">
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full bg-[#7a021d] border border-[#7a021d] font-[var(--font-manrope)] font-semibold tracking-[-0.02em] text-white text-[3.889vw] disabled:opacity-50 md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
        >
          {loading ? "Saving..." : "Apply Changes"}
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={loading}
          className="flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] font-semibold tracking-[-0.02em] text-[#7a021d] text-[3.889vw] disabled:opacity-50 md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
        >
          Discard
        </button>
      </div>

    </div>
  );
}
