import React from 'react';
import { motion } from 'framer-motion';

export function StoryContainer() {
  return (
    <div className="relative w-full text-white bg-[#0c0604] pb-24 md:pb-32 font-body overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583307567848-038222eb611a?q=80&w=2000&auto=format&fit=crop" 
            alt="Hands with mehndi" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0604]/90 via-[#0c0604]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0604]" />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-body text-[11px] sm:text-[13px] uppercase tracking-[0.4em] text-[#C19A5B] mb-6">Our Story</p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-bold text-white leading-[0.9] tracking-tighter">
              Where it <br />
              <span className="text-white/80 italic font-light md:ml-16">all began.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Artist Story */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 relative z-10">
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-white">
              It started with my <span className="italic text-white/60">nani's</span> hands.
            </h2>
            <div className="w-12 h-px bg-[#C19A5B] mb-6" />
            <div className="space-y-6 font-body text-sm md:text-base text-white/70 leading-relaxed font-light relative z-10 backdrop-blur-sm lg:backdrop-blur-none bg-[#0c0604]/40 lg:bg-transparent p-4 lg:p-0 rounded-xl">
              <p>
                In the courtyards of Jaipur, henna wasn't just a paste - it was a ritual. I remember watching my grandmother effortlessly draw vines that seemed to breathe life onto the skin.
              </p>
              <p>
                She had this unspoken intuition, a way of reading a bride's personality before she even picked a design. The quiet brides got delicate, intricate lace. The bold ones got statement peacocks and sprawling lotus motifs.
              </p>
              <p>
                That intuition is the foundation of Aakriti. Today, I bring that same blend of traditional intricacy and modern flow to every bride I meet.
              </p>
            </div>
            <p className="font-body text-[10px] text-[#C19A5B] uppercase tracking-widest mt-8">Aakriti, Lead Artist & Founder</p>
          </motion.div>
          
          <div className="order-1 lg:order-2 relative h-[450px] md:h-[550px] w-full mt-10 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: 0 }} 
              whileInView={{ opacity: 1, y: 0, rotate: -6 }} 
              transition={{ duration: 0.8 }}
              viewport={{ once: true }} 
              className="absolute top-0 right-4 md:right-10 w-2/3 md:w-[70%] shadow-2xl z-0"
            >
              <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800" alt="Mehndi art" className="w-full aspect-[4/5] object-cover rounded-2xl filter contrast-[1.1] grayscale-[20%]" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, rotate: 0 }} 
              whileInView={{ opacity: 1, y: 0, rotate: 4 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }} 
              className="absolute bottom-0 left-0 md:-left-4 w-2/3 md:w-[65%] shadow-2xl z-10"
            >
              <img src="https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=800" alt="Mehndi hands" className="w-full aspect-square object-cover rounded-[3rem] filter contrast-125" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Artist Story - Part 2 */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-24 md:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative h-[400px] md:h-[500px] w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: 0 }} 
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }} 
              transition={{ duration: 0.8 }}
              viewport={{ once: true }} 
              className="absolute top-0 left-0 lg:-left-4 w-[80%] md:w-[75%] shadow-2xl z-10"
            >
              <img src="https://images.unsplash.com/photo-1596455607316-562a1290bbcc?q=80&w=800" alt="Early sketches" className="w-full aspect-[4/3] object-cover rounded-[2rem] filter grayscale-[30%]" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: 0 }} 
              whileInView={{ opacity: 1, y: 0, rotate: 5 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }} 
              className="absolute bottom-0 right-4 lg:-right-4 w-[50%] md:w-[45%] shadow-2xl z-20"
            >
              <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800" alt="Practicing" className="w-full aspect-[3/4] object-cover rounded-[2.5rem] filter contrast-[1.1]" />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative z-10 bg-[#0c0604]/60 backdrop-blur-md lg:bg-transparent p-4 lg:p-0 rounded-xl">
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-white">
              The years of <span className="italic text-white/60">obsession.</span>
            </h2>
            <div className="w-12 h-px bg-[#C19A5B] mb-6" />
            <div className="space-y-6 font-body text-sm md:text-base text-white/70 leading-relaxed font-light">
              <p>
                Those early days weren't just about drawing flowers on skin. It was an absolute obsession with symmetry, proportion, and flow. I'd cover reams of tracing paper until the lines felt like second nature.
              </p>
              <p>
                My first true test was my sister's wedding. I was nervous, my hands trembling as I held the cone. But the moment the paste hit the skin, everything went silent. Five hours later, I had created my first bridal masterpiece. 
              </p>
              <p>
                That was the moment I realized this wasn't a hobby. It was my calling. I began taking bookings, traveling by local trains with my small henna kit, building the foundation of what Aakriti is today.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Collective Starts */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-32 md:mt-48">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-20">
          <p className="font-body text-[11px] uppercase tracking-[0.4em] text-[#C19A5B] mb-6">The Expansion</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto leading-tight text-white">
            One artist's vision became <span className="italic text-white/60">a collective.</span>
          </h2>
        </motion.div>

        <div className="space-y-32 md:space-y-40">
          {/* Artist 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }} 
                whileInView={{ opacity: 1, scale: 1, rotate: -5 }} 
                transition={{ duration: 0.8 }}
                viewport={{ once: true }} 
                className="absolute top-4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-0 w-[280px] md:w-[360px] z-10 shadow-2xl"
              >
                <img src="https://images.unsplash.com/photo-1596455607316-562a1290bbcc?q=80&w=800" alt="Geometric mehndi" className="w-full aspect-square object-cover rounded-full filter grayscale-[40%]" />
                <div className="absolute -bottom-8 -right-4 w-40 h-40 bg-[#982820]/30 rounded-full blur-3xl -z-10" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -30, rotate: 0 }} 
                whileInView={{ opacity: 1, x: 0, rotate: 8 }} 
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }} 
                className="absolute bottom-4 right-4 md:right-16 lg:right-4 w-[200px] md:w-[250px] z-20 shadow-2xl hidden sm:block"
              >
                <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800" alt="Detail" className="w-full aspect-[3/4] object-cover rounded-[2rem] filter contrast-[1.1]" />
              </motion.div>
            </div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative z-30 bg-[#0c0604]/60 backdrop-blur-md lg:bg-transparent p-4 lg:p-0 rounded-xl">
              <h3 className="font-display text-3xl md:text-4xl mb-4 text-white">Maya Joins the Fold</h3>
              <p className="font-body text-sm md:text-base text-white/70 leading-relaxed font-light mb-6">
                As the demand grew, the need for diverse styles became apparent. In 2018, Maya joined Aakriti. Her specialty? Bold, geometric Arabic designs that broke the mold of traditional Indian motifs. She brought a modern architectural edge to the collective.
              </p>
              <p className="font-body text-[10px] text-white/40 uppercase tracking-widest">Specialty: Modern Arabic & Geometric</p>
            </motion.div>
          </div>

          {/* Artist 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 relative z-30 bg-[#0c0604]/60 backdrop-blur-md lg:bg-transparent p-4 lg:p-0 rounded-xl">
              <h3 className="font-display text-3xl md:text-4xl mb-4 text-white">Priya's Minimalist Touch</h3>
              <p className="font-body text-sm md:text-base text-white/70 leading-relaxed font-light mb-6">
                Not every bride wants arms full of henna. Priya recognized the beauty in negative space. Joining in 2021, she perfected the art of the 'minimalist sitting' - tiny, perfect mandalas, fine finger detailing, and clean lines that look like delicate jewelry.
              </p>
              <p className="font-body text-[10px] text-white/40 uppercase tracking-widest">Specialty: Minimalist & Jewelry Mehndi</p>
            </motion.div>
            
            <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px] w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }} 
                whileInView={{ opacity: 1, scale: 1, rotate: 5 }} 
                transition={{ duration: 0.8 }}
                viewport={{ once: true }} 
                className="absolute top-0 right-4 lg:right-0 w-[280px] md:w-[350px] z-10 shadow-2xl"
              >
                <img src="https://images.unsplash.com/photo-1621008064972-2300bcfdecf8?q=80&w=800" alt="Minimalist mehndi" className="w-full aspect-[4/3] object-cover rounded-[3rem]" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: 0 }} 
                whileInView={{ opacity: 1, y: 0, rotate: -7 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }} 
                className="absolute bottom-4 left-4 md:left-12 lg:left-0 w-[220px] md:w-[280px] z-20 shadow-2xl hidden sm:block"
              >
                <img src="https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=800" alt="Detail" className="w-full aspect-[4/5] object-cover rounded-2xl filter grayscale-[10%]" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Vow */}
      <section className="w-full max-w-4xl mx-auto px-6 mt-32 md:mt-48 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-16 h-16 rounded-full border border-[#C19A5B]/30 mx-auto flex items-center justify-center mb-8">
            <div className="w-2 h-2 rounded-full bg-[#C19A5B]" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 text-white">
            "More than ink on skin. It's an inheritance of beauty."
          </h2>
          <p className="font-body text-[13px] md:text-[15px] text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Today, the Aakriti Collective is a family of master artists. We travel across the country, turning fleeting hours into lifelong memories. We vow to never lose the intimacy of that very first sitting in Jaipur.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
