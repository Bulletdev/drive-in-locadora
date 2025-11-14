export type Reservation = {
  id: string
  carId: string
  pickupDate: string // ISO
  returnDate: string // ISO
  pickupLocation: string
  returnLocation: string
  customer?: { name?: string; email?: string; phone?: string }
  createdAt: string // ISO
}

const store = new Map<string, Reservation>()

export function addReservation(r: Reservation) {
  store.set(r.id, r)
}

export function getReservation(id: string): Reservation | undefined {
  return store.get(id)
}

export function getAllReservations(): Reservation[] {
  return Array.from(store.values())
}