import { useRef, useState } from 'react'
import { submitBooking, shopToday } from '../booking.js'

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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const submitting = useRef(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (submitting.current) return
        submitting.current = true
        setIsLoading(true)
        setIsSubmitted(false)
        setError('')
        try {
            await submitBooking(formData)
            setIsSubmitted(true)
            setFormData(initialFormData)
        } catch (failure) {
            setError(failure.message)
        } finally {
            submitting.current = false
            setIsLoading(false)
        }
    }

    return (
        <section id="booking" className="bookingFormSection">
            <div className="bookingFormIntro">
                <p className="miniLabel">Online randevu</p>
                <h3>Ziyaretini planla</h3>
                <p>
                    Hizmetini, tercih ettiğin günü ve saati seç. Saatler Türkiye saatidir.
                    Randevun kaydedildiğinde onayı bu ekranda göreceksin.
                </p>
            </div>

            <form className="bookingForm" onSubmit={handleSubmit} aria-busy={isLoading}>
                <div className="formGrid">
                    <label>
                        Ad Soyad
                        <input
                            type="text"
                            name="fullName"
                            maxLength={100}
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
                            maxLength={30}
                            minLength={7}
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
                            maxLength={254}
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
                            min={shopToday()}
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
                        maxLength={1000}
                        placeholder="Örnek: Kısa ve net geçişli bir kesim istiyorum."
                        value={formData.note}
                        onChange={handleChange}
                        rows="4"
                    />
                </label>

                <button className="goldBtn bookingSubmit" type="submit" disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor…' : 'Randevu Talebi Gönder'} <b>→</b>
                </button>

                {error && <div className="successMessage" role="alert">{error}</div>}

                {isSubmitted && (
                    <div className="successMessage" role="status">
                        Randevun başarıyla kaydedildi. Görüşmek üzere!
                    </div>
                )}
            </form>
        </section>
    )
}

export default BookingForm
