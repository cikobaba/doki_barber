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
    'Haircut',
    'Beard Grooming',
    'Classic Shave',
    'Hair Treatment',
    'Premium Service'
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

        console.log('Appointment request:', formData)

        setFormData(initialFormData)
    }

    return (
        <section id="booking" className="bookingFormSection">
            <div className="bookingFormIntro">
                <p className="miniLabel">Online appointment</p>
                <h3>Book your visit</h3>
                <p>
                    Choose your service, preferred date, and time. After booking, the system
                    will later send a WhatsApp confirmation automatically.
                </p>
            </div>

            <form className="bookingForm" onSubmit={handleSubmit}>
                <div className="formGrid">
                    <label>
                        Full Name
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+371..."
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Service
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select service</option>
                            {serviceOptions.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Date
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Time
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select time</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label>
                    Special Note
                    <textarea
                        name="note"
                        placeholder="Example: I want a skin fade haircut."
                        value={formData.note}
                        onChange={handleChange}
                        rows="4"
                    />
                </label>

                <button className="goldBtn bookingSubmit" type="submit">
                    Submit Appointment <b>→</b>
                </button>

                {isSubmitted && (
                    <div className="successMessage">
                        Your appointment request has been received. WhatsApp confirmation will
                        be sent after the system integration is completed.
                    </div>
                )}
            </form>
        </section>
    )
}

export default BookingForm