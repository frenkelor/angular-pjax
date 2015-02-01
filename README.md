This is a simple AngularJS module that uses [PJAX](https://github.com/defunkt/jquery-pjax) to load HTML content from a server, compiles it, and then inserts it into the DOM.

It depends on AngularJS, jQuery, and PJAX.

Here is a basic setup with a Rails backend:

In your JavaScript:
```javascript
var myApp = angular.module('myApp', ['ngPJAX']);
```

In your application layout:
```erb
<body ng-app="myApp" ng-class="{ loading: loading }">
  <div role="main" pjax-container>
    <%= yield %>
  </div>
</body>
```

In your application controller:
```ruby
class ApplicationController < ActionController::Base
  layout :layout_for_request

  private

  def layout_for_request(default_layout = 'application')
    request.headers['X-PJAX'] ? false : default_layout
  end
end
```
