import { Injectable, Inject } from "@angular/core"
import { DOCUMENT } from "@angular/common"
import { BehaviorSubject, type Observable } from "rxjs"

export type Theme = "light" | "dark"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly THEME_KEY = "app-theme"
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme())

  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document = document;
    this.initializeTheme()
  }

  private initializeTheme(): void {
    const initialTheme = this.themeSubject.value
    this.applyTheme(initialTheme)
    this.listenToSystemThemeChanges()

    // Debug logging
    console.log("ThemeService initialized with theme:", initialTheme)
  }

  private getInitialTheme(): Theme {
    try {
      // Check if there's a saved theme in localStorage
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        console.log("Found saved theme:", savedTheme)
        return savedTheme
      }

      // If no saved theme, use system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        console.log("Using system dark theme")
        return "dark"
      }

      console.log("Using default light theme")
      return "light"
    } catch (error) {
      console.warn("Error getting initial theme, defaulting to light:", error)
      return "light"
    }
  }

  public toggleTheme(): void {
    const currentTheme = this.themeSubject.value
    const newTheme: Theme = currentTheme === "light" ? "dark" : "light"
    console.log("Toggling theme from", currentTheme, "to", newTheme)
    this.setTheme(newTheme)
  }

  public setTheme(theme: Theme): void {
    console.log("Setting theme to:", theme)
    this.themeSubject.next(theme)
    this.applyTheme(theme)
    this.saveTheme(theme)
  }

  public getCurrentTheme(): Theme {
    return this.themeSubject.value
  }

  public isDarkTheme(): boolean {
    return this.themeSubject.value === "dark"
  }

  private applyTheme(theme: Theme): void {
    try {
      const body = this.document.body
      const html = this.document.documentElement

      // Remove existing theme classes
      body.classList.remove("light-theme", "dark-theme")
      html.classList.remove("light-theme", "dark-theme")

      // Apply new theme class
      const themeClass = `${theme}-theme`
      body.classList.add(themeClass)
      html.classList.add(themeClass)

      // Set data attribute for CSS targeting
      body.setAttribute("data-theme", theme)
      html.setAttribute("data-theme", theme)

      // Update CSS custom properties
      this.updateCSSProperties(theme)

      // Update meta theme-color for PWA
      this.updateThemeColor(theme)

      // Dispatch custom event for components that need to react to theme changes
      window.dispatchEvent(new CustomEvent("themeChanged", { detail: theme }))

      console.log("Theme applied successfully:", theme)
    } catch (error) {
      console.error("Error applying theme:", error)
    }
  }

  private updateCSSProperties(theme: Theme): void {
    const root = this.document.documentElement

    if (theme === "dark") {
      // Dark theme properties
      root.style.setProperty("--primary-color", "#3fa6ee")
      root.style.setProperty("--background-primary", "#121212")
      root.style.setProperty("--background-secondary", "#1e1e1e")
      root.style.setProperty("--text-primary", "rgba(255, 255, 255, 0.87)")
      root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)")
    } else {
      // Light theme properties
      root.style.setProperty("--primary-color", "#3fa6ee")
      root.style.setProperty("--background-primary", "#ffffff")
      root.style.setProperty("--background-secondary", "#fafafa")
      root.style.setProperty("--text-primary", "rgba(0, 0, 0, 0.87)")
      root.style.setProperty("--text-secondary", "rgba(0, 0, 0, 0.6)")
    }
  }

  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme)
      console.log("Theme saved to localStorage:", theme)
    } catch (error) {
      console.warn("Error saving theme to localStorage:", error)
    }
  }

  private updateThemeColor(theme: Theme): void {
    try {
      let metaThemeColor = this.document.querySelector('meta[name="theme-color"]')

      if (!metaThemeColor) {
        metaThemeColor = this.document.createElement("meta")
        metaThemeColor.setAttribute("name", "theme-color")
        this.document.head.appendChild(metaThemeColor)
      }

      const color = theme === "dark" ? "#121212" : "#3fa6ee"
      metaThemeColor.setAttribute("content", color)
    } catch (error) {
      console.warn("Error updating theme color:", error)
    }
  }

  private listenToSystemThemeChanges(): void {
    try {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = (e: MediaQueryListEvent) => {
          // Only change if no theme is manually saved
          if (!localStorage.getItem(this.THEME_KEY)) {
            const systemTheme: Theme = e.matches ? "dark" : "light"
            console.log("System theme changed to:", systemTheme)
            this.setTheme(systemTheme)
          }
        }

        // Use the newer addEventListener if available, fallback to addListener
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handleChange)
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(handleChange)
        }
      }
    } catch (error) {
      console.warn("Error setting up system theme listener:", error)
    }
  }

  // Method to reset theme to system preference
  public resetToSystemTheme(): void {
    localStorage.removeItem(this.THEME_KEY)
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    this.setTheme(systemTheme)
  }

  // Method to check if theme is manually set
  public isThemeManuallySet(): boolean {
    return !!localStorage.getItem(this.THEME_KEY)
  }
}
