export type StoreItem = {
  id: string
  title: string
  description: string
  cost: number
  limitPerUser?: number
}

export const storeItems: StoreItem[] = [
  {
    id: 'react-ao-vivo',
    title: 'React ao vivo',
    description: 'Escolha um vídeo para reagirmos juntos, AO VIVO!',
    cost: 10000
  },
  {
    id: 'assistir-filme',
    title: 'Assistir um filme juntos',
    description: 'Escolhemos um filme e assistimos juntinhos na live.',
    cost: 15000
  },
  {
    id: 'escolher-serie',
    title: 'Escolher uma série',
    description: 'Você escolhe a série da vez!',
    cost: 20000
  },
  {
    id: 'viradao-cultural',
    title: 'Viradão Cultural',
    description: 'Uma maratona temática insana – só os fortes!',
    cost: 40000
  },
  {
    id: 'ticket-sorteio',
    title: 'Ticket de Sorteio',
    description: 'Garanta sua sorte no próximo sorteio babadeiro.',
    cost: 8000,
    limitPerUser: 5
  }
]
