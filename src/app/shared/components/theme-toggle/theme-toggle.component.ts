import {
  Component,
  type ElementRef,
  ViewChild,
  type OnInit,
  type OnDestroy,
  ChangeDetectorRef,
  type AfterViewInit,
} from "@angular/core"
import { ThemeService } from "../../services/theme.service"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-theme-toggle",
  templateUrl: "./theme-toggle.component.html",
  styleUrls: ["./theme-toggle.component.css"],
})
export class ThemeToggleComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("toggleButton", { static: false }) toggleButton?: ElementRef<HTMLButtonElement>

  isDarkTheme = false
  private destroy$ = new Subject<void>()

  constructor(
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.isDarkTheme = theme === "dark"
      this.cdr.detectChanges()
      console.log("Theme toggle component updated, isDarkTheme:", this.isDarkTheme)
    })

    // Set initial state
    this.isDarkTheme = this.themeService.isDarkTheme()
  }

  ngAfterViewInit(): void {
    // Ensure the ViewChild is properly initialized
    console.log("Theme toggle ViewChild initialized:", !!this.toggleButton)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  toggleTheme(): void {
    console.log("Theme toggle button clicked")

    // Add changing class for animation with proper null checks
    if (this.toggleButton?.nativeElement) {
      try {
        this.toggleButton.nativeElement.classList.add("changing")

        setTimeout(() => {
          if (this.toggleButton?.nativeElement) {
            this.toggleButton.nativeElement.classList.remove("changing")
          }
        }, 800)
      } catch (error) {
        console.warn("Error adding animation class:", error)
      }
    } else {
      console.warn("Toggle button element not available for animation")
    }

    // Always toggle the theme regardless of animation
    this.themeService.toggleTheme()
  }

  // Alternative method without ViewChild dependency
  toggleThemeWithEvent(event: Event): void {
    console.log("Theme toggle button clicked (event method)")

    const buttonElement = event.target as HTMLButtonElement
    if (buttonElement) {
      try {
        buttonElement.classList.add("changing")

        setTimeout(() => {
          buttonElement.classList.remove("changing")
        }, 800)
      } catch (error) {
        console.warn("Error adding animation class:", error)
      }
    }

    this.themeService.toggleTheme()
  }

  // Getter for template binding
  get currentTheme(): string {
    return this.themeService.getCurrentTheme()
  }

  // Method to reset to system theme (for debugging)
  resetToSystemTheme(): void {
    this.themeService.resetToSystemTheme()
  }
}
