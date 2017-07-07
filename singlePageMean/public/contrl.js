var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    $scope.users = [];
    // when landing on the page, get all todos and show them
    $scope.getAll = function() {
        $http.get('/api/users')
            .success(function(data) {
                $scope.users = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when submitting the add form, send the text to the node API
    $scope.create = function() {
        $http.post('/api/users', $scope.formData)
            .success(function(data) {
                console.log(data);
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.users = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}]);
