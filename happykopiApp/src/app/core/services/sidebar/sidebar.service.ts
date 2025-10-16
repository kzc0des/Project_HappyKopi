import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private renderer: Renderer2;
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  public isSidebarOpen$ = this.isSidebarOpen.asObservable();

  private currentSelectedPage = new BehaviorSubject<string>('Dashboard');
  public currentSelectedPage$ = this.currentSelectedPage.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  openSidebar() {
    this.isSidebarOpen.next(true);
    this.renderer.addClass(document.body, 'sidebar-open');
  }

  closeSidebar() {
    this.isSidebarOpen.next(false);
    this.renderer.removeClass(document.body, 'sidebar-open');
  }

  toggleSidebar() {
    if (this.isSidebarOpen.value) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  selectPage(page:string) {
    this.currentSelectedPage.next(page);
    console.log(this.currentSelectedPage.value);
  }
}
