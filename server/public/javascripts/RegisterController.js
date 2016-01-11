/**
 * Created by dougritzinger on 10/21/15.
 */
app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location){

    console.log('reached the Register controller');
    $scope.message = "Welcome to the Register page.";

    $scope.register = function() {
        console.log('saw register click');

        var regObject = {
            username : $scope.username,
            password : $scope.password
        };

        $http({
            method: "POST",
            url: "users/reg",
            data: regObject
        }).then(function (response) {
            console.log('client reg response ', response);
            if(response.data == "200") {
                alert("Thank you for registering, now you may log in.");
                $location.path('/login');
            } else {
                alert("There was a problem registering you, please try again");
                console.log('There was an error registering');
            }
        });
    }
}]);
