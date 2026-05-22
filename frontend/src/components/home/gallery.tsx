import Image from "next/image";
import { InstagramIcon } from "@/components/shared/social-icons";
import { SectionHeading } from "@/components/shared/section-heading";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const shots = [
  "photo-1505881502353-a1986add3762",
  "photo-1530122037265-a5f1f91d3b99",
  "photo-1518684079-3c830dcef090",
  "photo-1533105079780-92b9be482077",
  "photo-1518548419970-58e3b4079ab2",
  "photo-1545569341-9eb8b30979d9",
  "photo-1573843981267-be1999ff37cd",
  "photo-1527668752968-14dc70a27c95",
];

export function Gallery() {
  const row = [...shots, ...shots];
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="container-lux">
        <SectionHeading
          eyebrow="@lgtravels"
          title="Moments from our community"
          description="Tag your journey with #LGTravels for a chance to be featured."
        />
      </div>

      <div className="relative mt-12">
        <div className="flex w-max gap-4 animate-marquee">
          {row.map((id, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative h-56 w-56 shrink-0 overflow-hidden rounded-2xl md:h-64 md:w-64"
            >
              <Image
                src={img(id)}
                alt="Travel moment"
                fill
                sizes="256px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 grid place-items-center bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/40">
                <InstagramIcon className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
