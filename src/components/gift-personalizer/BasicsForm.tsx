import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/personalizerTypes";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface BasicsFormProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const BasicsForm = ({
  formData,
  handleInputChange,
  setFormData,
}: BasicsFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">Tell us about the recipient</h2>
      <p className="text-muted-foreground mb-8">
        Let's start with some basic information about who you're shopping for.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient's Name</Label>
          <Input
            id="recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            placeholder="Who is this gift for?"
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter their city"
          />
        </div>

        <div>
          <Label htmlFor="relationship">Your Relationship</Label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, relationship: e.target.value }))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select relationship</option>
            <option value="partner">Partner/Spouse</option>
            <option value="friend">Friend</option>
            <option value="family">Family Member</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
          {formData.relationship === "other" && (
            <Input
              id="customRelationship"
              name="customRelationship"
              value={formData.customRelationship}
              onChange={handleInputChange}
              placeholder="Please specify your relationship"
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, occasion: e.target.value }))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="holiday">Holiday</option>
            <option value="graduation">Graduation</option>
            <option value="justbecause">Just Because</option>
            <option value="other">Other</option>
          </select>
          {formData.occasion === "other" && (
            <Input
              id="customOccasion"
              name="customOccasion"
              value={formData.customOccasion}
              onChange={handleInputChange}
              placeholder="Please specify the occasion"
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label htmlFor="budgetRange">Budget Range</Label>
          <div className="h-4" />
          <Slider
            min={0}
            max={100000}
            step={100}
            value={formData.budgetRange}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                budgetRange: val as [number, number],
              }))
            }
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span>₹1,00,000</span>
          </div>
          <div className="text-center mt-1">
            ₹{formData.budgetRange[0]} - ₹{formData.budgetRange[1]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicsForm;
