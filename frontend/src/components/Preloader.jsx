const logoImage = new URL('../assets/logo/master-sharli-logo.png', import.meta.url).href

function Preloader({ isLeaving }) {
    return (
        <div className={`preloader ${isLeaving ? 'preloaderLeaving' : ''}`}>
            <div className="preloaderGlow" />

            <div className="preloaderLogoWrap">
                <div className="bladeLine" />

                <img
                    className="preloaderLogo"
                    src={logoImage}
                    alt="Master Sharli Barber Shop logo"
                />

                <h1>Master Sharli</h1>
                <p>Barber Shop</p>

                <div className="loadingTrack">
                    <div className="loadingFill" />
                </div>

                <span className="loadingText">
          Preparing your premium grooming experience
        </span>
            </div>
        </div>
    )
}

export default Preloader