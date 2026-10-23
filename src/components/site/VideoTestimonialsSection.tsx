import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Star,
  CheckCircle2,
  Maximize2,
  Quote,
  Sparkles,
  ChevronDown,
  X,
  ShoppingBag,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  outfit: string;
  quote: string;
  fullReview: string;
  rating: number;
  videoSrc: string;
  verified: boolean;
  date: string;
}

const TESTIMONIALS_DATA: VideoTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Pooja Singhania",
    location: "New Delhi",
    outfit: "Pure Zari Banarasi Bridal Saree",
    quote: "The richness of the handloom weave and authentic gold zari made my wedding celebration unforgettable.",
    fullReview:
      "I ordered my bridal Banarasi saree directly from LaMoksh. The craftsmanship, the soft drape of pure silk, and the rich gold zari luster completely exceeded my expectations. Everyone at our reception complimented the royal look!",
    rating: 5,
    videoSrc: "/testimonials/testimonial_1.mp4",
    verified: true,
    date: "October 2026",
  },
  {
    id: "testimonial-2",
    name: "Ananya Verma",
    location: "Mumbai",
    outfit: "Maheshwari Tissue Silk Ensemble",
    quote: "So light, breathable, yet royal. You can feel the master weaver's passion in every single thread.",
    fullReview:
      "Finding authentic handloom silk that feels light enough for Mumbai's climate while looking completely regal is rare. LaMoksh made it effortless. The drape is spectacular and the fabric flows like a dream.",
    rating: 5,
    videoSrc: "/testimonials/testimonials_2.mp4",
    verified: true,
    date: "October 2026",
  },
  {
    id: "testimonial-3",
    name: "Dr. Radhika Kothari",
    location: "Jaipur",
    outfit: "Handcrafted Royal Festive Suit Set",
    quote: "Wearing LaMoksh felt like wearing heritage art. The detailing on the borders and neckline is exceptional.",
    fullReview:
      "Coming from Jaipur, I have high standards for handwoven textiles and embroidery. The handwork on this suit set is extraordinary. It fits like a glove and feels comfortable throughout long family functions.",
    rating: 5,
    videoSrc: "/testimonials/testimonials_3.mp4",
    verified: true,
    date: "September 2026",
  },
  {
    id: "testimonial-4",
    name: "Simran Kaur Bajaj",
    location: "Bengaluru",
    outfit: "Contemporary Hand-Painted Fusion Set",
    quote: "The bespoke fit and the finesse of the hand-finishing is simply unparalleled.",
    fullReview:
      "I was looking for a fusion ensemble for a pre-wedding cocktail. The hand-painted motifs and delicate zari work turned heads all night. Prompt customer care and beautifully packed delivery too!",
    rating: 5,
    videoSrc: "/testimonials/testimonials_4.mp4",
    verified: true,
    date: "September 2026",
  },
  {
    id: "testimonial-6",
    name: "Meera Rajput",
    location: "Ahmedabad",
    outfit: "Heirloom Chanderi & Zari Dupatta Edit",
    quote: "The richness of the fabric and intricate motifs make it an heirloom piece for generations.",
    fullReview:
      "This is my third purchase from LaMoksh. The authenticity of the weave and natural dyes never cease to amaze me. True heirloom luxury that I look forward to passing down to my daughter.",
    rating: 5,
    videoSrc: "/testimonials/testimonials_6.mp4",
    verified: true,
    date: "August 2026",
  },
  {
    id: "testimonial-lamkosh-1",
    name: "Sneha Mathur",
    location: "Kolkata",
    outfit: "Custom Festive Celebration Edit",
    quote: "From custom consultation to doorstep delivery, the experience was truly five stars.",
    fullReview:
      "The LaMoksh team guided me on video call to choose the perfect weave and customized the blouse piece to perfection. The packaging and handwritten care note was such a heartfelt touch.",
    rating: 5,
    videoSrc: "/testimonials/lamkosh_1.mp4",
    verified: true,
    date: "August 2026",
  },
  {
    id: "testimonial-lamkosh-2",
    name: "Kavita Iyer",
    location: "Chennai",
    outfit: "Grand Temple Zari Kanjeevaram & Silk",
    quote: "Exquisite luster and immaculate weave weight. True heritage craftsmanship.",
    fullReview:
      "A masterpiece in every sense. The temple motifs and rich borders are woven with incredible precision. LaMoksh has become my favorite luxury ethnic house.",
    rating: 5,
    videoSrc: "/testimonials/lamkosh_2.mp4",
    verified: true,
    date: "July 2026",
  },
  {
    id: "testimonial-5",
    name: "Tanvi Sethi",
    location: "Chandigarh",
    outfit: "Brocade Weave Festive Kurta Set",
    quote: "The quality is even better in person than on camera. Truly premium handloom.",
    fullReview:
      "I was hesitant to buy luxury clothing online, but LaMoksh completely won my trust. The fabric feels luxurious against the skin and the silhouette is supremely flattering.",
    rating: 5,
    videoSrc: "/testimonials/testimonials_5.mp4",
    verified: true,
    date: "July 2026",
  },
];

interface TestimonialCardProps {
  testimonial: VideoTestimonial;
  activeAudioId: string | null;
  onToggleAudio: (id: string) => void;
  onOpenModal: (t: VideoTestimonial) => void;
}

function TestimonialCard({
  testimonial,
  activeAudioId,
  onToggleAudio,
  onOpenModal,
}: TestimonialCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isMuted = activeAudioId !== testimonial.id;

  // Sync mute state to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Autoplay and Intersection Observer (pauses off-screen for performance)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAudio(testimonial.id);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onOpenModal(testimonial)}
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-md border border-[#E7E5E4] bg-[#1C1917] shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[#6B1D2F]/60 hover:shadow-2xl"
    >
      {/* Autoplay Video Tag */}
      <video
        ref={videoRef}
        src={testimonial.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          !isLoaded && "opacity-0",
        )}
      />

      {/* Loading Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#241F1D] text-stone-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-500 border-t-white" />
          <span className="mt-3 text-xs tracking-widest uppercase">Loading Video...</span>
        </div>
      )}

      {/* Luxury Cinematic Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/45" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
        {/* Verified Patron Badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[0.65rem] font-medium tracking-wider text-white backdrop-blur-md border border-white/10">
          <CheckCircle2 className="h-3 w-3 text-[#E8C287]" />
          <span className="uppercase">Verified Patron</span>
        </div>

        {/* Audio / Sound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          aria-label={isMuted ? "Unmute video testimonial" : "Mute video testimonial"}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-medium backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm",
            isMuted
              ? "bg-black/50 text-white/90 hover:bg-black/70 hover:text-white border border-white/15"
              : "bg-[#6B1D2F] text-white border border-[#8B2238] shadow-[0_0_12px_rgba(107,29,47,0.6)] animate-pulse",
          )}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tap for sound</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5 text-[#E8C287]" />
              <span className="font-semibold">Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* Play / Pause Floating Center Hover Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3.5 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-[#6B1D2F]/80"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
      </button>

      {/* Expand / Watch Fullscreen Button at Bottom-Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenModal(testimonial);
        }}
        aria-label="View full testimonial details"
        className="absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#1C1917]"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      {/* Bottom Content: Name, Rating, Quote & Outfit */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 pr-12 text-white">
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
          ))}
          <span className="ml-1.5 text-[0.7rem] font-semibold text-amber-200">5.0</span>
        </div>

        {/* Customer Name */}
        <h3 className="font-serif text-lg font-medium leading-tight text-white drop-shadow-sm sm:text-xl">
          {testimonial.name}
        </h3>

        {/* Location & Outfit Tag */}
        <p className="mt-1 text-[0.72rem] tracking-wide text-white/80 font-sans">
          <span className="text-[#E8C287] font-medium">{testimonial.location}</span>
          <span className="mx-1.5 opacity-60">•</span>
          <span className="text-stone-300 line-clamp-1">{testimonial.outfit}</span>
        </p>

        {/* Customer Quote Snippet */}
        <p className="mt-2.5 font-sans text-xs italic leading-relaxed text-stone-200/90 line-clamp-2">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Tap to Watch pill */}
        <div className="mt-3 inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-wider text-amber-300 group-hover:text-white transition-colors">
          <span>Read Full Story</span>
          <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
}

export function VideoTestimonialsSection() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [selectedModalTestimonial, setSelectedModalTestimonial] =
    useState<VideoTestimonial | null>(null);
  const [showAll, setShowAll] = useState(false);

  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isModalMuted, setIsModalMuted] = useState(false);

  // By default display 6 videos (2 rows of 3). If showAll is true, display all 8.
  const displayedTestimonials = showAll
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.slice(0, 6);

  const handleToggleAudio = (id: string) => {
    setActiveAudioId((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = (t: VideoTestimonial) => {
    // Mute any card audio when opening the modal
    setActiveAudioId(null);
    setIsModalMuted(false);
    setSelectedModalTestimonial(t);
  };

  const handleCloseModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setSelectedModalTestimonial(null);
  };

  return (
    <section
      id="testimonials"
      aria-label="Customer Video Testimonials"
      className="border-t border-[#E7E5E4] bg-[#FAF8F5]/50 py-20 md:py-28"
    >
      <div className="container-lux">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6B1D2F]/20 bg-[#6B1D2F]/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B1D2F]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real Patron Experiences</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-normal text-[#1C1917] sm:text-4xl md:text-5xl">
              Cherished in Every Thread
            </h2>

            <p className="mt-4 font-sans text-sm leading-relaxed text-[#57534E] sm:text-base">
              Listen to authentic stories from women across India who celebrated their weddings,
              festivals, and milestone occasions in handcrafted LaMoksh creations.
            </p>

            {/* Trust Metric Badge */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-600 sm:gap-8">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#FBBF24]" />
                  ))}
                </div>
                <span className="font-semibold text-[#1C1917]">4.95 / 5.0</span>
                <span>(1,250+ Patrons)</span>
              </div>
              <span className="hidden sm:inline text-stone-300">|</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1D2F]" />
                <span>100% Certified Pure Silk</span>
              </div>
              <span className="hidden sm:inline text-stone-300">|</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1D2F]" />
                <span>Pan-India & Global Delivery</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 3 Videos in a Row Grid */}
        <div className="mt-14 md:mt-18">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-7 lg:gap-8">
            {displayedTestimonials.map((testimonial, idx) => (
              <Reveal key={testimonial.id} delay={(idx % 3) * 100}>
                <TestimonialCard
                  testimonial={testimonial}
                  activeAudioId={activeAudioId}
                  onToggleAudio={handleToggleAudio}
                  onOpenModal={handleOpenModal}
                />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Toggle Show More Stories Button */}
        {TESTIMONIALS_DATA.length > 6 && (
          <div className="mt-12 text-center md:mt-16">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 border border-[#6B1D2F] bg-white px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6B1D2F] shadow-sm transition-all hover:bg-[#6B1D2F] hover:text-white cursor-pointer"
            >
              <span>{showAll ? "Show Fewer Stories" : `View All Stories (${TESTIMONIALS_DATA.length})`}</span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform duration-300", showAll && "rotate-180")}
              />
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Full Customer Story & Video Playback with Sound */}
      {selectedModalTestimonial && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in-0 duration-200"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-[#1C1917] text-white shadow-2xl md:flex-row max-h-[92vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close testimonial dialog"
              className="absolute right-3.5 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#6B1D2F] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: Video Player */}
            <div className="relative aspect-[9/16] w-full bg-black md:w-1/2 max-h-[50vh] md:max-h-[82vh]">
              <video
                ref={modalVideoRef}
                src={selectedModalTestimonial.videoSrc}
                autoPlay
                controls
                playsInline
                muted={isModalMuted}
                className="h-full w-full object-contain md:object-cover"
              />

              {/* Sound Toggle in modal */}
              <button
                type="button"
                onClick={() => setIsModalMuted((prev) => !prev)}
                className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80 cursor-pointer"
              >
                {isModalMuted ? (
                  <>
                    <VolumeX className="h-4 w-4 text-amber-300" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 text-emerald-400" />
                    <span>Sound On</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Detailed Customer Testimonial & Outfit Info */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 md:p-8 bg-[#241F1D]">
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(selectedModalTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                    <span className="ml-2 font-mono text-xs font-bold text-amber-300">5.0 / 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-[0.7rem] uppercase tracking-wider text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                {/* Patron Name & City */}
                <h3 className="mt-5 font-serif text-2xl font-normal text-white sm:text-3xl">
                  {selectedModalTestimonial.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-[#E8C287]">
                  {selectedModalTestimonial.location} • {selectedModalTestimonial.date}
                </p>

                {/* Outfit Attire Badge */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-1.5 text-xs text-stone-200">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#E8C287]" />
                  <span className="font-medium text-white">{selectedModalTestimonial.outfit}</span>
                </div>

                {/* Full Quote and Review */}
                <div className="relative mt-6 rounded-md bg-black/25 p-5 border border-white/5">
                  <Quote className="h-6 w-6 text-[#6B1D2F] opacity-75 mb-2" />
                  <p className="font-sans text-sm leading-relaxed text-stone-200">
                    {selectedModalTestimonial.fullReview}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <a
                  href="#clothing-catalog"
                  onClick={handleCloseModal}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-[#6B1D2F] px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#8B2238]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Explore Collection</span>
                </a>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    `Hello LaMoksh, I loved ${selectedModalTestimonial.name}'s testimonial for ${selectedModalTestimonial.outfit}. Could you share more details?`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
                >
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
