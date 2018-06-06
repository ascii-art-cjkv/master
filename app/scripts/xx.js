export default function xx() {
  return console.log.apply(this, arguments)
}

export function isMobile() {
  return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
}
