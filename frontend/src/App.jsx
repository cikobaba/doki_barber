import './App.css'
import heroImage from './assets/shop/waiting-area.jpeg'
import barberStationsImage from './assets/shop/barber-stations.jpeg'
import singleChairImage from './assets/shop/single-chair.jpeg'

const services = [
    {
        title: 'Haircut',
        text: 'Tailored cuts to match your style.',
        icon: '✂'
    },
    {
        title: 'Beard Grooming',
        text: 'Precision beard shaping & care.',
        icon: '◼'
    },
    {
        title: 'Shave',
        text: 'Classic hot towel shave experience.',
        icon: '▱'
    },
    {
        title: 'Hair Treatments',
        text: 'Deep conditioning & scalp care.',
        icon: '▣'
    },
    {
        title: 'Premium Service',
        text: 'Top products. Expert barbers. Every time.',
        icon: '☆'
    }
]

function App() {
    return (
        <main className="site">
            <header className="topbar">
                <div className="logoArea">
                    <div className="logoMark">MS</div>
                    <div>
                        <h1>Master Sharli</h1>
                        <span>Barber Shop</span>
                    </div>
                </div>

                <nav className="navMenu">
                    <a href="#home" className="active">Home</a>
                    <a href="#services">Services</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>

                <div className="navActions">
                    <span className="socialIcon">◎</span>
                    <span className="socialIcon">☏</span>
                    <button>Book Now</button>
                </div>
            </header>

            <section id="home" className="heroPanel">
                <img src={heroImage} alt="Master Sharli Barber Shop waiting area" />

                <div className="heroOverlay" />

                <div className="heroContent">
                    <div className="lineTitle">
                        <span />
                        <p>Precision cuts. Timeless style.</p>
                        <span />
                    </div>

                    <h2>
                        Master Sharli <br />
                        Barber Shop
                    </h2>

                    <p className="heroSubtitle">
                        Premium grooming for the modern man.
                    </p>

                    <div className="heroButtons">
                        <button className="goldBtn">Book Appointment <b>→</b></button>
                        <button className="textBtn">View Services <b>—</b></button>
                    </div>
                </div>
            </section>

            <section className="middleGrid">
                <div id="services" className="servicesBlock">
                    <div className="blockHeader">
                        <h3>Our Services</h3>
                        <span />
                    </div>

                    <div className="servicesRow">
                        {services.map((service) => (
                            <article className="serviceItem" key={service.title}>
                                <div className="serviceIcon">{service.icon}</div>
                                <h4>{service.title}</h4>
                                <p>{service.text}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <div id="gallery" className="galleryBlock">
                    <div className="blockHeader galleryHeader">
                        <h3>Inside The Shop</h3>
                        <a href="#gallery">View Gallery —</a>
                    </div>

                    <div className="galleryRow">
                        <div className="shopImage">
                            <img src={heroImage} alt="Waiting area" />
                        </div>

                        <div className="shopImage">
                            <img src={barberStationsImage} alt="Main barber stations" />
                        </div>

                        <div className="shopImage">
                            <img src={singleChairImage} alt="Private barber chair" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="booking" className="bookingStrip">
                <div className="bookingTitle">
                    <p>Ready for your best look?</p>
                    <h3>
                        Book your appointment <br />
                        today
                    </h3>
                </div>

                <div className="contactBox">
                    <div className="contactIcon">☏</div>
                    <span>Call Us</span>
                    <p>+00 000 000 000</p>
                </div>

                <div className="contactBox">
                    <div className="contactIcon">◎</div>
                    <span>Instagram</span>
                    <p>@mastersharli</p>
                </div>

                <div className="bookBox">
                    <button className="goldBtn">Book Appointment <b>→</b></button>
                    <small>Walk-ins welcome.</small>
                </div>
            </section>

            <section className="smartStrip">
                <div>
                    <span>☏</span>
                    <div>
                        <h4>Instant WhatsApp Confirmation</h4>
                        <p>Get real-time booking confirmation and reminders.</p>
                    </div>
                </div>

                <div>
                    <span>✦</span>
                    <div>
                        <h4>AI-Assisted Scheduling</h4>
                        <p>Smart availability matched to your preferred time.</p>
                    </div>
                </div>
            </section>

            <footer id="contact" className="footer">
                <div className="logoArea">
                    <div className="logoMark small">MS</div>
                    <div>
                        <h1>Master Sharli</h1>
                        <span>Barber Shop</span>
                    </div>
                </div>

                <nav>
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#contact">Contact</a>
                </nav>

                <p>© 2026 Master Sharli Barber Shop. All rights reserved.</p>
            </footer>
        </main>
    )
}

export default App