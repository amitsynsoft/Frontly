import * as React from "react"

export function useResponsive() {
  const [state, setState] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })
    }

    // Run layout effect calculation on mount
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return state
}
