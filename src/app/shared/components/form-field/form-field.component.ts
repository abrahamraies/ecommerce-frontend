import { Component, Input, forwardRef } from "@angular/core"
import { type ControlValueAccessor, NG_VALUE_ACCESSOR, type FormControl } from "@angular/forms"

@Component({
  selector: "app-form-field",
  templateUrl: "./form-field.component.html",
  styleUrls: ["./form-field.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label = ""
  @Input() type = "text"
  @Input() placeholder = ""
  @Input() required = false
  @Input() control: FormControl | null = null
  @Input() icon = ""
  @Input() hint = ""
  @Input() appearance: "fill" | "outline" = "outline"

  value = ""
  disabled = false

  private onChange = (value: string) => {}
  private onTouched = () => {}

  writeValue(value: string): void {
    this.value = value || ""
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.value = target.value
    this.onChange(this.value)
  }

  onBlur(): void {
    this.onTouched()
  }

  getErrorMessage(): string {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return ""
    }

    const errors = this.control.errors

    if (errors["required"]) {
      return `${this.label} is required`
    }
    if (errors["email"]) {
      return "Please enter a valid email address"
    }
    if (errors["minlength"]) {
      return `${this.label} must be at least ${errors["minlength"].requiredLength} characters`
    }
    if (errors["maxlength"]) {
      return `${this.label} cannot exceed ${errors["maxlength"].requiredLength} characters`
    }
    if (errors["pattern"]) {
      return `${this.label} format is invalid`
    }

    return "Invalid input"
  }

  hasError(): boolean {
    return !!(this.control && this.control.errors && this.control.touched)
  }
}
