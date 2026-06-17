const bladesImage = new URL('../assets/logo/blades.png', import.meta.url).href
const skullImage = new URL('../assets/logo/skull.png', import.meta.url).href
const textImage = new URL('../assets/logo/master-sharli-text.png', import.meta.url).href

function Preloader({ isLeaving }) {
    return (
        <div className={`preloader ${isLeaving ? 'preloaderLeaving' : ''}`}>
            <div className="preloaderGlow" />
            <div className="preloaderSmoke smokeOne" />
            <div className="preloaderSmoke smokeTwo" />

            <div className="preloaderStage">
                <div className="goldCircle" />

                <img
                    className="preloaderBlades"
                    src={bladesImage}
                    alt=""
                />

                <img
                    className="preloaderSkull"
                    src={skullImage}
                    alt="Master Sharli skull logo"
                />

                <div className="preloaderShine" />

                <img
                    className="preloaderTextLogo"
                    src={textImage}
                    alt="Master Sharli"
                />

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