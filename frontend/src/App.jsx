import { useEffect, useState } from 'react'
import './App.css'
import MasterBarberSection from './components/MasterBarberSection'
import Preloader from './components/Preloader'
import BookingForm from './components/BookingForm'
import studioImage from './assets/shop/corlu-hair-studio.png'
import brandLogo from './assets/logo/dogukan-dk-logo.png'
import instagramLogo from './assets/logo/instagram-logo.png'
import BarberPoleSection from './components/BarberPoleSection'
import ChairExperienceSection from './components/ChairExperienceSection'

const shopAddress = 'Reşadiye, Şinasi Kurşun 1. Sk. 7B, 59850 Çorlu/Tekirdağ'
const encodedShopAddress = encodeURIComponent(shopAddress)
const shopMapEmbedUrl = `https://www.google.com/maps?q=${encodedShopAddress}&output=embed`
const shopMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedShopAddress}`
const instagramUrl = 'https://www.instagram.com/dogukankugumcu/'
const phoneDisplay = '0 537 261 36 43'
const phoneHref = 'tel:+905372613643'

const resetToHome = () => {
    if (typeof window === 'undefined') {
        return
    }

    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
    }

    if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

function App() {
    const [showPreloader, setShowPreloader] = useState(true)
    const [isLeaving, setIsLeaving] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        resetToHome()
        const frameId = window.requestAnimationFrame(resetToHome)
        const leaveTimer = setTimeout(() => {
            setIsLeaving(true)
        }, 1800)

        const removeTimer = setTimeout(() => {
            setShowPreloader(false)
            resetToHome()
        }, 2350)

        return () => {
            window.cancelAnimationFrame(frameId)
            clearTimeout(leaveTimer)
            clearTimeout(removeTimer)
        }
    }, [])

    return (
        <>
            {showPreloader && <Preloader isLeaving={isLeaving} />}

            <main className="site">
                <header className={`topbar ${isMobileMenuOpen ? 'isMenuOpen' : ''}`}>
                    <div className="logoArea">
                        <img className="brandLogo" src={brandLogo} alt="Doğukan Hair Men's Club logosu" />
                        <div>
                            <h1>Doğukan</h1>
                            <span>Hair Men's Club</span>
                        </div>
                    </div>
                    <button
                        className="mobileMenuButton"
                        type="button"
                        aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="site-navigation"
                        onClick={() => setIsMobileMenuOpen((current) => !current)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <nav id="site-navigation" className="navMenu" aria-label="Site bölümleri">
                        <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Ana Sayfa</a>
                        <a href="#chair-experience" onClick={() => setIsMobileMenuOpen(false)}>Stiller</a>
                        <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Hizmetler</a>
                        <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)}>Salon</a>
                        <a href="#booking" onClick={() => setIsMobileMenuOpen(false)}>Randevu</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>İletişim</a>
                    </nav>
                </header>

                <section id="home" className="heroPanel">
                    <img
                        src={studioImage}
                        alt="Doğukan Hair Men's Club salon genel görünümü"
                        className="heroImage"
                    />

                    <div className="heroOverlay" />

                    <div className="heroContent">
                        <div className="lineTitle">
                            <span />
                            <p>Net kesim. Zamansız stil.</p>
                            <span />
                        </div>

                        <h2>
                            Doğukan Kuğumcu <br />
                            Hair Men's Club
                        </h2>

                        <p className="heroSubtitle">
                            Her saç, kafa anatomisine göre kesilir.
                        </p>

                        <div className="heroButtons">
                            <a className="goldBtn" href="#booking">
                                Randevu Al <b>→</b>
                            </a>

                            <a className="textBtn" href="#services">
                                Hizmetleri Gör <b>—</b>
                            </a>
                        </div>
                    </div>
                </section>

                <ChairExperienceSection />
                <BarberPoleSection />

                <section className="bookingStrip">
                    <div className="bookingTitle">
                        <p>En iyi görünümüne hazır mısın?</p>
                        <h3>
                            Randevunu bugün <br />
                            oluştur
                        </h3>
                    </div>

                    <a className="contactBox" href={phoneHref} aria-label="Doğukan Hair Men's Club telefon numarasını ara">
                        <div className="contactIcon">☏</div>
                        <span>Bizi Ara</span>
                        <p>{phoneDisplay}</p>
                    </a>

                    <a
                        className="contactBox"
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Doğukan Kuğumcu Instagram hesabını aç"
                    >
                        <div className="contactIcon contactIconImage">
                            <img src={instagramLogo} alt="" />
                        </div>
                        <span>Instagram</span>
                        <p>@dogukankugumcu</p>
                    </a>

                    <div className="bookBox">
                        <a className="goldBtn" href="#booking">
                            Randevu Al <b>→</b>
                        </a>
                        <small>Müsaitliğe göre randevusuz misafir kabul edilir.</small>
                    </div>
                </section>
                <MasterBarberSection />
                <BookingForm />

                <section id="contact" className="locationSection" aria-labelledby="location-title">
                    <div className="locationCopy">
                        <p className="miniLabel">Konum</p>
                        <h3 id="location-title">Dükkana kolayca ulaş</h3>
                        <p>
                            Randevuna gelirken adresi Google Maps üzerinden açabilir,
                            tek dokunuşla yol tarifi alabilirsin.
                        </p>

                        <address>{shopAddress}</address>

                        <a
                            className="goldBtn locationButton"
                            href={shopMapUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Maps'te Aç <b>→</b>
                        </a>
                    </div>

                    <div className="mapFrame">
                        <iframe
                            title="Doğukan Hair Men's Club konumu"
                            src={shopMapEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <a
                            href={shopMapUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Doğukan Hair Men's Club konumunu Google Maps'te aç"
                        />
                    </div>
                </section>

                <section id="about" className="smartStrip">
                    <div>
                        <span>☏</span>
                        <div>
                            <h4>Anında WhatsApp Onayı</h4>
                            <p>Randevu onayı ve hatırlatmaları hızlıca al.</p>
                        </div>
                    </div>

                    <div>
                        <span>✦</span>
                        <div>
                            <h4>Akıllı Randevu Planlama</h4>
                            <p>Tercih ettiğin saate uygun müsaitlik kolayca eşleştirilir.</p>
                        </div>
                    </div>
                </section>

                <footer className="footer">
                    <div className="logoArea">
                        <img className="brandLogo footerLogo" src={brandLogo} alt="Doğukan Hair Men's Club logosu" />
                        <div>
                            <h1>Doğukan</h1>
                            <span>Hair Men's Club</span>
                        </div>
                    </div>

                    <nav>
                        <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Ana Sayfa</a>
                        <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Hizmetler</a>
                        <a href="#gallery">Salon</a>
                        <a href="#booking" onClick={() => setIsMobileMenuOpen(false)}>Randevu</a>
                        <a href="#contact">Konum</a>
                    </nav>

                    <p>© 2026 Doğukan Hair Men's Club. Tüm hakları saklıdır.</p>
                </footer>
            </main>
        </>
    )
}

export default App
