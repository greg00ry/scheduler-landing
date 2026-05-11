import { useEffect, useRef, useState } from "react";
import {
  Clock,
  CalendarDays,
  AlertCircle,
  Users,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
} from "lucide-react";

const APP_URL = "https://scheduler-demo.gt-processing.com/login";

// --- Scroll animation hook ---
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// --- Scheduler mock ---
const DAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"];

interface MockShift {
  name: string;
  start: string;
  end: string;
}

const MOCK_DAYS: { date: number; weekend: boolean; shifts: MockShift[] }[] = [
  { date: 5,  weekend: false, shifts: [{ name: "Anna K.",  start: "08:00", end: "16:00" }, { name: "Marek W.", start: "12:00", end: "20:00" }] },
  { date: 6,  weekend: false, shifts: [{ name: "Julia S.", start: "08:00", end: "16:00" }] },
  { date: 7,  weekend: false, shifts: [{ name: "Anna K.",  start: "06:00", end: "14:00" }, { name: "Piotr B.", start: "12:00", end: "20:00" }] },
  { date: 8,  weekend: false, shifts: [{ name: "Marek W.", start: "08:00", end: "16:00" }, { name: "Julia S.", start: "16:00", end: "00:00" }] },
  { date: 9,  weekend: false, shifts: [{ name: "Piotr B.", start: "08:00", end: "16:00" }] },
  { date: 10, weekend: true,  shifts: [{ name: "Anna K.",  start: "08:00", end: "16:00" }] },
  { date: 11, weekend: true,  shifts: [] },
];

function SchedulerMock() {
  const totalShifts = MOCK_DAYS.reduce((sum, d) => sum + d.shifts.length, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 select-none text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900 text-lg">Nowy grafik</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <span className="px-3 py-1 rounded-md font-medium bg-white text-gray-900 shadow-sm text-sm">Tygodniowy</span>
            <span className="px-3 py-1 rounded-md font-medium text-gray-500 text-sm">Miesięczny</span>
          </div>
        </div>
        <X size={18} className="text-gray-400" />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-5">
        <button className="p-1.5 hover:bg-gray-100 rounded-lg opacity-30 cursor-default">
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-800 min-w-48 text-center">
          5 maj – 11 maj 2026
        </span>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {MOCK_DAYS.map((day, i) => (
          <div
            key={day.date}
            className={`rounded-xl border p-2 min-h-32 ${day.weekend ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"}`}
          >
            <div className="mb-2 text-center">
              <p className={`text-xs font-semibold uppercase tracking-wide ${day.weekend ? "text-gray-400" : "text-gray-600"}`}>
                {DAY_LABELS[i]}
              </p>
              <p className="text-lg font-bold text-gray-800 leading-none mt-0.5">{day.date}</p>
            </div>
            <div className="space-y-1">
              {day.shifts.map((shift) => (
                <div key={shift.name + shift.start} className="bg-blue-100 border border-blue-200 rounded-lg px-2 py-1">
                  <p className="text-xs font-medium text-blue-800 leading-tight truncate">
                    {shift.name}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center gap-0.5 mt-0.5">
                    <Clock size={9} />
                    {shift.start}–{shift.end}
                  </p>
                </div>
              ))}
            </div>
            {!day.weekend && (
              <button className="mt-1 w-full text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg py-1 flex items-center justify-center gap-0.5 transition-colors cursor-default">
                <Plus size={12} /> dodaj
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={15} className="text-gray-400" />
          5 maj – 11 maj 2026
          <span className="text-gray-300">·</span>
          Zmian: <span className="font-semibold text-gray-800">{totalShifts}</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-default">Anuluj</button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium cursor-default">
            Utwórz grafik
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Fade-in wrapper ---
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView(0);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    const update = () => setBannerHeight(bannerRef.current?.offsetHeight ?? 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 0. Banner demo */}
      <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-sm text-center py-2 px-4">
        <span className="hidden sm:inline">Wersja demonstracyjna — nie przeznaczona do użytku biznesowego. Dane mogą być resetowane bez powiadomienia.</span>
        <span className="sm:hidden">Wersja demo — dane mogą być resetowane bez powiadomienia.</span>
      </div>

      <div style={{ paddingTop: bannerHeight }}>
        {/* 1. Navbar — blur */}
        <nav style={{ top: bannerHeight }} className="sticky z-40 backdrop-blur-sm bg-white/80 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900 text-lg">Scheduler</span>
            </div>
            <a
              href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Zaloguj się
            </a>
          </div>
        </nav>

        {/* 2. Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Zarządzaj grafikami pracowników bez chaosu
              </h1>
              <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                Scheduler to prosty system do tworzenia harmonogramów,
                zarządzania dostępnością i ewidencji nieobecności pracowników.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={APP_URL} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Zacznij teraz
                </a>
                <a
                  href="#funkcje"
                  className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  Zobacz funkcje
                </a>
              </div>
            </div>

            {/* Login hint */}
            <div className="max-w-4xl mx-auto mb-3">
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={13} className="text-white" />
                  </div>
                  <span>Chcesz sprawdzić jak działa aplikacja? Zaloguj się danymi demo:</span>
                </div>
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Login:</span>
                    <code className="bg-gray-100 text-gray-800 font-mono px-2 py-0.5 rounded text-xs">admin@schedule.com</code>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Hasło:</span>
                    <code className="bg-gray-100 text-gray-800 font-mono px-2 py-0.5 rounded text-xs">admin</code>
                  </div>
                  <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                    Zaloguj się
                  </a>
                </div>
              </div>
            </div>

            {/* Mock app preview */}
            <div className="max-w-4xl mx-auto">
              <SchedulerMock />
            </div>
          </div>
        </section>

        {/* 3. Jak to działa */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="max-w-4xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Jak to działa?
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Utwórz grafik",
                  desc: "Manager otwiera widok tygodniowy lub miesięczny i tworzy nowy grafik dla swojego zespołu.",
                },
                {
                  step: "2",
                  title: "Przypisz pracowników",
                  desc: "Dodaj zmiany do konkretnych pracowników uwzględniając ich dostępność i preferencje godzinowe.",
                },
                {
                  step: "3",
                  title: "Gotowe",
                  desc: "Pracownicy natychmiast widzą swoje zmiany w panelu. Nieobecności i zmiany można zgłaszać na bieżąco.",
                },
              ].map((item, i) => (
                <FadeIn key={item.step} delay={i * 100}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white text-xl font-bold flex items-center justify-center mb-4">
                      {item.step}
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute left-full top-6 w-full h-px bg-gray-200" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Funkcje */}
        <section id="funkcje" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Co oferuje Scheduler?
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeIn delay={0}>
                <FeatureCard
                  icon={<CalendarDays className="w-6 h-6 text-white" />}
                  iconBg="bg-blue-500"
                  title="Grafiki tygodniowe i miesięczne"
                  description="Twórz harmonogramy pracy na dowolny okres. Widok tygodniowy i miesięczny z kalendarzem."
                />
              </FadeIn>
              <FadeIn delay={100}>
                <FeatureCard
                  icon={<Clock className="w-6 h-6 text-white" />}
                  iconBg="bg-green-500"
                  title="Zarządzanie dostępnością"
                  description="Pracownicy zgłaszają swoją dostępność z podziałem na godziny. Manager widzi kto i kiedy może pracować."
                />
              </FadeIn>
              <FadeIn delay={200}>
                <FeatureCard
                  icon={<AlertCircle className="w-6 h-6 text-white" />}
                  iconBg="bg-amber-500"
                  title="Ewidencja nieobecności"
                  description="Zgłaszanie nieobecności bezpośrednio przy zmianie. Historia nieobecności dostępna w panelu pracownika."
                />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 5. Role w systemie */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Trzy poziomy dostępu
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeIn delay={0}>
                <RoleCard
                  icon={<Users className="w-6 h-6 text-white" />}
                  iconBg="bg-blue-500"
                  title="Pracownik"
                  items={[
                    "Podgląd własnych zmian",
                    "Zgłaszanie dostępności",
                    "Ewidencja nieobecności",
                  ]}
                />
              </FadeIn>
              <FadeIn delay={100}>
                <RoleCard
                  icon={<CalendarDays className="w-6 h-6 text-white" />}
                  iconBg="bg-green-500"
                  title="Manager"
                  items={[
                    "Tworzenie grafików tygodniowych i miesięcznych",
                    "Podgląd całego zespołu",
                    "Filtrowanie zmian po pracowniku",
                  ]}
                />
              </FadeIn>
              <FadeIn delay={200}>
                <RoleCard
                  icon={<ShieldCheck className="w-6 h-6 text-white" />}
                  iconBg="bg-amber-500"
                  title="Admin"
                  items={[
                    "Pełna kontrola nad systemem",
                    "Tworzenie grafików wstecz",
                    "Zarządzanie kontami użytkowników",
                  ]}
                />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 6. CTA końcowy */}
        <section className="bg-blue-600 py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-8">
              Gotowy żeby zacząć?
            </h2>
            <a
              href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Przejdź do aplikacji
            </a>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="bg-gray-900 text-gray-400 text-sm text-center py-6 px-6">
          © 2026 Scheduler · scheduler-demo.gt-processing.com · Wersja
          demonstracyjna — dane mogą być resetowane bez powiadomienia
        </footer>
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
};

function FeatureCard({ icon, iconBg, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full">
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

type RoleCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  items: string[];
};

function RoleCard({ icon, iconBg, title, items }: RoleCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-gray-500">
            <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
