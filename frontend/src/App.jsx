import './App.css'
import heroImage from './assets/hero.png'

const services = [
  {
    title: 'Haircut',
    description: 'Tailored cuts designed to match your face shape, style, and daily routine.',
    icon: '✂'
  },
  {
    title: 'Beard Grooming',
    description: 'Sharp beard shaping, clean lines, trimming, and detailed finishing.',
    icon: '◆'
  },
  {
    title: 'Classic Shave',
    description: 'Traditional hot towel shave with a smooth premium barber touch.',
    icon: '◈'
  },
  {
    title: 'Hair Treatment',
    description: 'Premium care treatments for healthier hair, scalp comfort, and fresh styling.',
    icon: '✦'
  }
]

const features = [
  {
    title: 'Instant WhatsApp Confirmation',
    text: 'After booking, customers receive an automatic confirmation message.'
  },
  {
    title: 'Owner Notification',
    text: 'The shop owner receives appointment details through automation.'
  },
  {
    title: 'AI Assisted Booking',
    text: 'Future AI support will help customers choose services and appointment times.'
  }
]

function App() {
  return (
      <main className="site">
        <header className="navbar">
          <div className="brand">
            <div className="brandLogo">MS</div>
            <div>
              <h1>Master Sharli</h1>
              <span>Barber Shop</span>
            </div>
          </div>

          <nav className="navLinks">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#booking">Booking</a>
            <a href="#contact">Contact</a>
          </nav>

          <button className="outlineButton">Book Now</button>
        </header>

        <section id="home" className="hero">
          <div className="heroText">
            <p className="eyebrow">Precision cuts. Timeless style.</p>

            <h2>
              Master Sharli <br />
              Barber Shop
            </h2>

            <p className="heroDescription">
              A premium grooming experience for modern gentlemen. Explore services,
              view the shop atmosphere, and book your appointment online with smart
              WhatsApp confirmation.
            </p>

            <div className="heroActions">
              <button className="goldButton">Book Appointment</button>
              <button className="darkButton">View Services</button>
            </div>

            <div className="ratingBox">
              <span>★★★★★</span>
              <p>Top rated by gentlemen who care about clean details.</p>
            </div>
          </div>

          <div className="heroImage">
            <img src={heroImage} alt="Master Sharli Barber Shop interior" />
          </div>
        </section>

        <section id="services" className="section">
          <div className="sectionHeader">
            <p className="eyebrow">Our Services</p>
            <h3>Premium grooming, crafted with detail.</h3>
          </div>

          <div className="servicesGrid">
            {services.map((service) => (
                <article className="serviceCard" key={service.title}>
                  <div className="serviceIcon">{service.icon}</div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="gallerySection">
          <div className="galleryInfo">
            <p className="eyebrow">Inside the shop</p>
            <h3>Dark leather, warm wood, sharp atmosphere.</h3>
            <p>
              The design reflects the real feeling of the shop: premium, calm,
              masculine, detailed, and professional. The website should feel like
              entering the barbershop before the customer even books.
            </p>
          </div>

          <div className="galleryGrid">
            <div className="galleryCard large">
              <img src={heroImage} alt="Premium barber chair" />
              <span>Premium barber chair</span>
            </div>

            <div className="galleryCard">
              <img src={heroImage} alt="Shop interior" />
              <span>Shop interior</span>
            </div>

            <div className="galleryCard">
              <img src={heroImage} alt="Grooming station" />
              <span>Grooming station</span>
            </div>
          </div>
        </section>

        <section className="automationSection">
          <div>
            <p className="eyebrow">Smart appointment system</p>
            <h3>Built for booking, automation, and future AI.</h3>
          </div>

          <div className="featureGrid">
            {features.map((feature) => (
                <div className="featureCard" key={feature.title}>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </div>
            ))}
          </div>
        </section>

        <section id="booking" className="bookingCta">
          <div>
            <p className="eyebrow">Ready for your best look?</p>
            <h3>Book your appointment today.</h3>
            <p>Online booking, WhatsApp confirmation, and owner notification.</p>
          </div>

          <button className="goldButton">Book Appointment</button>
        </section>

        <footer id="contact" className="footer">
          <div>
            <h3>Master Sharli Barber Shop</h3>
            <p>Premium grooming for the modern gentleman.</p>
          </div>

          <div className="footerLinks">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#booking">Booking</a>
          </div>
        </footer>
      </main>
  )
}

export default App