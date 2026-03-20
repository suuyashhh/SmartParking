import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isOpen = signal<boolean>(false);

  get isOpen() {
    return this._isOpen();
  }

  toggle() {
    this._isOpen.update(val => !val);
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}
