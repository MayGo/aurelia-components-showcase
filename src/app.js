import {Router, RouterConfiguration} from "aurelia-router";
import {AuthenticateStep} from "aurelia-authentication";
import {relativeToFile} from "aurelia-path";
import {Origin} from "aurelia-metadata";
import {
  inject,
  Container,
  ViewSlot,
  ViewLocator,
  customElement,
  noView,
  CompositionTransaction,
  CompositionEngine
} from "aurelia-framework";

@inject(Router, CompositionEngine)
export class App {
  constructor(router, compositionEngine) {
    this.router = router;
    this.compositionEngine = compositionEngine;
  }

  attached() {
    this.mapNavigation(this.router)
  }

  activate() {
    // console.table(this.router.navigation)
  }

  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.addPipelineStep('authorize', AuthenticateStep);

    config.map([

      //Nav menu
      {
        route: ['', 'dashboard'],
        name: 'dashboard',
        moduleId: './modules/dashboard/dashboard',
        nav: true,
        title: 'Dashboard',
        settings: {
          icon: 'icon-speedometer',
          isNew: true
        }
      },

      // Components menu
      {
        route: 'components',
        name: 'components',
        moduleId: './modules/components/components',
        nav: true,
        title: 'Components',
        settings: {
          navTitle: 'UI Elements'
        }
      },

      {
        route: 'components/switches',
        moduleId: './modules/components/switches',
        nav: true,
        title: 'Switches',
        settings: {
          parentRoute: 'components'
        }
      }
    ]);

    this.router = router;
  }

  mapNavigation(router) {
    console.log("Map children to navigation items.")
    var menuItems = [];
    router.navigation.forEach(function (menuItem) {
      if (menuItem.settings.parentRoute) {
        // Submenu children
        var parent = menuItems.find(x => x.relativeHref == menuItem.settings.parentRoute);
        // If it doesn't exist, then something went wrong, so not checking
        parent.children.push(menuItem);
      } else {
        // Just insert.  It should not be there multiple times or it's a bad route
        menuItems[menuItem] = menuItems[menuItem] || [];
        // Create empty children
        menuItem.children = [];
        menuItems.push(menuItem);
      }
    });
    return menuItems;
  }
}
