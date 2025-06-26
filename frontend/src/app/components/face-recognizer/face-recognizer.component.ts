import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-face-recognizer',
  standalone: true,
  imports: [CommonModule, FormsModule, WebcamModule],
  templateUrl: './face-recognizer.component.html',
  styleUrls: ['./face-recognizer.component.css']
})
export class FaceRecognizerComponent implements OnInit {
  selectedFile: File | null = null;
  resultMessage = '';
  loading = false;

  useWebcam = false;
  webcamImage: string | null = null;
  private trigger: Subject<void> = new Subject<void>();

  logs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLogs(); // ✅ Automatically load logs on component init
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.selectedFile = fileInput.files[0];
      this.useWebcam = false;
    }
  }

  toggleWebcam() {
    this.useWebcam = !this.useWebcam;
    this.webcamImage = null;
    this.selectedFile = null;
  }

  triggerSnapshot() {
    this.trigger.next();
  }

  handleImage(webcamImage: any) {
    this.webcamImage = webcamImage.imageAsDataUrl;
    this.dataUrlToFile(this.webcamImage!, 'webcam.jpg').then(file => {
      this.selectedFile = file;
    });
  }

  get triggerObservable() {
    return this.trigger.asObservable();
  }

  async dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  submitImage() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.loading = true;
    this.resultMessage = '';

    this.http.post<any>('http://localhost:8000/recognize-face/', formData).subscribe({
      next: (res) => {
        this.resultMessage = `✅ Recognized: ${res.name}`;
        this.loading = false;
        this.fetchLogs(); // ✅ Refresh logs
      },
      error: () => {
        this.resultMessage = '❌ Could not recognize face.';
        this.loading = false;
      }
    });
  }

  fetchLogs() {
    this.http.get<any[]>('http://127.0.0.1:8000/attendance-logs/').subscribe({
      next: (data) => this.logs = data,
      error: (err) => console.error('Error fetching logs:', err)
    });
  }

  async registerPasskey() {
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Face Attendance App",
          },
          user: {
            id: new Uint8Array(16),
            name: "user@example.com",
            displayName: "Jeffrey Jones"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      console.log("✅ Registered Touch ID:", cred);
      alert("✅ Touch ID registered successfully!");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert("Failed to register Touch ID.");
    }
  }

  async verifyWithFingerprint() {
    try {
      const cred = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "required"
        }
      });

      console.log("✅ Fingerprint verified:", cred);
      this.resultMessage = '✅ Touch ID authentication passed.';
    } catch (err) {
      console.error('❌ Touch ID failed or cancelled', err);
      this.resultMessage = '❌ Touch ID failed or cancelled.';
    }
  }
}