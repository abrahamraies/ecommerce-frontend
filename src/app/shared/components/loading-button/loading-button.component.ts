import { Component, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-loading-button",
  templateUrl: "./loading-button.component.html",
  styleUrls: ["./loading-button.component.css"],
})
export class LoadingButtonComponent {
  @Input() loading = false
  @Input() disabled = false
  @Input() type: "button" | "submit" = "button"
  @Input() color: "primary" | "accent" | "warn" = "primary"
  @Input() variant: "basic" | "raised" | "stroked" | "flat" = "raised"
  @Input() size: "small" | "medium" | "large" = "medium"
  @Input() fullWidth = false
  @Input() icon = ""
  @Input() loadingText = "Loading..."
  @Input() ariaLabel = ""

  @Output() clicked = new EventEmitter<void>()

  onClick(): void {
    if (!this.loading && !this.disabled) {
      this.clicked.emit()
    }
  }

  get buttonClass(): string {
    const classes = ["loading-button"]

    if (this.fullWidth) classes.push("full-width")
    if (this.size) classes.push(`size-${this.size}`)

    return classes.join(" ")
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading
  }
}
