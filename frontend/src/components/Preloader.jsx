const brandLogo = new URL('../assets/logo/dogukan-dk-logo.png', import.meta.url).href

function Preloader({ isLeaving }) {
    return (
        <div className={`preloader ${isLeaving ? 'preloaderLeaving' : ''}`}>
            <div className="preloaderGlow" />
            <div className="preloaderSmoke smokeOne" />
            <div className="preloaderSmoke smokeTwo" />

            <div className="preloaderStage">
                <div className="goldCircle" />

                <img
                    className="preloaderBrandLogo"
                    src={brandLogo}
                    alt="Doğukan Hair Men's Club logosu"
                />

                <div className="preloaderShine" />

                <div className="preloaderTextLogo" aria-label="Doğukan Hair Men's Club">
                    <strong>Doğukan</strong>
                    <span>Hair Men's Club</span>
                </div>

                <div className="loadingTrack">
                    <div className="loadingFill" />
                </div>

                <span className="loadingText">
                    Premium bakım deneyimin hazırlanıyor
                </span>
            </div>
        </div>
    )
}

export default Preloader

