import { PageHeader } from "@/components/ui";
import { SiteApp } from "@/components/site/site-app";

const points = [
  { h: "Installs like an app", d: "Added to the home screen on any phone or tablet, with its own icon. Opens full screen, not in a browser." },
  { h: "Nothing to download", d: "No App Store or Google Play account, nothing for the team to update. Improvements just appear." },
  { h: "Works with no signal", d: "Time, photos, diary and sign-offs are kept on the phone and sent as soon as signal returns, with a count of anything waiting." },
];

export default function SitePage() {
  return (
    <>
      <PageHeader
        kicker="Site app · progressive web app"
        title="Built for poor signal on rural sites"
        subtitle="Site managers and subcontractors get only what they need on site. Try the “Simulate no signal” switch."
      />
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        {/* Phone frame on larger screens; full width on phones */}
        <div className="-mx-4 w-[calc(100%+2rem)] sm:mx-auto sm:w-full sm:max-w-[390px] lg:mx-0">
          <div className="overflow-hidden sm:rounded-[2.2rem] sm:bg-[#1A2123] sm:p-2.5 sm:shadow-[0_18px_40px_rgba(31,31,31,0.25)]">
            <div className="overflow-hidden sm:rounded-[1.7rem]">
              <div className="hidden h-5 items-center justify-center bg-[#14191A] sm:flex">
                <span className="h-1 w-14 rounded-full bg-[#3B4749]" />
              </div>
              <SiteApp />
            </div>
          </div>
        </div>
        <div className="w-full max-w-md space-y-3">
          {points.map((p) => (
            <div key={p.h} className="rounded-xl border border-hair border-t-[3px] border-t-lime bg-surface p-4">
              <div className="heading text-sm">{p.h}</div>
              <p className="mt-1 text-sm text-muted">{p.d}</p>
            </div>
          ))}
          <div className="rounded-xl border border-hair bg-surface-2 p-4 text-sm text-muted">
            <div className="heading mb-1 text-xs text-ink">The evidence gate</div>
            Works can&apos;t be signed off until the required photos are captured and everyone on site has signed onto the RAMS. No return trips, no missing
            records. Open the <span className="font-semibold text-ink">Capture</span> tab to try it.
          </div>
        </div>
      </div>
    </>
  );
}
