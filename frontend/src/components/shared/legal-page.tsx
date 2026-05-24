import { PageHeader } from "./page-header";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={`Last updated ${updated}`}
        image="https://res.cloudinary.com/dzevugvgg/image/upload/v1779640605/lg-travels/site/images/1450101499163-c8848c66ca85.jpg"
        crumbs={[{ label: title }]}
      />
      <section className="container-lux max-w-3xl py-16 md:py-24">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={s.heading}>
              <h2 className="font-display text-xl font-bold text-navy-900">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink/70">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
