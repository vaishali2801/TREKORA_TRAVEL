import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { packageService } from "@/services/api";
import { FALLBACK_PACKAGES, type PackageLike } from "@/data/home";
import PackageCard from "@/components/PackageCard";
import SectionHeading from "./SectionHeading";
import { Button } from "@/components/common/Button";

/** Featured packages carousel — API driven with graceful demo fallback. */
export default function FeaturedPackages() {
  const { data } = useQuery({
    queryKey: ["packages", "featured"],
    queryFn: () => packageService.featured(),
    retry: 0,
    staleTime: 60_000,
  });

  const list: PackageLike[] = Array.isArray(data) && data.length ? data : FALLBACK_PACKAGES;

  return (
    <section className="container-tp py-24">
      <SectionHeading
        eyebrow="Featured"
        title="Handpicked expeditions"
        subtitle="Our most-loved journeys, curated by expedition leaders and rated by thousands of travellers."
      />

      <div className="mt-12">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={list.length > 3}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="!pb-14"
        >
          {list.map((pkg) => (
            <SwiperSlide key={pkg._id} className="h-auto">
              <div className="h-full pb-2">
                <PackageCard pkg={pkg} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-4 text-center">
        <Link to="/packages">
          <Button variant="outline" size="lg">
            View all packages
          </Button>
        </Link>
      </div>
    </section>
  );
}
