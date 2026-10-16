export function shopToday(now = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(now)
}
export async function submitBooking(form, fetcher = fetch) {
    if (!form.fullName.trim() || !form.phone.trim() || !form.service || !form.date || !form.time) {
        throw new Error('Lütfen gerekli alanları doldurun.')
    }
    let response
    try {
        response = await fetcher('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, fullName: form.fullName.trim(), phone: form.phone.trim() }),
        })
    } catch {
        throw new Error('Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.')
    }
    if (response.status === 409) throw new Error('Bu saat dolu. Lütfen başka bir saat seç.')
    if (response.status === 400) throw new Error('Bilgileri kontrol et. Geçerli bir tarih, tam saat ve iletişim bilgisi gir.')
    if (response.status !== 201) throw new Error('Randevu kaydedilemedi. Lütfen tekrar dene.')
    return response.json()
}
