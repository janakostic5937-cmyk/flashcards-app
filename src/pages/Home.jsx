import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);

  const features = [
    {
      title: 'Smart Algoritam',
      description: 'Naš algoritam raspoređuje ponavljanje kartica u optimalnim sekundama, omogućavajući maksimalnu retenciju uz minimalan utrošak vremena.',
      bg: 'bg-[#00f0b5]',
      tag: 'Rasporedjivanje kartica',
    },
    {
      title: 'Kategorija Špilova',
      description: 'Kreirajte neograničeno špilova organizovanih po folderima. Prilagodite ih u potpunosti specifičnim zahtevima vašeg predmeta.',
      bg: 'bg-white',
      tag: 'Kategorizacija',
    },
    {
      title: 'Statistika',
      description: 'Pratite svoj napredak kroz grafikone. Saznajte koje kartice vam zadaju najviše muka i locirajte uska grla u svom znanju.',
      bg: 'bg-[#ffe600]',
      tag: 'Analitika progresa',
    },
  ];

  const stats = [
    { value: '15,000+', label: 'Aktivni korisnici' },
    { value: '1.2M+', label: 'Naučene kartice' },
    { value: '98%', label: 'Uspešnost na ispitima' },
    { value: 'NULA', label: 'Izgubljeno vreme' },
  ];


  return (
    <div className="w-full bg-[#ebebeb] text-black font-mono">

      {/* Hero Sekcija */}
      <section className="grid grid-cols-1 lg:grid-cols-12 border-b-4 border-black">

        {/* Leva strana: info */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-center space-y-8 bg-white">
          <div className="inline-flex w-max border-2 border-black bg-white px-3 py-1 text-xs font-black tracking-wider uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Flash Cards: Kartice za učenje
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
            Dizajnirano <br />
            za maksimalno <span className="text-[#ff4d00]">pamćenje</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base font-bold text-slate-800 leading-relaxed font-sans">
            Najnaprednija taktika za dugoročno memorisanje informacija. Korišćenje metode aktivnog prisećanja. Savladaj sve predmete!
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 border-2 border-black bg-[#ff4d00] text-sm font-black tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
            >
              Započni sesiju
            </Link>
            <a
              href="#specs"
              className="px-6 py-3.5 border-2 border-black bg-white text-sm font-black tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
            >
              Kako radi?
            </a>
          </div>
        </div>

        {/* Desna strana: Interaktivna kartica (Tirkizni kontejner) */}
        <div className="lg:col-span-5 p-8 lg:p-16 flex flex-col items-center justify-center bg-[#00f0b5] border-t-4 lg:border-t-0 lg:border-l-4 border-black">
          <div className="perspective-1000 w-full max-w-[340px] h-[240px]">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-full duration-500 preserve-3d cursor-pointer rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isFlipped ? 'rotate-y-180' : ''
                }`}
            >
              {/* Kartica */}
              <div className="absolute inset-0 w-full h-full bg-[#ffe600] backface-hidden p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b-2 border-black pb-2">
                  <span className="text-xs font-black tracking-wider uppercase">[ Pitanje ]</span>
                  <span className="text-[10px] font-bold">#1</span>
                </div>
                <div className="my-auto text-center">
                  <h3 className="text-2xl font-black tracking-tight leading-none uppercase">
                    Šta je "Aktivno prisećanje"?
                  </h3>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t-2 border-black pt-2 font-bold">
                </div>
              </div>

              {/* Kartica od iza */}
              <div className="absolute inset-0 w-full h-full bg-[#ff00ff] border-4 border-black rotate-y-180 backface-hidden p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b-2 border-black pb-2 text-white">
                  <span className="text-xs font-black tracking-wider uppercase">[ Odgovor ]</span>
                  <span className="text-[10px] font-bold"></span>
                </div>
                <div className="my-auto text-center text-white">
                  <p className="text-sm font-black leading-tight uppercase">
                    Proces aktivnog izvlačenja informacija iz memorije radi jačanja neuronskih veza (umesto pasivnog čitanja).
                  </p>
                </div>
                <div className="flex justify-center gap-1.5 pt-2 border-t-2 border-black/30">
                  <span className="px-2 py-0.5 border border-black bg-white text-black text-[9px] font-black">Teško</span>
                  <span className="px-2 py-0.5 border border-black bg-white text-black text-[9px] font-black">Lako</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs font-black uppercase text-black bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Klikni na karticu
          </p>
        </div>

      </section>

      {/* Specifikacija deo */}
      <section id="specs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 border-b-4 border-black pb-6 mb-16">
          <span className="h-8 w-2 bg-[#ff4d00]"></span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Specifikacije Sistema
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`border-4 border-black ${feature.bg} p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150`}
            >
              <div className="inline-block border-2 border-black bg-white text-black px-2 py-0.5 text-[10px] font-black mb-6">
                [{feature.tag}]
              </div>
              <h3 className="text-lg font-black tracking-tight leading-none uppercase mb-4 border-b-2 border-black pb-2">
                {feature.title}
              </h3>
              <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistika deo */}
      <section className="border-y-4 border-black bg-[#ff4d00] text-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`p-8 text-center flex flex-col justify-center items-center space-y-1 ${idx < stats.length - 1 ? 'sm:border-r-4 border-b-4 sm:border-b-0 border-black' : ''
                  }`}
              >
                <div className="text-4xl sm:text-5xl font-black tracking-tight uppercase leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black tracking-widest text-black/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* utisci deo */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 border-b-4 border-black pb-6 mb-16">
          <span className="h-8 w-2 bg-[#ffe600]"></span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Utisci korisnika
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold leading-relaxed text-slate-900 border-b-2 border-dashed border-black/20 pb-4 mb-4">
              "Konačno platforma za učenje koja ne troši moje resurse na dosadne animacije i komplikovan interfejs. Performanse pamćenja su prosto brutalne. Preporučujem svima koji spremaju teške ispite."
            </p>
            <div className="inline-block border-2 border-black bg-[#00f0b5] text-black px-2 py-0.5 text-[9px] font-black">
              Student Medicine
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold leading-relaxed text-slate-900 border-b-2 border-dashed border-black/20 pb-4 mb-4">
              "FlashMind je drastično optimizovao moje sesije ponavljanja koda i koncepata. Prepolovio sam vreme učenja novih biblioteka, dok je uspeh na testiranju dvostruko bolji. Brutalno, ali radi."
            </p>
            <div className="inline-block border-2 border-black bg-[#ff4d00] text-white px-2 py-0.5 text-[9px] font-black">
              Programer
            </div>
          </div>
        </div>
      </section>


      {/* Pretplata deo */}
      <section className="border-t-4 border-black bg-[#00f0b5] py-20 px-4">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Pridruži se
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm font-bold text-slate-900 leading-relaxed font-sans">
            Pretplati se i budi u toku sa nanjnovijim dešavanjima.
          </p>

          <div className="flex flex-col sm:flex-row max-w-md mx-auto border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <input
              type="email"
              placeholder="Unesite vaš email"
              className="w-full px-4 py-3 bg-white text-black text-xs font-black placeholder-slate-400 focus:outline-none"
            />
            <button className="bg-[#ff4d00] text-white text-xs font-black uppercase px-6 py-3 border-t-4 sm:border-t-0 sm:border-l-4 border-black hover:bg-white hover:text-black transition-colors duration-150">
              Pridruži se
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
