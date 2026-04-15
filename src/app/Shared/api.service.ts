import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.BASE_URL.replace(/\/+$/, '') + '/';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initOperatorIP();
    }
  }

  // AES KEY + FIXED IV (MUST MATCH BACKEND)
  private key = CryptoJS.enc.Utf8.parse(environment.ENCRYPT_KEY || 'default_key_12345');
  private iv = CryptoJS.enc.Utf8.parse("0000000000000000");

  /**
   * Encrypt outgoing request body if needed
   */
  private encryptObject(obj: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(obj),
      this.key,
      { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    ).toString();
  }

  /**
   * Decrypt backend response if encrypted
   */
  public decryptResponse(res: any): any {
    try {
      if (!res || !res.data) return res;

      const bytes = CryptoJS.AES.decrypt(
        res.data,
        this.key,
        { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error("❌ Failed to decrypt API response:", e);
      return res;
    }
  }

  /**
   * Auto-attach operator metadata for tracking
   */
  private getOperatorMeta() {
    const user = this.auth.getCurrentUser() ?? {};
    const isBrowser = isPlatformBrowser(this.platformId);
    return {
      operator_id: user?.INI ?? user?.ini ?? null,
      operator_name: user?.NAME ?? user?.name ?? null,
      brnc_Code: isBrowser ? sessionStorage.getItem('branchCode') : null,
      operator_ip: isBrowser ? sessionStorage.getItem('operator_ip') : '0.0.0.0'
    };
  }

  public initOperatorIP(): Promise<string> {
    // Note: This endpoint depends on a server-side route or external service
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
      .toPromise()
      .then(res => {
          const ip = res?.ip ?? '0.0.0.0';
          if (isPlatformBrowser(this.platformId)) {
              sessionStorage.setItem('operator_ip', ip);
          }
          return ip;
      })
      .catch(() => '0.0.0.0');
  }

  /**
   * Standard Headers including Auth Token
   */
  private getHeaders(extra: Record<string, string> = {}): HttpHeaders {
    const user = this.auth.getCurrentUser();
    const token = user?.token || user?.TOKEN;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      ...extra
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /* =========================================================
   * HTTP METHODS
   * ========================================================= */

  get<T = any>(endpoint: string, params: any = {}) {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: httpParams,
      observe: 'body'
    });
  }

  post<T = any>(
    endpoint: string,
    body: any,
    additionalHeaders: Record<string, string> = {}
  ) {
    const operatorMeta = this.getOperatorMeta();

    const finalBody = {
      ...body,
      ...operatorMeta
    };

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, finalBody, {
      headers: this.getHeaders(additionalHeaders),
      observe: 'body'
    });
  }

  put<T = any>(
    endpoint: string,
    body: any,
    additionalHeaders: Record<string, string> = {}
  ) {
    const operatorMeta = this.getOperatorMeta();

    const finalBody = {
      ...body,
      ...operatorMeta
    };

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, finalBody, {
      headers: this.getHeaders(additionalHeaders),
      observe: 'body'
    });
  }

  delete<T = any>(
    endpoint: string,
    params: any = {},
    additionalHeaders: Record<string, string> = {}
  ) {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(additionalHeaders),
      params: httpParams,
      observe: 'body'
    });
  }

  getFile(url: string) {
    return this.http.get(this.baseUrl + url, {
      responseType: 'blob'
    });
  }

  /**
   * Utility to extract human-readable error messages
   */
  extractErrorMessage(err: any): string {
    if (!err) return 'Unknown error occurred.';

    if (typeof err.error === 'string') {
      return err.error;
    }

    if (typeof err.error === 'object' && err.error?.message) {
      return err.error.message;
    }

    if (err.status === 500) return 'Internal server error. Please contact support.';
    if (err.status === 404) return 'Resource not found.';
    if (err.status === 400) return 'Bad request. Please check your input.';
    if (err.status === 401) return 'Unauthorized. Please log in again.';

    return err.message ?? 'Something went wrong.';
  }
}
