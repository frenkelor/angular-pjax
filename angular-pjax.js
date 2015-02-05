(function() {

  var angularPJAXModule = angular.module('ngPJAX', []);

  var pjaxOptions = {
    container: '[data-pjax-container]'
  };

  angularPJAXModule.provider('pjax', function() {
    this.config = function(options) {
      angular.extend(pjaxOptions, options);
    };

    this.$get = function() {
      return {};
    };
  });

  angularPJAXModule.directive('pjaxContainer', function() {
    return {
      controller: ['$rootScope', '$scope', '$window', '$compile', '$element', function($rootScope, $scope, $window, $compile, $element) {
        var content, contentScope = null;

        var updateCurrentPath = function() {
          $rootScope.currentPath = $window.location.pathname;
        };

        $element.attr('data-pjax-container', true);

        $(document).pjax('a:not([data-remote]):not([data-behavior]):not([data-skip-pjax])', pjaxOptions);

        $(document).on('pjax:start', function() {
          $rootScope.$apply(function() {
            $rootScope.contentLoading = true;
          });
        });

        $(document).on('pjax:beforeReplace', function() {
          if (contentScope) {
            contentScope.$destroy();
          }
        });

        $(document).on('pjax:end', function() {
          $rootScope.$apply(updateCurrentPath);

          contentScope = $scope.$new(false, $scope);

          $element.html($compile($element.html())(contentScope));

          $rootScope.$apply(function() {
            $rootScope.contentLoading = false;
          });
        });

        updateCurrentPath();
      }]
    };
  });

}).call(this);
