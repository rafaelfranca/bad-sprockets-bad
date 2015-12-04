// TODO: write a spec
(function() {
  'use strict';
  angular.module('TegNg.ResponsiveMenu').directive('tegNgDropdown', ['TegNg.Elem.ElementHolder', 'TegNg.TouchTools.Tapable', '$rootScope', '$timeout', function(ElementHolder, Tapable, $rootScope, $timeout) {


    function DropdownGroup(){}
    DropdownGroup.create = function(name, scope){
      var group = DropdownGroup[name] = DropdownGroup[name] || [];
      if(group.indexOf(scope) < 0){
        group.push(scope);
      }
      return DropdownGroup[name];
    };

    function digest(context, funcName){
      return function(){
        $rootScope.$apply(function(){
          context[funcName]();
        });
        return false;
      };
    }

    var DropdownController = ['$scope', function($scope){

      this.toggleDropdown = function(){
        if(!$scope.isOpen){ this.closeOthers(); }
        $scope.isOpen = !$scope.isOpen;
      };

      this.closeOthers = function(){
        $scope.group.forEach(function(scope){
          scope.isOpen = false;
        });
      };
    }];

    return {
      restrict: 'A',
      scope: true,
      replace: true,
      controller: DropdownController,

      link: function(scope, element, attrs, ctrl){

        var elementToggle, elementTarget,
            elementFinder = new ElementHolder(scope),
            clickOffElem = angular.element('body'),

            openOnInit = attrs.openOnInit || false,
            groupName = attrs.group || false,
            cssExpanded = attrs.cssExpanded || 'Dropdown--is-expanded',
            cssToggleExpanded = attrs.cssToggleExpanded || cssExpanded;

        scope.group = groupName ? DropdownGroup.create(groupName, scope) : undefined;

        elementToggle = elementFinder.find('dropdown_toggle', function(toggle){
          Tapable.create(toggle, true).onTap(digest(ctrl, 'toggleDropdown'));
        });

        elementTarget = elementFinder.find('dropdown_target',function(target){
          scope.$watch('isOpen', function(isOpen){
            if(isOpen){
              target.addClass(cssExpanded);
              elementToggle.addClass(cssToggleExpanded);
            }else{
              target.removeClass(cssExpanded);
              elementToggle.removeClass(cssToggleExpanded);
            }
          });
        });

        clickOffElem.on('click', function(evt){
          if(angular.element(evt.target).attr('teg-ng-elem') !== 'dropdown_toggle'){
            $timeout(function(){
              digest(ctrl, 'closeOthers')();
            }, 400);
          }
        });

        scope.isOpen = openOnInit;
      }
    };

  }]);
}());
