export const formatToJakarta = (date) => {
    return date?.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
};

export const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
}
