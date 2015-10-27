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
      return {
        navigateTo: function(url) {
          $.pjax({
            url: url,
            container: pjaxOptions.container
          });
        }
      };
    };
  });

  angularPJAXModule.directive('pjaxContainer', function() {
    return {
      scope:true,
      controller: ['$rootScope', '$scope', '$window', '$timeout', '$compile', '$element', function($rootScope, $scope, $window, $timeout, $compile, $element) {
        var contentScope = $scope,
            parentScope = $scope.$parent;;

        var updateCurrentPath = function() {
          $rootScope.currentPath = $window.location.pathname;
        };

        $element.attr('data-pjax-container', true);

        $(document).pjax('a:not([data-remote]):not([data-behavior]):not([data-skip-pjax])', pjaxOptions);

        $(document).on('pjax:start', function() {
          $timeout(function() {
            $rootScope.contentLoading = true;
          });
        });

        $(document).on('pjax:beforeReplace', function() {
          $timeout(function() {
            if (contentScope) {
              contentScope.$destroy();
            }
          });
        });

        $(document).on('pjax:end', function() {
          $timeout(function() {
            updateCurrentPath();

            contentScope = parentScope.$new(false, parentScope);

            $element.html($compile($element.html())(contentScope));

            $rootScope.contentLoading = false;
          });
        });

        updateCurrentPath();
      }]
    };
  });

}).call(this);
