import { useState } from 'react'

const initialFormData = {
    fullName: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    note: ''
}

const serviceOptions = [
    'Saç Kesimi',
    'Sakal Bakımı',
    'Klasik Tıraş',
    'Saç Bakımı',
    'Premium Hizmet'
]

const timeOptions = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00'
]

function BookingForm() {
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsSubmitted(true)

        console.log('Randevu talebi:', formData)

        setFormData(initialFormData)
    }

    return (
        <section id="booking" className="bookingFormSection">
            <div className="bookingFormIntro">
                <p className="miniLabel">Online randevu</p>
                <h3>Ziyaretini planla</h3>
                <p>
                    Hizmetini, tercih ettiğin günü ve saati seç. Randevu oluşturulduktan
                    sonra sistem WhatsApp üzerinden otomatik onay gönderecek.
                </p>
            </div>

            <form className="bookingForm" onSubmit={handleSubmit}>
                <div className="formGrid">
                    <label>
                        Ad Soyad
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Adını ve soyadını yaz"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Telefon Numarası
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+90..."
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        E-posta
                        <input
                            type="email"
                            name="email"
                            placeholder="ornek@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Hizmet
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Hizmet seç</option>
                            {serviceOptions.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Tarih
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Saat
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Saat seç</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label>
                    Özel Not
                    <textarea
                        name="note"
                        placeholder="Örnek: Kısa ve net geçişli bir kesim istiyorum."
                        value={formData.note}
                        onChange={handleChange}
                        rows="4"
                    />
                </label>

                <button className="goldBtn bookingSubmit" type="submit">
                    Randevu Talebi Gönder <b>→</b>
                </button>

                {isSubmitted && (
                    <div className="successMessage">
                        Randevu talebin alındı. Sistem entegrasyonu tamamlandığında
                        WhatsApp onayı otomatik olarak gönderilecek.
                    </div>
                )}
            </form>
        </section>
    )
}

export default BookingForm
