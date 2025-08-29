# LinnosTV — Site (Next.js + Twitch OAuth + Tailwind + Firebase)

Um site babado para a live **LinnosTV** (Twitch) com:
- Fundo animado nas cores verde, roxo, azul e rosa
- Login via **Twitch OAuth** (NextAuth)
- Páginas de **Fellinos Coins** (saldo) e **Loja** (resgates)
- Firebase Firestore para armazenar moedas e resgates
- Pronto para deploy na **Vercel**

## 💿 Como rodar

```bash
npm install
cp .env.example .env.local
# Preencha as variáveis acima (Twitch + NextAuth + Firebase Admin)
npm run dev
```

Depois suba para a Vercel. 🚀

## 🔐 Observação
- Use **FIREBASE_PRIVATE_KEY** com quebras de linha escapadas (\n).

## 🔧 Coleções esperadas no Firestore
- `users/{uid}`: { coins: number, name, image }
- `redemptions/{autoId}`: { uid, itemId, itemName, cost, createdAt }
- (Opcional) Você pode pré-popular itens em `/data/storeItems.ts`
