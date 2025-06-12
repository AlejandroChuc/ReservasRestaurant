export default function Home({ onBook }: { onBook: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#2C3E50]">
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div className="mt-16 mb-10">
          <div className="border-4 border-white p-8 rounded-md">
            <span className="text-white text-5xl font-light tracking-widest block text-center">RCD</span>
            <span className="text-white text-lg font-light block text-center mt-2 tracking-widest">HOTELS</span>
          </div>
        </div>
        {/* Botón */}
        <button
          onClick={onBook}
          className="bg-[#C4912E] hover:bg-[#b07e1d] text-black font-semibold text-xl px-12 py-4 rounded-lg border-2 border-black shadow transition"
        >
          Book Now
        </button>
      </div>
      {/* Footer */}
      <footer className="bg-black text-white flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="bg-black p-2">
            <span className="text-xs font-light">RCD</span>
          </div>
          <div className="bg-[#22313A] px-4 py-1 ml-2 rounded">
            <span className="text-[#8ec6e6] text-xs font-semibold tracking-widest">
              CORPORACIÓN INMOBILIARIA KTRC, S.A. DE C.V.
            </span>
          </div>
        </div>
        <div className="text-right text-xs leading-tight">
          Blvd. Kukulcan Km 14, Zona Hotelera<br />
          Cancun, Quintana Roo 77500<br />
          Mexico<br />
          Reservations: 800-681-9205
        </div>
      </footer>
    </div>
  );
}