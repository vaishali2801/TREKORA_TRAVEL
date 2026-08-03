import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiStar } from "react-icons/fi";
import { TESTIMONIALS } from "@/data/home";
import SectionHeading from "./SectionHeading";

/** Traveller testimonials carousel. */
export default function Testimonials() {
  return (
    <section className="container-tp py-24">
      <SectionHeading
        eyebrow="Reviews"
        title="Loved by 18,000+ travellers"
        subtitle="Real words from people who walked the trails with us."
      />

      <div className="mt-12">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          className="!pb-14"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.name} className="h-auto">
              <figure className="flex h-full flex-col rounded-3xl bg-card p-7 shadow-soft">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-ocean font-semibold text-primary-foreground">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.trip}</span>
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
