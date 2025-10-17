import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private renderer: Renderer2;
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  public isSidebarOpen$ = this.isSidebarOpen.asObservable();

  private currentSelectedPage = new BehaviorSubject<string>('');
  public currentSelectedPage$ = this.currentSelectedPage.asObservable();

  constructor(rendererFactory: RendererFactory2, private router: Router) {
    this.renderer = rendererFactory.createRenderer(null, null);

    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentRoute = event.urlAfterRedirects;
      const pathWithoutSlash = currentRoute.substring(1); 
      const routeSegments = pathWithoutSlash.split('/'); 
      const pageName = routeSegments[1]; 
      this.selectPage(pageName);
    });
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
  }
}
