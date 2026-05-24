"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchSiteSettings, type SiteSettings } from "@/services/settings.service";
import { adminSaveSiteSettings } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function SettingsPanel() {
  const token = useAdmin((s) => s.token);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }
  function updateSocial(key: keyof SiteSettings["social"], value: string) {
    setSettings((s) => (s ? { ...s, social: { ...s.social, [key]: value } } : s));
  }
  function updateHero(key: keyof SiteSettings["hero"], value: string) {
    setSettings((s) => (s ? { ...s, hero: { ...s.hero, [key]: value } } : s));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !settings) return;
    setSaving(true);
    setError(null);
    try {
      await adminSaveSiteSettings(token, settings);
      setSavedAt(Date.now());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex justify-center py-10 text-navy-600">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-6 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-soft">
      <div>
        <h2 className="font-display text-lg font-bold text-navy-900">Site settings</h2>
        <p className="text-sm text-ink/50">
          These appear in the footer, contact page and SEO. Changes go live within ~30 seconds.
        </p>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">Brand</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Brand name</Label>
            <Input value={settings.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Description (shown in footer & SEO)</Label>
          <Textarea rows={2} value={settings.description} onChange={(e) => update("description", e.target.value)} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <Label>Working hours</Label>
            <Input value={settings.hours} onChange={(e) => update("hours", e.target.value)} />
          </div>
          <div>
            <Label>Address label</Label>
            <Input value={settings.addressLabel} onChange={(e) => update("addressLabel", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Full address</Label>
          <Textarea rows={2} value={settings.address} onChange={(e) => update("address", e.target.value)} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">Homepage hero — floating card</legend>
        <p className="text-xs text-ink/50">
          The small glass card on the right of the hero (above &ldquo;Plan Your Trip&rdquo;).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Eyebrow line (small grey text)</Label>
            <Input value={settings.hero.designerEyebrow}
              onChange={(e) => updateHero("designerEyebrow", e.target.value)}
              placeholder="Your designer is online" />
          </div>
          <div>
            <Label>Main line (bold white text)</Label>
            <Input value={settings.hero.designerTitle}
              onChange={(e) => updateHero("designerTitle", e.target.value)}
              placeholder="Plan a bespoke trip in minutes" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">Public page sections</legend>
        <label className="flex items-start gap-3 rounded-xl border border-navy-700/10 bg-mist/40 p-3">
          <input
            type="checkbox"
            checked={settings.internationalEnabled}
            onChange={(e) => update("internationalEnabled", e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span className="text-sm">
            <span className="font-medium text-navy-900">Show International trips section</span>
            <span className="block text-ink/55">
              When off, the Packages page hides the International section — visitors only see Domestic trips.
            </span>
          </span>
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">Social links</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["instagram", "facebook", "twitter", "linkedin", "youtube"] as const).map((key) => (
            <div key={key}>
              <Label className="capitalize">{key}</Label>
              <Input value={settings.social[key]} onChange={(e) => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/your-handle`} />
            </div>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-rose-500">{error}</p>}
      {savedAt && !error && (
        <p className="text-sm font-medium text-emerald-600">Saved ✓ — changes go live within ~30 seconds.</p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
