import { Component } from "@angular/core"
import { LoadingService } from "../../services/loading.service"

@Component({
  selector: "app-loading-overlay",
  templateUrl: "./loading-overlay.component.html",
  styleUrls: ["./loading-overlay.component.css"],
})
export class LoadingOverlayComponent {
  constructor(public loadingService: LoadingService) {}
}
