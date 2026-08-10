import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { galleryService } from "@/services/api";
import { GALLERY_PREVIEW } from "@/data/home";
import SectionHeading from "./SectionHeading";
import { Button } from "@/components/common/Button";
import { fadeUp, staggerContainer } from "@/utils/motion";

/** Small photo grid teasing the full gallery page — API driven with demo fallback. */
export default function GalleryPreview() {
  const { data } = useQuery({
    queryKey: ["gallery", "preview"],
    queryFn: () => galleryService.list(),
    retry: 0,
    staleTime: 60_000,
  });

  const photos: string[] =
    Array.isArray(data) && data.length
      ? data.slice(0, 7).map((g) => g.src)
      : GALLERY_PREVIEW;

  return (
    <section className="bg-muted/50 py-24">
      <div className="container-tp">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments from the trail"
          subtitle="Snapshots sent in by travellers on recent departures."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {photos.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              className={`overflow-hidden rounded-3xl shadow-card ${i % 3 === 0 ? "lg:row-span-2 lg:aspect-[3/4]" : "aspect-square"}`}
            >
              <img
                src={src}
                alt="Traveller photo from a TrekVista departure"
                loading="lazy"
                width={1024}
                height={768}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/gallery">
            <Button variant="outline">Open full gallery</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
