(function() {
  'use strict';
  angular.module('TegNg.ResponsiveMenu').directive('tegNgResponsiveMenu',function(){
    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      replace: true,
      templateUrl: 'responsive_menu/templates/responsive_menu.html',
      link: function(scope, element, attrs, ctrl, transclude){
        // apply the responsive menu's scope to the sub elements
        transclude(scope, function(clone){
          element.append(clone);
        });

        // HACK: Viewscaling when opening menu
        // View scaling on mobile is stealing our scroll events in ios and is incompatible with
        // being able to to scroll the menu because of the way the new ios safari works.
        // Here we are setting custom view scaling settings but only while the menu is open as a work around.
        var viewport = document.querySelector("meta[name=viewport]"),
            viewportContent = viewport.getAttribute('content');

        scope.$watch('isOpen', function(isOpen){
          if(isOpen){
            viewport.setAttribute('content', 'width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=no');
          }else{
            viewport.setAttribute('content', viewportContent);
          }
        });

      }
    };
  });
}());
