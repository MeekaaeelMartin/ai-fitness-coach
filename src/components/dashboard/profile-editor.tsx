"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import type { AssessmentData } from "@/lib/types/assessment";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";

interface ProfileEditorProps {
  assessment: AssessmentData;
}

export function ProfileEditor({ assessment }: ProfileEditorProps) {
  const { updateAssessment } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(assessment);

  const handleSave = () => {
    updateAssessment(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(assessment);
    setEditing(false);
  };

  if (!editing) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Edit Profile</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
        <p className="text-sm text-foreground/50">
          Keep your stats up to date so your plan stays accurate. Tap edit to change age, weight, and more.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Edit Profile</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Age"
          type="number"
          value={form.age || ""}
          onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
        />
        <Input
          label="Height (cm)"
          type="number"
          value={form.height || ""}
          onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
        />
        <Input
          label="Weight (kg)"
          type="number"
          value={form.weight || ""}
          onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
        />
        <Input
          label="Target Weight (kg)"
          type="number"
          value={form.targetWeight || ""}
          onChange={(e) => setForm({ ...form, targetWeight: Number(e.target.value) })}
        />
        <Input
          label="Daily Food Budget (R)"
          type="number"
          value={form.dailyFoodBudget || ""}
          onChange={(e) => setForm({ ...form, dailyFoodBudget: Number(e.target.value) })}
        />
        <Select
          label="Activity Level"
          value={form.activityLevel}
          onChange={(e) => setForm({ ...form, activityLevel: e.target.value as AssessmentData["activityLevel"] })}
          options={[
            { value: "sedentary", label: "Sedentary" },
            { value: "lightly-active", label: "Lightly Active" },
            { value: "moderately-active", label: "Moderately Active" },
            { value: "very-active", label: "Very Active" },
          ]}
        />
        <Input
          label="Days Per Week"
          type="number"
          min={1}
          max={7}
          value={form.daysPerWeek || ""}
          onChange={(e) => setForm({ ...form, daysPerWeek: Number(e.target.value) })}
        />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">Allergies</label>
          <textarea
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            rows={2}
            placeholder="List any food allergies, or type 'None'"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          />
        </div>
      </div>
    </GlassCard>
  );
}
