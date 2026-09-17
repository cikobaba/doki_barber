import { useEffect, useMemo, useRef, useState } from 'react'
import emptyChairImage from '../assets/shop/empty-chair-scroll.png'
import buzzCutImage from '../assets/shop/style-buzz-cut.png'
import midFadeImage from '../assets/shop/style-mid-fade.png'
import mulletImage from '../assets/shop/style-mullet.png'
import texturedCropImage from '../assets/shop/style-textured-crop.png'
import sidePartImage from '../assets/shop/style-side-part.png'
import './ChairExperienceSection.css'

const styleModels = [
    {
        title: 'Buzz Cut',
        text: 'Temiz, maskülen, klasik',
        image: buzzCutImage
    },
    {
        title: 'Mid Fade',
        text: 'Dengeli, keskin, modern',
        image: midFadeImage
    },
    {
        title: 'Mullet',
        text: 'Doğal, özgün, stil sahibi',
        image: mulletImage
    },
    {
        title: 'Textured Crop',
        text: 'Doğal, modern, stil sahibi',
        image: texturedCropImage
    },
    {
        title: 'Side Part / Comb Over',
        text: 'Klasik, şık, zamansız',
        image: sidePartImage
    }
]

function ChairExperienceSection() {
    const sectionRef = useRef(null)
    const [activeModel, setActiveModel] = useState(-1)

    const modelCount = styleModels.length
    const activeStyle = useMemo(() => styleModels[Math.max(activeModel, 0)], [activeModel])

    useEffect(() => {
        const section = sectionRef.current

        if (!section) {
            return undefined
        }

        let frameId = 0

        const updateScene = () => {
            const rect = section.getBoundingClientRect()
            const scrollableDistance = section.offsetHeight - window.innerHeight

            if (rect.top > 0) {
                section.style.setProperty('--chair-progress', '0')
                setActiveModel(-1)
                return
            }

            if (Math.abs(rect.top) > scrollableDistance) {
                section.style.setProperty('--chair-progress', '1')
                setActiveModel(modelCount - 1)
                return
            }

            const progress = Math.abs(rect.top) / scrollableDistance
            const nextActiveModel = progress < 0.04 ? -1 : Math.min(Math.floor(progress * modelCount), modelCount - 1)

            section.style.setProperty('--chair-progress', progress.toFixed(3))
            setActiveModel(nextActiveModel)
        }

        const requestUpdate = () => {
            window.cancelAnimationFrame(frameId)
            frameId = window.requestAnimationFrame(updateScene)
        }

        updateScene()
        window.addEventListener('scroll', requestUpdate, { passive: true })
        window.addEventListener('resize', requestUpdate)

        return () => {
            window.cancelAnimationFrame(frameId)
            window.removeEventListener('scroll', requestUpdate)
            window.removeEventListener('resize', requestUpdate)
        }
    }, [modelCount])

    return (
        <section
            id="chair-experience"
            className={`chairExperienceSection ${activeModel >= 0 ? 'hasActiveModel' : ''}`}
            style={{ '--active-style-image': `url(${activeModel >= 0 ? activeStyle.image : emptyChairImage})` }}
            ref={sectionRef}
            aria-labelledby="chair-experience-title"
        >
            <div className="stickyChairScene">
                <div className="styleImageStack" aria-hidden="true">
                    <img src={emptyChairImage} alt="" className="emptyChairImage" />

                    {styleModels.map((model, index) => (
                        <img
                            key={model.title}
                            src={model.image}
                            alt=""
                            className={`modelPoster ${activeModel === index ? 'isActive' : ''}`}
                        />
                    ))}
                </div>

                <div className="styleSceneOverlay" />

                <div className="styleSceneCopy">
                    <p className="miniLabel">Scroll ile stil seçimi</p>
                    <h2 id="chair-experience-title">Koltukta stilini keşfet</h2>
                    <p>
                        Boş koltuktan başla; aşağı kaydırdıkça Doğukan Hair Club imzalı
                        saç modelleri tek tek sahneye gelsin.
                    </p>
                </div>

                <div className="styleSceneStatus" aria-live="polite">
                    <span>{activeModel >= 0 ? activeStyle.title : 'Boş Koltuk'}</span>
                    <p>{activeModel >= 0 ? activeStyle.text : 'Stil yolculuğu burada başlar'}</p>
                </div>
            </div>

            <div className="styleSwiperWrap">
                <div className="styleSwiperHeader">
                    <p className="miniLabel">Model galerisi</p>
                    <h3>Favori kesimini yana kaydır</h3>
                </div>

                <div className="premiumSwiper" aria-label="Saç modeli galerisi">
                    {styleModels.map((model) => (
                        <article className="premiumSlide" key={model.title}>
                            <img src={model.image} alt={`${model.title} saç modeli`} />
                            <div>
                                <span>{model.title}</span>
                                <p>{model.text}</p>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default ChairExperienceSection
