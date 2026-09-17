import { useEffect, useRef } from 'react'
import haircutLogo from '../assets/logo/service-haircut-barber-shop.png'
import beardLogo from '../assets/logo/service-beard.png'
import hairCareLogo from '../assets/logo/service-hair-care.png'
import scissorsLogo from '../assets/logo/service-scissors.png'
import './BarberPoleSection.css'

const services = [
    {
        title: 'Saç Kesimi',
        text: 'Tarzına uygun, kafa anatomisine göre özenli ve net kesimler.',
        icon: 'machine',
        logo: haircutLogo
    },
    {
        title: 'Sakal Bakımı',
        text: 'Yüz hattına uygun sakal şekillendirme ve bakım.',
        icon: 'beard',
        logo: beardLogo
    },
    {
        title: 'Tıraş',
        text: 'Sıcak havluyla klasik berber tıraşı deneyimi.',
        icon: 'scissors',
        logo: scissorsLogo
    },
    {
        title: 'Saç Bakımı',
        text: 'Saç derisi ve saç sağlığı için derin bakım.',
        icon: 'care',
        logo: hairCareLogo
    },
    {
        title: 'Premium Hizmet',
        text: 'Kaliteli ürünler, usta eller, her seferinde temiz sonuç.',
        icon: 'premium'
    }
]

function ServiceIcon({ type, src, label }) {
    return (
        <span className={`serviceIconMark serviceIcon-${type}`} aria-hidden="true">
            {src && <img src={src} alt={label} />}
            <span />
        </span>
    )
}

function BarberPoleSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current

        const handleScroll = () => {
            if (!section) return

            const rect = section.getBoundingClientRect()
            const windowHeight = window.innerHeight

            const progress = (windowHeight - rect.top) / (windowHeight + rect.height)
            const clampedProgress = Math.max(0, Math.min(progress, 1))

            section.style.setProperty('--scroll-progress', clampedProgress)
        }

        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <section id="services" className="barberPoleSection" ref={sectionRef}>
            <div className="poleMarquee poleMarqueeTop">
                <div>
                    <span>Doğukan Hair Men's Club</span>
                    <span>Premium Hizmetler</span>
                </div>
            </div>

            <div className="poleMarquee poleMarqueeBottom">
                <div>
                    <span>Netlik. Stil. Ritüel.</span>
                    <span>Netlik. Stil. Ritüel.</span>
                </div>
            </div>

            <div className="poleContent">
                <div className="servicesIntro">
                    <p className="miniLabel">Hizmetlerimiz</p>
                    <h2>Kesimden bakıma, her detay net bir stil için.</h2>
                    <p>
                        Her hizmet yüz hattına, saç yapısına ve günlük kullanım alışkanlığına göre özenle hazırlanır.
                    </p>
                </div>

                <div className="poleStage" aria-hidden="true">
                    <div className="barberPole">
                        <div className="poleCap poleCapTop" />
                        <div className="poleCap poleCapBottom" />
                        <div className="poleGlass" />
                        <div className="poleLight" />
                    </div>
                </div>

                <div className="servicesPanel">
                    <div className="servicesGrid">
                        {services.map((service) => (
                            <article className="serviceCard" key={service.title}>
                                <ServiceIcon type={service.icon} src={service.logo} label={service.title} />
                                <div>
                                    <h3>{service.title}</h3>
                                    <p>{service.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BarberPoleSection
