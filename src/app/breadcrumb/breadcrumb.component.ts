import {Component, OnInit, Input} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {BreadcrumbService} from "./breadcrumb.service";
import {BreadcrumbRoute, Breadcrumb} from "./breadcrumb-model";
import {Observable} from "rxjs/observable";

@Component({
  moduleId: "" + module.id,
  selector: "dcn-breadcrumb",
  styleUrls: ["breadcrumb.component.css"],
  template: `

<div class="breadcrumb">

    <div *ngFor="let route of breadcrumbRoutes; let inx = index; let isLast=last" class="breadcrumb-holder">
        <a [routerLink]="[route.url]" class="breadcrumb-link">
            <i *ngIf="route.breadcrumb.icon && inx==0" class="{{route.breadcrumb.icon}} home-icon"></i>
            <i *ngIf="route.breadcrumb.icon && inx!=0" class="{{route.breadcrumb.icon}} icon link-icon" ></i>
            <span *ngIf="!isString(route.breadcrumb.label)">{{route.breadcrumb.label |async}}</span>
            <span *ngIf="isString(route.breadcrumb.label)">{{route.breadcrumb.label}}</span>
        </a>
        <dcn-breadcrumb-popup [isLast]="isLast" [breadcrumbDropDown]="route.breadcrumb.dropDown"></dcn-breadcrumb-popup>
    </div>
</div>

`
})
export class BreadcrumbComponent implements OnInit {

  @Input()
  set homeBreadcrumb(breadcrumb: Breadcrumb) {
    if (breadcrumb) {
      this.homeBreadcrumbRoute.breadcrumb = breadcrumb;
    }
  }
  homeBreadcrumbRoute: BreadcrumbRoute;

  isString(val: string|Observable<string>) {
    return typeof val == "string";
  }

  get hasRoutes(): boolean {
    return this.breadcrumbRoutes && this.breadcrumbRoutes.length > 0;
  }

  public breadcrumbRoutes: BreadcrumbRoute[];

  constructor(private breadcrumbService: BreadcrumbService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.breadcrumbRoutes = [];
    this.homeBreadcrumbRoute = {
      breadcrumb: {
        label: "",
        icon: "fa fa-home home-icon"
      },
      url: "",
      params: undefined
    };
  }

  ngOnInit() {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbRoutes=[];
      this.breadcrumbRoutes.push(this.homeBreadcrumbRoute);
      this.breadcrumbRoutes.push(...this.breadcrumbService.getBreadcrumbs(this.activatedRoute.root)
        .filter(breadcrumb => !breadcrumb.breadcrumb.hide));
    });
  }
}
