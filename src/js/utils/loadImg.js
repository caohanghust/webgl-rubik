export default function loadImg (src) {
  return new Promise(resolve => {
    const image = document.createElement('image')
    image.crossOrigin = 'anonymous'
    image.src = src
    image.onload = () => {
      resolve(image)
    }
  })
}