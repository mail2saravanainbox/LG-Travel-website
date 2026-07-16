"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchSiteSettings, type SiteSettings } from "@/services/settings.service";
import { adminSaveSiteSettings } from "@/services/admin.service";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { AlertDialog } from "@/components/ui/alert-dialog";

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
    if (!settings) return;
    if (!token) {
      setError("Your session has expired — please sign in again.");
      return;
    }
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
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">
          Homepage hero — Trending card
        </legend>
        <p className="text-xs text-ink/50">
          The larger glass card on the right of the hero (with the price + rating).
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Eyebrow</Label>
            <Input value={settings.hero.trendingEyebrow}
              onChange={(e) => updateHero("trendingEyebrow", e.target.value)}
              placeholder="Trending now" />
          </div>
          <div>
            <Label>Discount badge (optional)</Label>
            <Input value={settings.hero.trendingBadge}
              onChange={(e) => updateHero("trendingBadge", e.target.value)}
              placeholder="-14%  (leave blank to hide)" />
          </div>
          <div>
            <Label>Rating (optional)</Label>
            <Input value={settings.hero.trendingRating}
              onChange={(e) => updateHero("trendingRating", e.target.value)}
              placeholder="4.9  (leave blank to hide)" />
          </div>
          <div className="sm:col-span-2">
            <Label>Title</Label>
            <Input value={settings.hero.trendingTitle}
              onChange={(e) => updateHero("trendingTitle", e.target.value)}
              placeholder="Maldives Overwater Escape" />
          </div>
          <div>
            <Label>Price</Label>
            <Input value={settings.hero.trendingPrice}
              onChange={(e) => updateHero("trendingPrice", e.target.value)}
              placeholder="₹3,48,600" />
          </div>
          <div className="sm:col-span-3">
            <Label>Subtitle</Label>
            <Input value={settings.hero.trendingSubtitle}
              onChange={(e) => updateHero("trendingSubtitle", e.target.value)}
              placeholder="6 days · Private villa · Seaplane" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-navy-700">
          Homepage hero — Designer card
        </legend>
        <p className="text-xs text-ink/50">
          The small glass card below the Trending card.
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
          {(["instagram", "facebook", "linkedin"] as const).map((key) => (
            <div key={key}>
              <Label className="capitalize">{key}</Label>
              <Input value={settings.social[key]} onChange={(e) => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/your-handle`} />
            </div>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" variant="gold" size="lg" disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>

      <AlertDialog
        open={!!savedAt && !error}
        title="Changes saved successfully"
        description="Your changes go live on the website within ~30 seconds."
        onAction={() => setSavedAt(null)}
      />
    </form>
  );
}
