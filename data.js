const PRODUCTS = [
  {
    id: 1, name: 'T-shirt Noir', cat: 'tshirt', price: 10000, soldOut: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'tshirt-noir.png',
    gallery: ['tshirt-noir.png', 'tshirt-noir-dos.jpeg']
  },
  {
    id: 2, name: 'T-shirt Blanc', cat: 'tshirt', price: 10000, soldOut: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'tshirt-blanc.png',
    gallery: ['tshirt-blanc.png', 'tshirt-blanc-dos.jpeg']
  },
  {
    id: 3, name: 'T-shirt Rose', cat: 'tshirt', price: 10000, soldOut: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'tshirt-rose.png',
    gallery: ['tshirt-rose.png', 'tshirt-rose-dos.jpeg']
  },
  {
    id: 4, name: 'Top-basic Blanc', cat: 'tshirt', price: 6000, soldOut: false,
    sizes: ['S', 'M', 'L'],
    img: 'crop-blanc.png',
    gallery: ['crop-blanc.png']
  },
  {
    id: 5, name: 'Top-basic Noir', cat: 'tshirt', price: 6000, soldOut: false,
    sizes: ['S', 'M', 'L'],
    img: 'crop-noir.png',
    gallery: ['crop-noir.png']
  },
  {
    id: 6, name: 'Crop-top  Noir', cat: 'tshirt', price: 6000, soldOut: false,
    sizes: ['S', 'M', 'L'],
    img: 'top-basic-noir.png',
    gallery: ['top-basic-noir.png']
  },
  {
    id: 7, name: 'Crop-top Blanc', cat: 'tshirt', price: 6000, soldOut: false,
    sizes: ['S', 'M', 'L'],
    img: 'top-basic-blanc.png',
    gallery: ['top-basic-blanc.png']
  },
  {
    id: 8, name: 'Bonnet', cat: 'bonnet', price: 5000, soldOut: false,
    sizes: ['Unique'],
    img: 'bonnet-noir.png',
    gallery: ['bonnet-noir.png']
  },
  {
    id: 9, name: 'Sticker Drip', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-drip.png',
    gallery: ['sticker-drip.png', 'sticker-drip2.png', 'sticker-drip-iphone.png']
  },
  {
    id: 10, name: 'Sticker Bubble blanc', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-bubble.png',
    gallery: ['sticker-bubble.png', 'sticker-classique-coque2.png', 'sticker-bubble-iphone.png']
  },
  {
    id: 12, name: 'Sticker Bubble Noir', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-bubble-noir.png',
    gallery: ['sticker-bubble-noir.png', 'sticker-bubble-seul.png', 'sticker-bubble-noir-iphone.png']
  },
  {
    id: 11, name: 'Sticker Classique', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-classique.png',
    gallery: ['sticker-classique.png', 'sticker-classique2.png', 'sticker-classique-iphone.png']
  },
  {
    id: 16, name: 'Sticker RN', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-RN.jpeg',
    gallery: ['sticker-RN.jpeg', 'sticker-coque-RN.jpeg', 'sticker-iphone-RN.jpeg']
  },
  {
    id: 17, name: 'Sticker Rose', cat: 'accessoire', price: 500, soldOut: false,
    sizes: ['Unique'],
    img: 'sticker-rose.jpeg',
    gallery: ['sticker-rose.jpeg', 'sticker-rose-coque.jpeg', 'sticker-rose-iphone.jpeg']
  },
  {
    id: 13, name: 'Hoodie Noir', cat: 'hoodie', price: 15000, soldOut: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'hoodie-noir.jpeg',
    gallery: ['hoodie-noir.jpeg', 'hoodie-noir-dos.jpeg']
  },
  {
    id: 14, name: 'Hoodie Blanc', cat: 'hoodie', price: 15000, soldOut: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'hoodie-blanc.jpeg',
    gallery: ['hoodie-blanc.jpeg', 'hoodie-blanc-dos.jpeg']
  },
  {
    id: 15, name: 'Hoodie Rose', cat: 'hoodie', price: 15000, soldOut: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: 'hoodie-rose.jpeg',
    gallery: ['hoodie-rose.jpeg', 'hoodie-rose-dos.jpeg']
  },
];

function getImg(filename) {
  return filename;
}
