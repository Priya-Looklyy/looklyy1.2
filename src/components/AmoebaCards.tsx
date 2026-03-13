'use client';

import { motion } from 'framer-motion';

type CardConfig = {
  title: string;
  body: string;
};

const cards: CardConfig[] = [
  {
    title: 'Shopping online was supposed to be fun',
    body: 'Somewhere along the way it turned into endless scrolling, infinite trends, and confusing content everywhere.',
  },
  {
    title: "Finding cool trends that suit you shouldn't feel like work",
    body: "The best combinations are always hidden under algorithms, ads, and things you never asked to see.",
  },
  {
    title: 'We are fixing that quietly',
    body: 'Early members will be the first to experience Looklyy.',
  },
];

export function AmoebaCards() {
  return (
    <section className="bg-[#faf7fc] py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 lg:gap-10">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              className="group relative overflow-hidden rounded-[10px] shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="relative min-h-[220px] sm:min-h-[240px] overflow-hidden rounded-[10px]">
                {/* Front face – white card, purple headline */}
                <div className="absolute inset-0 flex items-center justify-center bg-white px-6 py-8 sm:py-10 transition-opacity duration-500 ease-out opacity-100 group-hover:opacity-0">
                  <h3
                    className="text-sm sm:text-base md:text-lg font-semibold text-center"
                    style={{
                      fontFamily:
                        '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      color: '#8f1eae',
                    }}
                  >
                    {card.title}
                  </h3>
                </div>

                {/* Back face – purple card, white supporting text */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#8f1eae] px-6 py-8 sm:py-10 transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-100">
                  <p
                    className="text-xs sm:text-sm leading-relaxed text-white text-center"
                    style={{
                      fontFamily:
                        '"TT Norms", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontWeight: 300,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

