const EMBED_PARAMS = 'mute=1&playsinline=1&modestbranding=1&rel=0';

const SHORTS: { id: string; title: string }[] = [
  { id: 'CPEF4umOOjA', title: 'Looklyy — latest' },
  { id: 'aZcClLjvaGo', title: 'Looklyy intro' },
  { id: 'UeoDwEyETPQ', title: 'Looklyy' },
];

export function VideoShortsRow() {
  return (
    <section className="bg-[#faf7fc] pb-12 sm:pb-16" aria-label="Looklyy videos">
      <div className="mx-auto max-w-6xl">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-5 sm:px-6 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {SHORTS.map(({ id, title }) => (
            <div
              key={id}
              className="snap-start shrink-0 w-[min(88vw,360px)] border border-[#e5d7f0] bg-black shadow-[0_18px_50px_rgba(15,23,42,0.18)] overflow-hidden rounded-sm"
            >
              <div className="relative w-full" style={{ aspectRatio: '9/16', minHeight: '320px' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${id}?${EMBED_PARAMS}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-sm"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
